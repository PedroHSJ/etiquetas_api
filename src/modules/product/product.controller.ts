// src/controllers/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  Param,
  HttpException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { ProductService } from "./product.service";
import { ProductSubgroupDto } from "./dto/product-subgroup.dto";
import {
  ProductGroupDto,
  ProductDto,
  UnitDto,
  CreateProductDto,
} from "./dto/product.dto";
import {
  OpenFoodFactsService,
  SearchProductDto,
} from "./open-food-facts.service";

@ApiTags("Products")
@Controller("products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly openFoodFactsService: OpenFoodFactsService,
  ) {}

  @Get("groups")
  @ApiOperation({
    summary: "Get all product groups",
    description: "Retrieve all active product groups with their subgroups",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product groups retrieved successfully",
    type: ProductGroupDto,
    isArray: true,
  })
  async getProductGroups(): Promise<ProductGroupDto[]> {
    return this.productService.getProductGroups();
  }

  @Get("subgroups")
  @ApiOperation({
    summary: "Get product subgroups",
    description: "Retrieve product subgroups, optionally filtered by group ID",
  })
  @ApiQuery({
    name: "groupId",
    required: false,
    type: Number,
    description: "Filter subgroups by product group ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product subgroups retrieved successfully",
    type: ProductSubgroupDto,
    isArray: true,
  })
  async getProductSubgroups(
    @Query("groupId") groupId?: number,
  ): Promise<ProductSubgroupDto[]> {
    return this.productService.getProductSubgroups(groupId);
  }

  @Get()
  @ApiOperation({
    summary: "Get products",
    description: "Retrieve products, optionally filtered by subgroup ID",
  })
  @ApiQuery({
    name: "subgroupId",
    required: false,
    type: Number,
    description: "Filter products by subgroup ID",
  })
  @ApiQuery({
    name: "term",
    required: false,
    type: String,
    description: "Search term for product name",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Products retrieved successfully",
    type: ProductDto,
    isArray: true,
  })
  async getProducts(
    @Query("subgroupId") subgroupId?: number,
    @Query("term") term?: string,
  ): Promise<ProductDto[]> {
    return this.productService.getProducts(subgroupId, term);
  }

  @Get("units")
  @ApiOperation({
    summary: "Get all units",
    description: "Retrieve all available measurement units",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Units retrieved successfully",
    type: UnitDto,
    isArray: true,
  })
  async getUnits(): Promise<UnitDto[]> {
    return this.productService.getUnits();
  }

  // @Get("search")
  // @ApiOperation({
  //   summary: "Search products",
  //   description: "Search products by name, SKU, or barcode",
  // })
  // @ApiQuery({
  //   name: "q",
  //   required: true,
  //   type: String,
  //   description: "Search term (name, SKU, or barcode)",
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "Search results",
  //   type: ProductDto,
  //   isArray: true,
  // })
  // async searchProducts(@Query("q") search: string): Promise<ProductDto[]> {
  //   return this.productService.searchProducts(search);
  // }

  @Post()
  @ApiOperation({
    summary: "Create product",
    description: "Create a new product",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Product created successfully",
    type: ProductDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data",
  })
  async createProduct(
    @Body() productData: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productService.createProduct(productData);
  }

  // @Get("search")
  // @ApiOperation({
  //   summary: "Buscar produtos por nome, marca ou código de barras",
  // })
  // @ApiQuery({ name: "name", required: false, description: "Nome do produto" })
  // @ApiQuery({
  //   name: "barcode",
  //   required: false,
  //   description: "Código de barras",
  // })
  // @ApiQuery({ name: "brand", required: false, description: "Marca do produto" })
  // @ApiQuery({
  //   name: "limit",
  //   required: false,
  //   description: "Limite de resultados (padrão: 10)",
  // })
  // async searchProducts(@Query() searchDto: SearchProductDto) {
  //   if (!searchDto.name && !searchDto.barcode && !searchDto.brand) {
  //     throw new HttpException(
  //       "É necessário fornecer pelo menos um parâmetro de busca",
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return await this.openFoodFactsService.searchProducts(searchDto);
  // }

  // @Get("barcode/:barcode")
  // @ApiOperation({ summary: "Buscar produto por código de barras" })
  // @ApiResponse({ status: 200, description: "Produto encontrado" })
  // @ApiResponse({ status: 404, description: "Produto não encontrado" })
  // async findByBarcode(@Param("barcode") barcode: string) {
  //   const product =
  //     await this.openFoodFactsService.findProductByBarcode(barcode);

  //   if (!product) {
  //     throw new HttpException("Produto não encontrado", HttpStatus.NOT_FOUND);
  //   }

  //   return product;
  // }

  // @Get("popular/:category")
  // @ApiOperation({ summary: "Buscar produtos populares por categoria" })
  // @ApiQuery({
  //   name: "limit",
  //   required: false,
  //   description: "Limite de resultados (padrão: 10)",
  // })
  // async getPopularByCategory(
  //   @Param("category") category: string,
  //   @Query("limit") limit?: number,
  // ) {
  //   return await this.openFoodFactsService.getPopularProductsByCategory(
  //     category,
  //     limit || 10,
  //   );
  // }
}
