import { setGlobalOptions } from "@typegoose/typegoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Keyv from "keyv";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import fs from "fs";
import { GraphQLFormattedError } from "graphql";
import { graphqlUploadExpress } from "graphql-upload";
import http from "http";
import https from "https";
import { expressSharp, FsAdapter, S3Adapter } from "express-sharp";
import { connect } from "mongoose";
import { environment } from "./environment";
import { logger } from "./helper";
import { cacheMiddleware, publicMiddleWare } from "./midleware";
import schema from "./schema";
import { AccountService, TYPES } from "./services/accounts/interface";
import container from "./services/accounts/inversify.config";
import AWS from "aws-sdk";
import { s3Config } from "./libs";
import path from "path";
import { imageMiddleware } from "./midleware/renderImage";
const morgan = require("morgan");

// (global as any).__srcdir = __dirname;
dotenv.config();

const authSvc = container.get<AccountService>(TYPES.AccountService);

declare var module: any;
const sharpAdapter = environment.isLocalFileStorage
  ? new FsAdapter(
      path.join(
        path.resolve(process.env.NODE_ENV == "production" ? "../" : "."),
        "resources"
      )
    )
  : new S3Adapter(process.env.aws_bucket, new AWS.S3(s3Config.default));

const origins = {
  development: [
    "http://localhost:3000",
    "http://localhost:4004",
    "http://localhost:8080",
    "http://localhost:8081",
  ],
  production: [
    "http://localhost:8080",
    "http://localhost:8091",
    "http://127.0.0.1:8091",
    "http://127.0.0.1:8092",
    "https://order-please.com",
    "https://vendor.order-please.com",
    "https://admin.order-please.com",
  ],
  orderlink: [
    "https://localhost:8092",
    "https://orderlink.xyz",
    "http://134.209.162.27:8094",
    "https://store.orderlink.xyz",
    "https://admin.orderlink.xyz",
  ],
  stage: [
    "https://localhost:8092",
    "https://stage.order-please.com",
    "https://stage_admin.order-please.com",
  ],
};

const allowedOrigins = origins[process.env.app_env];
const configurations = {
  production: {
    ssl: environment.sslEnabled,
    port: environment.port,
    hostname: environment.host,
  },
  orderlink: {
    ssl: environment.sslEnabled,
    port: environment.port,
    hostname: environment.host,
  },
  stage: {
    ssl: environment.sslEnabled,
    port: environment.port,
    hostname: environment.host,
  },
  development: {
    ssl: false,
    port: environment.port,
    hostname: environment.host,
  },
};

// const env = process.env.NODE_ENV || 'production';
const env = process.env.app_env || "production";
const config = configurations[env];

setGlobalOptions({
  globalOptions: {
    useNewEnum: false,
  },
});

(async () => {
  await connect(environment.mongoDb.uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
    .then(async (res) => {
      console.log(
        `Mongo db connection ${environment.mongoDb.uri} successfl....`
      );
      return res;
    })
    .catch((err) => {
      console.log(`Mongo db connection error: ${err}`);
    });
})();

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin." +
        origin;
      callback(new Error(msg), false);
      return;
    }
    callback(null, true);
    return;
  },
};
const getIpAddress = (headers): string => {
  if (!headers) return null;
  const ipAddress = headers["x-forwarded-for"];
  if (!ipAddress) return "175.140.105.19";
  return ipAddress.split(":")[0];
};

const app = express();
const appContext = async (ctx: any) => {
  // logger.info("--------------------request------------------------")
  // logger.info(JSON.stringify(req.body), "@request variables");
  if (ctx && ctx.headers && ctx.headers["authorization"]) {
    const token = ctx.headers["authorization"];
    if (!token) return;

    const tk = token.split("Bearer").pop().trim();

    try {
      const auth = await authSvc.jwtVerify(tk);
      return {
        user: {
          ...auth,
          storeId: auth.store,
        },
      };
    } catch (error) {
      return {
        tokenExpired: true,
      };
    }
  }
};
const appCustomError = (err): GraphQLFormattedError<Record<string, any>> => {
  logger.error(JSON.stringify(err + "@Internal server error.."));
  return err;
};

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(
  path.join(path.resolve("."), "access.log"),
  {
    flags: "a",
  }
);

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.use(publicMiddleWare(express));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(
  "/resources",
  environment.useExpressSharp
    ? expressSharp({
        cache: new Keyv(),
        imageAdapter: sharpAdapter,
      })
    : imageMiddleware
);
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 19000000000, maxFiles: 10 }),
  graphqlHTTP(async (req, res) => {
    return {
      schema,
      graphiql: true,
      context: await appContext(req),
      customFormatErrorFn: appCustomError,
    };
  })
);

// Create the HTTPS or HTTP server, per configuration
let server: https.Server | http.Server;

if (config.ssl) {
  // Assumes certificates are in a .ssl folder off of the package root. Make sure
  server = https.createServer(
    {
      key: fs.readFileSync(`./ssl/${env}/server.key`),
      cert: fs.readFileSync(`./ssl/${env}/server.crt`),
    },
    app
  );
} else {
  server = http.createServer(app);
}

if (module["hot"]) {
  module["hot"].accept();
  module["hot"].dispose(() => {
    console.log("hre nowlssdfs lllsdfsdf 99999kk fdl ");
    server.close();
  });
}

server.listen({ port: config.port }, () =>
  console.log(
    "🚀 Server ready at",
    `http${config.ssl ? "s" : ""}://localhost:${config.port}/graphql`
  )
);
