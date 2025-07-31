// src/services/product.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";
import { Product } from "./entities/product.entity";
import { Unit } from "./entities/unit.entity";
import {
  ProductGroupDto,
  ProductDto,
  UnitDto,
  CreateProductDto,
} from "./dto/product.dto";
import { ProductSubgroupDto } from "./dto/product-subgroup.dto";
import { ProductGroup } from "../product-groups/entities/product-groups.entity";
import { ProductSubgroup } from "../product-subgroup/entities/product-subgroup.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductGroup)
    private productGroupRepository: Repository<ProductGroup>,
    @InjectRepository(ProductSubgroup)
    private productSubgroupRepository: Repository<ProductSubgroup>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  async getProductGroups(): Promise<ProductGroupDto[]> {
    // Buscar apenas os grupos, sem subgrupos para evitar o loop
    const entities = await this.productGroupRepository
      .createQueryBuilder("group")
      .where("group.active = :active", { active: true })
      .orderBy("group.name", "ASC")
      .getMany();

    return plainToInstance(ProductGroupDto, entities, {
      excludeExtraneousValues: true,
    });
  }

  async getProductSubgroups(groupId?: number): Promise<ProductSubgroupDto[]> {
    const queryBuilder = this.productSubgroupRepository
      .createQueryBuilder("subgroup")
      .where("subgroup.active = :active", { active: true });

    if (groupId) {
      queryBuilder.andWhere("subgroup.productGroupId = :groupId", { groupId });
    }

    const entities = await queryBuilder
      .orderBy("subgroup.name", "ASC")
      .getMany();

    return plainToInstance(ProductSubgroupDto, entities, {
      excludeExtraneousValues: true,
    });
  }

  async getProducts(subgroupId?: number, term?: string): Promise<ProductDto[]> {
    const queryBuilder = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.productSubgroup", "subgroup")
      .leftJoinAndSelect("subgroup.productGroup", "group")
      .leftJoinAndSelect("product.defaultUnit", "unit")
      .where("product.active = :active", { active: true })
      .andWhere("product.name ILIKE :term", { term: `%${term}%` })
      .orWhere("product.description ILIKE :term", { term: `%${term}%` });

    if (subgroupId) {
      queryBuilder.andWhere("product.productSubgroupId = :subgroupId", {
        subgroupId,
      });
    }

    const entities = await queryBuilder
      .orderBy("product.name", "ASC")
      .getMany();

    return plainToInstance(ProductDto, entities, {
      excludeExtraneousValues: true,
    });
  }

  async getUnits(): Promise<UnitDto[]> {
    const entities = await this.unitRepository
      .createQueryBuilder("unit")
      .where("unit.active = :active", { active: true })
      .orderBy("unit.name", "ASC")
      .getMany();

    return plainToInstance(UnitDto, entities, {
      excludeExtraneousValues: true,
    });
  }

  async createProduct(productData: CreateProductDto): Promise<ProductDto> {
    const product = this.productRepository.create(productData);
    const savedEntity = await this.productRepository.save(product);

    // Buscar o produto salvo com as relações usando QueryBuilder
    const entityWithRelations = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.productSubgroup", "subgroup")
      .leftJoinAndSelect("subgroup.productGroup", "group")
      .leftJoinAndSelect("product.defaultUnit", "unit")
      .where("product.id = :id", { id: savedEntity.id })
      .getOne();

    return plainToInstance(ProductDto, entityWithRelations, {
      excludeExtraneousValues: true,
    });
  }

  async searchProducts(search: string): Promise<ProductDto[]> {
    const entities = await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.productSubgroup", "subgroup")
      .leftJoinAndSelect("subgroup.productGroup", "group")
      .leftJoinAndSelect("product.defaultUnit", "unit")
      .where("product.active = :active", { active: true })
      .andWhere(
        "(product.name ILIKE :search OR product.sku ILIKE :search OR product.barcode ILIKE :search)",
        { search: `%${search}%` },
      )
      .orderBy("product.name", "ASC")
      .take(50)
      .getMany();

    return plainToInstance(ProductDto, entities, {
      excludeExtraneousValues: true,
    });
  }
}
