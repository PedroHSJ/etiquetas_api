import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseService } from "./database.service";
import { ConfigurationEntity } from "./entities/configurarion.entity";

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
              ssl: {
                rejectUnauthorized: false, // necessário para o Supabase
              },
            }
          : {
              type: "postgres",
              host: config.get<string>("DB_HOST"),
              port: config.get<number>("DB_PORT"),
              username: config.get<string>("DB_USERNAME"),
              password: config.get<string>("DB_PASSWORD"),
              database: config.get<string>("DB_NAME"),
              entities: [__dirname + "/../**/*.entity{.ts,.js}"],
            },
    }),
    TypeOrmModule.forFeature([ConfigurationEntity]),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
