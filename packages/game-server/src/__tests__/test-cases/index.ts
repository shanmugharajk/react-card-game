import { loginTests } from "./login.tests";
import { sessionsTest } from "./sessions.tests";
import { recieveCardsTests } from "./recieveCards.tests";

export class AllTests {
  public login = () => loginTests();
  public gameSession = () => sessionsTest();
  public recieveCardsTests = () => recieveCardsTests();
}
