import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { join } from "path";
import { SeederOptions } from "typeorm-extension";
import { ConfigurationEntity } from "./entities/configurarion.entity";

config();

const options: DataSourceOptions = {
  type:
    (process.env.DB_DIALECT as
      | "mysql"
      | "mariadb"
      | "postgres"
      | "mssql"
      | "oracle") || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "nutri_flow",
  schema:
    process.env.NODE_ENV === "test"
      ? `${process.env.DB_SCHEMA}_test`
      : process.env.DB_SCHEMA || "nutri_flow",
  entities: [
    join(__dirname, "../../../modules/**/entities/*.entity{.ts,.js}"),
    ConfigurationEntity,
  ],
  synchronize: false,
  //logging: true,
};

const dataSource = new DataSource(options);

export default dataSource;
