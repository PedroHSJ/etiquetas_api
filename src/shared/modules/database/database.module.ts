import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getDataSource } from "./data-source";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const dataSource = await getDataSource(config);

        return {
          ...dataSource.options,
          keepConnectionAlive: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
