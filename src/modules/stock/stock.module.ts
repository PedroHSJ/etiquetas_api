import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../product/entities/product.entity";
import { Stock } from "./entities/stock.entity";
import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";
import { ProductGroup } from "../product-groups/entities/product-groups.entity";
import { ProductSubgroup } from "../product-subgroup/entities/product-subgroup.entity";
import { Unit } from "../product/entities/unit.entity";
import { StockMovement } from "../stock-movement/entities/stock-movement.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stock,
      StockMovement,
      Product,
      ProductGroup,
      ProductSubgroup,
      Unit,
    ]),
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
