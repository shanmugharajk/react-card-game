import { startServer, stopServer } from "../core/server";
import { AllTests } from "./test-cases";

const tests = new AllTests();

beforeAll(done => {
  startServer(done);
});

afterAll(done => {
  stopServer(done);
});

describe("Card Game", async () => {
  describe("Login", tests.login);
  describe("Game Session", tests.gameSession);
  describe("Recieve Card", tests.recieveCardsTests);
});
