export class LoggerService {
  public static log(title: string, message: any) {
    const isTest = process.env.NODE_ENV === "test";

    if (isTest === true) {
      return;
    }

    console.log();
    console.log("\x1b[33m%s\x1b[1m", `[card-game |- Message]`);
    console.log(`  ${title}`);
    console.log(`  ${message}`);
  }

  public static logError(title: string, message: any) {
    const isTest = process.env.NODE_ENV === "test";

    if (isTest === true) {
      return;
    }

    console.log();
    console.log("\x1b[31m%s\x1b[1m", `[card-game |- Error]`);
    console.log(`  ${title}`);
    console.log(`  ${message}`);
  }
}
