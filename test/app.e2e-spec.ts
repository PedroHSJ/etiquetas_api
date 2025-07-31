import {
  TestApp,
  initTestServer,
  tearDownTestServer,
  users,
} from "./test-setup";

describe("AppController (e2e)", () => {
  const testApp: TestApp = new TestApp();
  // beforeAll(async () => {
  //   try {
  //     await initTestServer(testApp)();
  //   } catch (error) {
  //     console.error("Erro ao iniciar o servidor de testes:", error);
  //     throw error;
  //   }
  // });

  // afterAll((done) => {
  //   tearDownTestServer(testApp)()
  //     .then(() => done())
  //     .catch((error) => {
  //       console.error(
  //         "Erro ao destruir o servidor de testes:",
  //         error,
  //       );
  //       done(error);
  //     });
  // });

  beforeAll(async () => {
    try {
      await initTestServer(testApp);
    } catch (error) {
      console.error("Erro ao iniciar o servidor de testes:", error);
      throw error;
    }
  });

  afterAll((done) => {
    tearDownTestServer(testApp)()
      .then(() => done())
      .catch((error) => {
        console.error("Erro ao destruir o servidor de testes:", error);
        done(error);
      });
  });

  beforeEach(async () => {
    await testApp.databaseService.createSchema();
    await testApp.databaseService.createTables();
    await testApp.databaseService.loadData();
    await testApp.request().post("/api/auth").send(users.initialUser);
  });

  afterEach(async () => {
    await testApp.databaseService.dropSchema();
  });
  it("/ (GET) 1", () => {
    // return request(app.getHttpServer())
    //   .get("/")
    //   .expect(200)
    //   .expect("Hello World!");
    return new Promise((resolve) => {
      resolve("Hello World!");
    });
  });

  // it("/ (GET) 2", () => {
  //   // return request(app.getHttpServer())
  //   //   .get("/")
  //   //   .expect(200)
  //   //   .expect("Hello World!");
  //   return new Promise((resolve) => {
  //     resolve("Hello World!");
  //   });
  // });

  // it("/ (GET) 3", () => {
  //   // return request(app.getHttpServer())
  //   //   .get("/")
  //   //   .expect(200)
  //   //   .expect("Hello World!");
  //   return new Promise((resolve) => {
  //     resolve("Hello World!");
  //   });
  // });

  // it("/ (GET) 4", () => {
  //   // return request(app.getHttpServer())
  //   //   .get("/")
  //   //   .expect(200)
  //   //   .expect("Hello World!");
  //   return new Promise((resolve) => {
  //     resolve("Hello World!");
  //   });
  // });
});
