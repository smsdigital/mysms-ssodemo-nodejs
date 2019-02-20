import { Application } from "../app";
import * as express from "express";

export class Config {
  public static install(app: Application): void {
    app.express.get("/config", Config.serve);
  }

  private static serve(req: express.Request, res: express.Response) {
    res.contentType("application/json");
    res.send({
      public_key: Application.config.crypto.publicKey,
    });
  }
}
