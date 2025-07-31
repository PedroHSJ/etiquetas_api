import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import * as fs from "fs";
import { ConfigurationEntity } from "./entities/configurarion.entity";
import { Transactional } from "typeorm-transactional";
import { join } from "path";

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(ConfigurationEntity)
    private readonly repository: Repository<ConfigurationEntity>,
    private readonly manager: EntityManager,
  ) {}

  @Transactional()
  async loadData() {
    try {
      const schema =
        process.env.NODE_ENV === "test"
          ? `${process.env.DB_SCHEMA}_test`
          : process.env.DB_SCHEMA || "public";
      const tableName = "tb_setting";
      const lastFileNameRow = await this.repository.query(
        `SELECT value FROM ${schema}.${tableName} WHERE name = 'SEEDER'`,
      );

      const lastFileName = lastFileNameRow.length
        ? lastFileNameRow[0].value
        : null;

      const dataDir =
        process.env.NODE_ENV === "production"
          ? join(__dirname, "data")
          : join(__dirname, "../../../../../database/data");

      const files = fs.readdirSync(dataDir).sort();

      for (const file of files) {
        try {
          if (lastFileName && file <= lastFileName) {
            continue;
          }

          const filePath = `${dataDir}/${file}`;
          const sql = fs.readFileSync(filePath, "utf8");

          await this.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.query(
              `SET search_path TO ${schema}`,
            );
            await transactionalEntityManager.query(sql);

            await transactionalEntityManager.query(
              `INSERT INTO ${schema}.${tableName} (name, value) VALUES ($1, $2) 
              ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value`,
              ["SEEDER", file],
            );
          });
        } catch (error) {
          console.error(`Failed to process file ${file}:`, error);
          throw error;
        }
      }
    } catch (error) {
      console.error(`Failed to process load data: `, error);
      throw error;
    }
  }

  @Transactional()
  async createTables() {
    try {
      const schema =
        process.env.NODE_ENV === "test"
          ? `${process.env.DB_SCHEMA}_test`
          : process.env.DB_SCHEMA || "public";
      const tableName = "tb_setting";
      const key = "CREATE-DDL";
      console.log("Schema: ", schema);
      const tableExists = await this.manager.query(
        `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = $1 AND table_name = $2`,
        [schema, tableName],
      );

      if (tableExists.length) {
        const createDDLExists = await this.manager.query(
          `SELECT * FROM ${schema}.${tableName} WHERE NAME = $1`,
          [key],
        );
        if (createDDLExists.length) {
          console.log("SCRIPT DE CRIAÇÃO DE TABELAS JÁ EXECUTADO");
          return;
        }
      }

      console.log("EXECUTANDO SCRIPT DE CRIAÇÃO DE TABELAS");
      // LENDO TODOS OS ARQUIVOS DESSA PASTA E DAS PASTAS FILHAS

      const dataDir =
        process.env.NODE_ENV === "production"
          ? join(__dirname, "data")
          : join(__dirname, "../../../../../database/postgres");
      const files = fs
        .readdirSync(dataDir)
        .filter((file) => file.endsWith(".sql"))
        .sort((a, b) => a.localeCompare(b));

      for (const file of files) {
        try {
          const filePath = `${dataDir}/${file}`;
          const sql = fs.readFileSync(filePath, {
            encoding: "utf8",
            flag: "r",
          });

          await this.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.query(
              `SET search_path TO ${schema}`,
            );
            await transactionalEntityManager.query(sql);
          });

          console.log(`SCRIPT EXECUTADO COM SUCESSO: ${file}`);
        } catch (error) {
          console.error(`Failed to process file ${file}:`, error);
          throw error;
        }
      }

      await this.manager.query(
        `INSERT INTO ${schema}.${tableName} (name, value) VALUES ($1, $2)
        ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value`,
        [key, "executed"],
      );
    } catch (error) {
      //VERIFICANDO EM QUE BANCO E EM QUAL SCHEMA DEU ERRO
      console.error(`Failed to process create tables: `, error);
      throw error;
    }
  }

  @Transactional()
  async dropSchema() {
    try {
      console.log("DROPPING SCHEMA");

      const schema =
        process.env.NODE_ENV === "test"
          ? `${process.env.DB_SCHEMA}_test`
          : process.env.DB_SCHEMA || "public";
      await this.manager.query(`DROP SCHEMA ${schema} CASCADE`);
      console.log("SCHEMA DROPPED");
    } catch (error) {
      console.error(`Failed to drop schema: `, error);
      throw error;
    }
  }

  @Transactional()
  async createSchema() {
    try {
      console.log("CREATING SCHEMA");

      const schema =
        process.env.NODE_ENV === "test"
          ? `${process.env.DB_SCHEMA}_test`
          : process.env.DB_SCHEMA || "public";
      console.log(`Creating schema ${schema}`);
      // Verifique se o esquema já existe
      const schemaExists = await this.manager.query(
        `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
        [schema],
      );

      if (schemaExists.length === 0) {
        console.log(`Schema ${schema} does not exist. Creating schema.`);
        await this.manager.query(`CREATE SCHEMA ${schema}`);
        console.log(`Schema ${schema} created successfully.`);
        return;
      }

      console.log(`Schema ${schema} already exists.`);

      // if (process.env.NODE_ENV === "test") {
      //   console.log(
      //     `Dropping existing schema ${schema} for test environment.`,
      //   );
      //   await this.dropSchema();
      //   console.log(`Schema ${schema} dropped successfully.`);
      //   await this.manager.query(`CREATE SCHEMA ${schema}`);
      //   console.log(
      //     `Schema ${schema} recreated successfully for test environment.`,
      //   );
      // }
    } catch (error) {
      console.error(`Failed to create schema: `, error);
      throw error;
    }
  }
}
