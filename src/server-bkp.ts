import { setGlobalOptions } from "@typegoose/typegoose";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import { GraphQLFormattedError } from "graphql";
import http from "http";
import https from "https";
import { connect } from "mongoose";
import { environment } from "./environment";
import { logger } from "./helper";
import { imageUrlMiddleWare, publicMiddleWare } from "./midleware";
import schema from "./schema";
import { AccountService, TYPES } from "./services/accounts/interface";
import container from "./services/accounts/inversify.config";
import { graphqlUploadExpress } from "graphql-upload";
dotenv.config();
const accountSvc = container.get<AccountService>(TYPES.AccountService);

declare var module: any;
const origins = {
  development: [
    "http://localhost:3000",
    "http://localhost:4004",
    "http://localhost:8080",
  ],
  production: [
    "https://order-please.com",
    "https://vendor.order-please.com",
    "https://admin.order-please.com",
  ],
  stage: [
    "https://localhost:8092",
    "https://stage.order-please.com",
    "https://stage_admin.order-please.com",
  ],
};

const allowedOrigins = origins[process.env.app_env];
const configurations = {
  // Note: You may ned sudo to run on port 443 .
  production: { ssl: true, port: environment.port, hostname: environment.host },
  stage: { ssl: true, port: environment.port, hostname: environment.host },
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

const app = express();
const apollo = new ApolloServer({
  uploads: {
    maxFileSize: 10000000000,
    maxFiles: 1,
  },
  playground: environment.apollo.playground,
  schema: schema,

  context: async ({ req, connection }) => {
    // logger.info("--------------------request------------------------")
    // logger.info(JSON.stringify(req.body), "@request variables");
    if (req && req.headers && req.headers["authorization"]) {
      const token = req.headers["authorization"];
      if (!token) return;

      const tk = token.split("Bearer").pop().trim();

      try {
        const auth = await accountSvc.jwtVerify(tk);
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
  },
  subscriptions: {
    onConnect: (connectionParams: any, webSocket) => {},
  },
  formatResponse: (res, context) => {
    // logger.info("--------------------response------------------------")
    // logger.info(JSON.stringify(res.data)), "@response data..";
    return res;
  },
  formatError: (err): GraphQLFormattedError<Record<string, any>> => {
    // logger.info("--------------------error------------------------")
    // logger.error(JSON.stringify(err), "@error response..");
    return err;
  },
});

apollo.applyMiddleware({
  app,
  path: "/graphql",
  cors: {
    credentials: true,
    origin: function (origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        callback(new Error(msg), false);
        return;
      }
      callback(null, true);
      return;
    },
  },
});

// Create the HTTPS or HTTP server, per configuration
let server: https.Server | http.Server;

if (config.ssl) {
  // Assumes certificates are in a .ssl folder off of the package root. Make sure
  // these files are secured.
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

app.use( graphqlUploadExpress({ maxFileSize: 19000000000, maxFiles: 10 }));
app.use("/resources", imageUrlMiddleWare(express));
app.use(publicMiddleWare(express));

if (module["hot"]) {
  module["hot"].accept();
  module["hot"].dispose(() => {
    server.close();
  });
}

server.listen({ port: config.port }, () =>
  console.log(
    "🚀 Server ready at",
    `http${config.ssl ? "s" : ""}://${config.hostname}:${config.port}${
      apollo.graphqlPath
    }`
  )
);
