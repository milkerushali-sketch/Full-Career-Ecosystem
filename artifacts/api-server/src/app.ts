import express, { type Express } from "express";
import path from "node:path";
import { existsSync } from "node:fs";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const frontendDistPath = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "placement-system",
  "dist",
  "public",
);
const frontendIndexPath = path.join(frontendDistPath, "index.html");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath, { index: false }));
  app.get(/^(?!\/api(?:\/|$)).*/, (req, res, next) => {
    if (!existsSync(frontendIndexPath)) {
      next();
      return;
    }

    if (req.path.startsWith("/api")) {
      next();
      return;
    }

    res.sendFile(frontendIndexPath);
  });
}

export default app;
