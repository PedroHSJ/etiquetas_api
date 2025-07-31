import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductGroup } from "../product-groups/entities/product-groups.entity";
import { ProductSubgroup } from "../product-subgroup/entities/product-subgroup.entity";
import { Product } from "./entities/product.entity";
import { Unit } from "./entities/unit.entity";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { HttpModule } from "@nestjs/axios";
import { OpenFoodFactsService } from "./open-food-facts.service";

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([Product, ProductGroup, ProductSubgroup, Unit]),
  ],
  controllers: [ProductController],
  providers: [ProductService, OpenFoodFactsService],
  exports: [ProductService, OpenFoodFactsService],
})
export class ProductModule {}
