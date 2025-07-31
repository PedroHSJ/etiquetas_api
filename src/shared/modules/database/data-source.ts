import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";

let dataSource: DataSource | null = null;

export async function getDataSource(
  config: ConfigService,
): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: "postgres",
    host: config.get<string>("DB_HOST"),
    port: parseInt(config.get<string>("DB_PORT", "5432")),
    username: config.get<string>("DB_USERNAME"),
    password: config.get<string>("DB_PASSWORD"),
    database: config.get<string>("DB_NAME"),
    entities: [__dirname + "/../../**/*.entity.{js,ts}"],
    synchronize: false,
    ssl:
      config.get<string>("NODE_ENV") === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  return dataSource;
}
