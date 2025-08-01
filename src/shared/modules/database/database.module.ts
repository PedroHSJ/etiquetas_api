import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseService } from "./database.service";
import { ConfigurationEntity } from "./entities/configurarion.entity";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) =>
        process.env.NODE_ENV === "production"
          ? {
              type: "postgres",
              url: config.get<string>("DATABASE_URL"),
              schema: config.get<string>("DB_SCHEMA"),
              ssl: {
                rejectUnauthorized: false, // necessário para o Supabase
              },
              entities: [
                join(
                  __dirname,
                  "../../../modules/**/entities/*.entity{.ts,.js}",
                ),
                ConfigurationEntity,
              ],
            }
          : {
              ssl: {
                rejectUnauthorized: false, // necessário para o Supabase
              },
              type: "postgres",
              host: config.get<string>("DB_HOST"),
              port: config.get<number>("DB_PORT"),
              username: config.get<string>("DB_USERNAME"),
              password: config.get<string>("DB_PASSWORD"),
              database: config.get<string>("DB_NAME"),
              schema: config.get<string>("DB_SCHEMA"),
              entities: [
                join(
                  __dirname,
                  "../../../modules/**/entities/*.entity{.ts,.js}",
                ),
                ConfigurationEntity,
              ],
            },
    }),
    TypeOrmModule.forFeature([ConfigurationEntity]),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}

// postgresql://postgres:QLJIgKNyWEibGpBPjBYeQzqNPTBUPYJR@mainline.proxy.rlwy.net:27130/railway

// postgresql://postgres:Vs6OHENHpsD0yAte@db.wchteqronqwfvatpitzl.supabase.co:5432/postgres
