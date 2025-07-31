import { Abstract, INestApplication, Type } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as supertestRequest from "supertest";
import { initializeTransactionalContext } from "typeorm-transactional";
import { keyGenerate } from "@/shared/helpers/keyGenerate";
import { AppModule } from "@/app.module";
import { DatabaseService } from "@/shared/modules/database/database.service";

interface IAuthenticate {
  cpf: string;
  password: string;
}

export class TestApp {
  public app: INestApplication;
  public moduleFixture: TestingModule;
  public databaseService: DatabaseService;
  public accessToken: string;
  public refreshToken: string;

  // Recupera dependências do módulo
  get<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | Abstract<TInput> | string | symbol,
    options?: { strict: boolean },
  ): TResult {
    return this.moduleFixture.get(typeOrToken, options);
  }

  // Método para executar requisições HTTP com supertest
  // public request() {
  //   const req = request(this.app.getHttpServer());
  //   if (this.accessToken) {
  //     req.set("Authorization", `Bearer ${this.accessToken}`);
  //     req.set("Accept-Language", "pt-br");
  //   }
  //   return req;
  // }

  // Método de autenticação para obter os tokens necessários
  // public async auth(user: IAuthenticate): Promise<void> {
  //   const { body, status } = await this.request()
  //     .post("/api/auth")
  //     .send({ cpf: user.cpf, password: user.password });
  //   expect(status).toBe(201);
  //   expect(body.access_token).toBeDefined();
  //   this.accessToken = body.access_token;
  //   this.refreshToken = body.refresh_token;
  // }
}

export function initTestServer(testApp: TestApp): () => Promise<void> {
  return async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("dotenv").config({ path: ".env.test.local" });
      keyGenerate();
      initializeTransactionalContext();

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      console.log("Iniciando servidor de testes");
      const app = moduleFixture.createNestApplication();
      app.setGlobalPrefix("api");
      await app.init();

      testApp.app = app;
      testApp.moduleFixture = moduleFixture;
      testApp.databaseService =
        moduleFixture.get<DatabaseService>(DatabaseService);
      await testApp.databaseService.createSchema();
      await testApp.databaseService.createTables();
      await testApp.databaseService.loadData();
      console.log("Servidor de testes iniciado");
    } catch (error) {
      console.log(error);
      console.error("Erro ao iniciar o servidor de testes:", error);
      throw error;
    }
  };
}

export function tearDownTestServer(testApp: TestApp): () => Promise<void> {
  return async () => {
    try {
      if (testApp.app) {
        console.log("Encerrando servidor de testes");
        await testApp.databaseService.dropSchema();
        await testApp.app.close();
        console.log("Servidor de testes encerrado");
      }
    } catch (error) {
      console.error("Erro ao destruir o servidor de testes:", error);
      throw error;
    }
  };
}

export const users = {
  initialUser: {
    cpf: "00000000000",
    password: "Abc@1234",
  },
};
