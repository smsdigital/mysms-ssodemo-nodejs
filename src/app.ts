import * as express from "express";
import { config } from "./util/config";
import { debug } from "./util/logging";
import { Index } from "./routes/index";
import { Config } from "./routes/config";

export class Application {

  public static readonly config = config;

  public static create(): Application {
    return new Application();
  }

  private static mysmsAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const mysms_group = req.query.mysms_group;
    if (!mysms_group || !mysms_group.auth) {
      return next();
    }
    const token = mysms_group.auth;
    Application.config.crypto.verifyToken(token).then((response) => {
      req.query._sso = response;
      next();
    }).catch((e) => {
      debug("Authentication failure", e.statusCode, e.message);
      req.query._sso = { status: "FAILED", error: e };
      next();
    });
  }

  public readonly express: express.Application = express();

  constructor() {
    this.configure();
  }

  private configure() {
    const x = this.express;
    x.set("trust proxy", true);

    this.routesUnauthenticated();
    x.use(Application.mysmsAuth);
    this.routes();
  }

  private routesUnauthenticated(): void {
    Config.install(this);
  }

  private routes(): void {
    Index.install(this);
  }
}

module.exports = Application;
