import { Application } from "../app";
import * as express from "express";

export class Index {
  public static install(app: Application): void {
    app.express.get("/", Index.serve);
  }

  private static serve(req: express.Request, res: express.Response, next: express.NextFunction) {
    const sso = req.query._sso;
    delete req.query._sso;
    res.json({ sso: sso || "NONE", query: req.query });
  }
}
