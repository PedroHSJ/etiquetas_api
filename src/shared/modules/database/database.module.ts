import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import dataSource from "./data-source";
import { addTransactionalDataSource } from "typeorm-transactional";
import { DataSource } from "typeorm";
import { DatabaseService } from "./database.service";
import { ConfigurationEntity } from "./entities/configurarion.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return dataSource.options;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error("Invalid options passed");
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    TypeOrmModule.forFeature([ConfigurationEntity]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
