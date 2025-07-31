// src/services/stock.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Product } from "../product/entities/product.entity";

import { CreateStockEntryDto } from "./dto/create-stock-entry.dto";
import { Stock } from "./entities/stock.entity";
import { Transactional } from "typeorm-transactional";
import {
  MovementType,
  StockMovement,
} from "../stock-movement/entities/stock-movement.entity";

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(StockMovement)
    private stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  @Transactional()
  async createStockEntry(
    createStockEntryDto: CreateStockEntryDto,
    userId: number,
  ) {
    try {
      const movements = [];

      for (const item of createStockEntryDto.items) {
        // Verificar se o produto existe
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Produto com ID ${item.productId} não encontrado`,
          );
        }

        // Buscar ou criar registro de estoque
        let stock = await this.stockRepository.findOne({
          where: {
            subworkspaceId: createStockEntryDto.subworkspaceId,
            productId: item.productId,
          },
        });

        if (!stock) {
          stock = await this.stockRepository.create({
            subworkspaceId: createStockEntryDto.subworkspaceId,
            productId: item.productId,
            currentQuantity: 0,
            reservedQuantity: 0,
            lastEntryDate: null,
            lastExitDate: null,
          });
          stock = await this.stockRepository.save(stock);
        }

        // Atualizar quantidade em estoque
        stock.currentQuantity =
          Number(stock.currentQuantity) + Number(item.quantity);
        stock.lastEntryDate = new Date();

        await this.stockRepository.save(stock);

        // Criar movimento de estoque
        const movement = this.stockMovementRepository.create({
          subworkspaceId: createStockEntryDto.subworkspaceId,
          productId: item.productId,
          userId,
          movementType: MovementType.ENTRY,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: item.unitCost ? item.unitCost * item.quantity : null,
          lotNumber: item.lotNumber,
          expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
          supplier: createStockEntryDto.supplier,
          invoiceNumber: createStockEntryDto.invoiceNumber,
          notes: item.notes || createStockEntryDto.notes,
        });

        const savedMovement = await this.stockMovementRepository.save(movement);
        movements.push(savedMovement);
      }

      return { success: true, movements };
    } catch (error) {
      throw error;
    }
  }

  async getStockBySubworkspace(subworkspaceId: number) {
    return this.stockRepository.find({
      where: { subworkspaceId },
      relations: [
        "product",
        "product.productSubgroup",
        "product.productSubgroup.productGroup",
        "product.defaultUnit",
      ],
    });
  }

  async getStockMovements(subworkspaceId: number, limit = 50) {
    return this.stockMovementRepository.find({
      where: { subworkspaceId },
      relations: ["product", "user"],
      order: { createdAt: "DESC" },
      take: limit,
    });
  }
}
