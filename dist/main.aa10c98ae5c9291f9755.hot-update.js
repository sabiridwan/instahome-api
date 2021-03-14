exports.id = "main";
exports.modules = {

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = __webpack_require__(/*! @typegoose/typegoose */ "@typegoose/typegoose");
const body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ "body-parser"));
const cookie_parser_1 = __importDefault(__webpack_require__(/*! cookie-parser */ "cookie-parser"));
const cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors"));
const dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv"));
const express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
const express_graphql_1 = __webpack_require__(/*! express-graphql */ "express-graphql");
const fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
const graphql_upload_1 = __webpack_require__(/*! graphql-upload */ "graphql-upload");
const http_1 = __importDefault(__webpack_require__(/*! http */ "http"));
const https_1 = __importDefault(__webpack_require__(/*! https */ "https"));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
const environment_1 = __webpack_require__(/*! ./environment */ "./src/environment.ts");
const helper_1 = __webpack_require__(/*! ./helper */ "./src/helper.ts");
const schema_1 = __importDefault(__webpack_require__(/*! ./schema */ "./src/schema.ts"));
const morgan = __webpack_require__(/*! morgan */ "morgan");
dotenv_1.default.config();
const origins = {
    development: ["http://localhost:3000", "http://localhost:8090"],
    production: ["http://localhost:8090"],
    stage: [
        "https://localhost:8092",
        "https://stage.order-please.com",
        "https://stage_admin.order-please.com",
    ],
};
const allowedOrigins = origins["production"];
const configurations = {
    production: {
        ssl: environment_1.environment.sslEnabled,
        port: environment_1.environment.port,
        hostname: environment_1.environment.host,
    },
    orderlink: {
        ssl: environment_1.environment.sslEnabled,
        port: environment_1.environment.port,
        hostname: environment_1.environment.host,
    },
    stage: {
        ssl: environment_1.environment.sslEnabled,
        port: environment_1.environment.port,
        hostname: environment_1.environment.host,
    },
    development: {
        ssl: false,
        port: environment_1.environment.port,
        hostname: environment_1.environment.host,
    },
};
const env = "production" || false;
const config = configurations[env];
typegoose_1.setGlobalOptions({
    globalOptions: {
        useNewEnum: false,
    },
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.connect(environment_1.environment.mongoDb.uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Mongo db connection ${environment_1.environment.mongoDb.uri} successfl....`);
        return res;
    }))
        .catch((err) => {
        console.log(`Mongo db connection error: ${err}`);
    });
}))();
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (!origin) {
            callback(null, true);
            return;
        }
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = "The CORS policy for this site does not " +
                "allow access from the specified Origin." +
                origin;
            callback(new Error(msg), false);
            return;
        }
        callback(null, true);
        return;
    },
};
const getIpAddress = (headers) => {
    if (!headers)
        return null;
    const ipAddress = headers["x-forwarded-for"];
    if (!ipAddress)
        return "175.140.105.19";
    return ipAddress.split(":")[0];
};
const app = express_1.default();
const appContext = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx && ctx.headers && ctx.headers["customerId"]) {
        const customerId = ctx.headers["customerId"];
        if (!customerId)
            return;
        try {
            return {
                customerId,
            };
        }
        catch (error) {
            return {
                tokenExpired: true,
            };
        }
    }
});
const appCustomError = (err) => {
    helper_1.logger.error(JSON.stringify(err + "@Internal server error.."));
    return err;
};
var accessLogStream = fs_1.default.createWriteStream(path_1.default.join(path_1.default.resolve("."), "access.log"), {
    flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(cors_1.default(corsOptions));
app.use(cookie_parser_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/graphql", graphql_upload_1.graphqlUploadExpress({ maxFileSize: 19000000000, maxFiles: 10 }), express_graphql_1.graphqlHTTP((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        schema: schema_1.default,
        graphiql: true,
        context: yield appContext(req),
        customFormatErrorFn: appCustomError,
    };
})));
let server;
if (config.ssl) {
    server = https_1.default.createServer({
        key: fs_1.default.readFileSync(`./ssl/${env}/server.key`),
        cert: fs_1.default.readFileSync(`./ssl/${env}/server.crt`),
    }, app);
}
else {
    server = http_1.default.createServer(app);
}
if (true) {
    module["hot"].accept();
    module["hot"].dispose(() => {
        console.log("hre nowlssdfs lllsdfsdf 99999kk fdl ");
        server.close();
    });
}
server.listen({ port: config.port }, () => console.log("🚀 Server ready at", `http${config.ssl ? "s" : ""}://localhost:${config.port}/graphql`));


/***/ })

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZmlsZSI6Im1haW4uYWExMGM5OGFlNWM5MjkxZjk3NTUuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB0eXBlZ29vc2VfMSA9IHJlcXVpcmUoXCJAdHlwZWdvb3NlL3R5cGVnb29zZVwiKTtcbmNvbnN0IGJvZHlfcGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImJvZHktcGFyc2VyXCIpKTtcbmNvbnN0IGNvb2tpZV9wYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiY29va2llLXBhcnNlclwiKSk7XG5jb25zdCBjb3JzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImNvcnNcIikpO1xuY29uc3QgZG90ZW52XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRvdGVudlwiKSk7XG5jb25zdCBleHByZXNzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImV4cHJlc3NcIikpO1xuY29uc3QgZXhwcmVzc19ncmFwaHFsXzEgPSByZXF1aXJlKFwiZXhwcmVzcy1ncmFwaHFsXCIpO1xuY29uc3QgZnNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZnNcIikpO1xuY29uc3QgZ3JhcGhxbF91cGxvYWRfMSA9IHJlcXVpcmUoXCJncmFwaHFsLXVwbG9hZFwiKTtcbmNvbnN0IGh0dHBfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiaHR0cFwiKSk7XG5jb25zdCBodHRwc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJodHRwc1wiKSk7XG5jb25zdCBtb25nb29zZV8xID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpO1xuY29uc3QgcGF0aF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJwYXRoXCIpKTtcbmNvbnN0IGVudmlyb25tZW50XzEgPSByZXF1aXJlKFwiLi9lbnZpcm9ubWVudFwiKTtcbmNvbnN0IGhlbHBlcl8xID0gcmVxdWlyZShcIi4vaGVscGVyXCIpO1xuY29uc3Qgc2NoZW1hXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vc2NoZW1hXCIpKTtcbmNvbnN0IG1vcmdhbiA9IHJlcXVpcmUoXCJtb3JnYW5cIik7XG5kb3RlbnZfMS5kZWZhdWx0LmNvbmZpZygpO1xuY29uc3Qgb3JpZ2lucyA9IHtcbiAgICBkZXZlbG9wbWVudDogW1wiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsIFwiaHR0cDovL2xvY2FsaG9zdDo4MDkwXCJdLFxuICAgIHByb2R1Y3Rpb246IFtcImh0dHA6Ly9sb2NhbGhvc3Q6ODA5MFwiXSxcbiAgICBzdGFnZTogW1xuICAgICAgICBcImh0dHBzOi8vbG9jYWxob3N0OjgwOTJcIixcbiAgICAgICAgXCJodHRwczovL3N0YWdlLm9yZGVyLXBsZWFzZS5jb21cIixcbiAgICAgICAgXCJodHRwczovL3N0YWdlX2FkbWluLm9yZGVyLXBsZWFzZS5jb21cIixcbiAgICBdLFxufTtcbmNvbnN0IGFsbG93ZWRPcmlnaW5zID0gb3JpZ2luc1twcm9jZXNzLmVudi5hcHBfZW52XTtcbmNvbnN0IGNvbmZpZ3VyYXRpb25zID0ge1xuICAgIHByb2R1Y3Rpb246IHtcbiAgICAgICAgc3NsOiBlbnZpcm9ubWVudF8xLmVudmlyb25tZW50LnNzbEVuYWJsZWQsXG4gICAgICAgIHBvcnQ6IGVudmlyb25tZW50XzEuZW52aXJvbm1lbnQucG9ydCxcbiAgICAgICAgaG9zdG5hbWU6IGVudmlyb25tZW50XzEuZW52aXJvbm1lbnQuaG9zdCxcbiAgICB9LFxuICAgIG9yZGVybGluazoge1xuICAgICAgICBzc2w6IGVudmlyb25tZW50XzEuZW52aXJvbm1lbnQuc3NsRW5hYmxlZCxcbiAgICAgICAgcG9ydDogZW52aXJvbm1lbnRfMS5lbnZpcm9ubWVudC5wb3J0LFxuICAgICAgICBob3N0bmFtZTogZW52aXJvbm1lbnRfMS5lbnZpcm9ubWVudC5ob3N0LFxuICAgIH0sXG4gICAgc3RhZ2U6IHtcbiAgICAgICAgc3NsOiBlbnZpcm9ubWVudF8xLmVudmlyb25tZW50LnNzbEVuYWJsZWQsXG4gICAgICAgIHBvcnQ6IGVudmlyb25tZW50XzEuZW52aXJvbm1lbnQucG9ydCxcbiAgICAgICAgaG9zdG5hbWU6IGVudmlyb25tZW50XzEuZW52aXJvbm1lbnQuaG9zdCxcbiAgICB9LFxuICAgIGRldmVsb3BtZW50OiB7XG4gICAgICAgIHNzbDogZmFsc2UsXG4gICAgICAgIHBvcnQ6IGVudmlyb25tZW50XzEuZW52aXJvbm1lbnQucG9ydCxcbiAgICAgICAgaG9zdG5hbWU6IGVudmlyb25tZW50XzEuZW52aXJvbm1lbnQuaG9zdCxcbiAgICB9LFxufTtcbmNvbnN0IGVudiA9IHByb2Nlc3MuZW52LmFwcF9lbnYgfHwgXCJwcm9kdWN0aW9uXCI7XG5jb25zdCBjb25maWcgPSBjb25maWd1cmF0aW9uc1tlbnZdO1xudHlwZWdvb3NlXzEuc2V0R2xvYmFsT3B0aW9ucyh7XG4gICAgZ2xvYmFsT3B0aW9uczoge1xuICAgICAgICB1c2VOZXdFbnVtOiBmYWxzZSxcbiAgICB9LFxufSk7XG4oKCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgeWllbGQgbW9uZ29vc2VfMS5jb25uZWN0KGVudmlyb25tZW50XzEuZW52aXJvbm1lbnQubW9uZ29EYi51cmksIHtcbiAgICAgICAgdXNlTmV3VXJsUGFyc2VyOiB0cnVlLFxuICAgICAgICB1c2VDcmVhdGVJbmRleDogdHJ1ZSxcbiAgICAgICAgdXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLFxuICAgIH0pXG4gICAgICAgIC50aGVuKChyZXMpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgTW9uZ28gZGIgY29ubmVjdGlvbiAke2Vudmlyb25tZW50XzEuZW52aXJvbm1lbnQubW9uZ29EYi51cml9IHN1Y2Nlc3NmbC4uLi5gKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9KSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYE1vbmdvIGRiIGNvbm5lY3Rpb24gZXJyb3I6ICR7ZXJyfWApO1xuICAgIH0pO1xufSkpKCk7XG5jb25zdCBjb3JzT3B0aW9ucyA9IHtcbiAgICBjcmVkZW50aWFsczogdHJ1ZSxcbiAgICBvcmlnaW46IGZ1bmN0aW9uIChvcmlnaW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghb3JpZ2luKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsb3dlZE9yaWdpbnMuaW5kZXhPZihvcmlnaW4pID09PSAtMSkge1xuICAgICAgICAgICAgdmFyIG1zZyA9IFwiVGhlIENPUlMgcG9saWN5IGZvciB0aGlzIHNpdGUgZG9lcyBub3QgXCIgK1xuICAgICAgICAgICAgICAgIFwiYWxsb3cgYWNjZXNzIGZyb20gdGhlIHNwZWNpZmllZCBPcmlnaW4uXCIgK1xuICAgICAgICAgICAgICAgIG9yaWdpbjtcbiAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihtc2cpLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9LFxufTtcbmNvbnN0IGdldElwQWRkcmVzcyA9IChoZWFkZXJzKSA9PiB7XG4gICAgaWYgKCFoZWFkZXJzKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBpcEFkZHJlc3MgPSBoZWFkZXJzW1wieC1mb3J3YXJkZWQtZm9yXCJdO1xuICAgIGlmICghaXBBZGRyZXNzKVxuICAgICAgICByZXR1cm4gXCIxNzUuMTQwLjEwNS4xOVwiO1xuICAgIHJldHVybiBpcEFkZHJlc3Muc3BsaXQoXCI6XCIpWzBdO1xufTtcbmNvbnN0IGFwcCA9IGV4cHJlc3NfMS5kZWZhdWx0KCk7XG5jb25zdCBhcHBDb250ZXh0ID0gKGN0eCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgaWYgKGN0eCAmJiBjdHguaGVhZGVycyAmJiBjdHguaGVhZGVyc1tcImN1c3RvbWVySWRcIl0pIHtcbiAgICAgICAgY29uc3QgY3VzdG9tZXJJZCA9IGN0eC5oZWFkZXJzW1wiY3VzdG9tZXJJZFwiXTtcbiAgICAgICAgaWYgKCFjdXN0b21lcklkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjdXN0b21lcklkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdG9rZW5FeHBpcmVkOiB0cnVlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuY29uc3QgYXBwQ3VzdG9tRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgaGVscGVyXzEubG9nZ2VyLmVycm9yKEpTT04uc3RyaW5naWZ5KGVyciArIFwiQEludGVybmFsIHNlcnZlciBlcnJvci4uXCIpKTtcbiAgICByZXR1cm4gZXJyO1xufTtcbnZhciBhY2Nlc3NMb2dTdHJlYW0gPSBmc18xLmRlZmF1bHQuY3JlYXRlV3JpdGVTdHJlYW0ocGF0aF8xLmRlZmF1bHQuam9pbihwYXRoXzEuZGVmYXVsdC5yZXNvbHZlKFwiLlwiKSwgXCJhY2Nlc3MubG9nXCIpLCB7XG4gICAgZmxhZ3M6IFwiYVwiLFxufSk7XG5hcHAudXNlKG1vcmdhbihcImNvbWJpbmVkXCIsIHsgc3RyZWFtOiBhY2Nlc3NMb2dTdHJlYW0gfSkpO1xuYXBwLnVzZShib2R5X3BhcnNlcl8xLmRlZmF1bHQuanNvbih7IGxpbWl0OiBcIjEwbWJcIiB9KSk7XG5hcHAudXNlKGNvcnNfMS5kZWZhdWx0KGNvcnNPcHRpb25zKSk7XG5hcHAudXNlKGNvb2tpZV9wYXJzZXJfMS5kZWZhdWx0KCkpO1xuYXBwLnVzZShib2R5X3BhcnNlcl8xLmRlZmF1bHQudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiBmYWxzZSB9KSk7XG5hcHAudXNlKGV4cHJlc3NfMS5kZWZhdWx0LnVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpO1xuYXBwLnVzZShcIi9ncmFwaHFsXCIsIGdyYXBocWxfdXBsb2FkXzEuZ3JhcGhxbFVwbG9hZEV4cHJlc3MoeyBtYXhGaWxlU2l6ZTogMTkwMDAwMDAwMDAsIG1heEZpbGVzOiAxMCB9KSwgZXhwcmVzc19ncmFwaHFsXzEuZ3JhcGhxbEhUVFAoKHJlcSwgcmVzKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzY2hlbWE6IHNjaGVtYV8xLmRlZmF1bHQsXG4gICAgICAgIGdyYXBoaXFsOiB0cnVlLFxuICAgICAgICBjb250ZXh0OiB5aWVsZCBhcHBDb250ZXh0KHJlcSksXG4gICAgICAgIGN1c3RvbUZvcm1hdEVycm9yRm46IGFwcEN1c3RvbUVycm9yLFxuICAgIH07XG59KSkpO1xubGV0IHNlcnZlcjtcbmlmIChjb25maWcuc3NsKSB7XG4gICAgc2VydmVyID0gaHR0cHNfMS5kZWZhdWx0LmNyZWF0ZVNlcnZlcih7XG4gICAgICAgIGtleTogZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhgLi9zc2wvJHtlbnZ9L3NlcnZlci5rZXlgKSxcbiAgICAgICAgY2VydDogZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhgLi9zc2wvJHtlbnZ9L3NlcnZlci5jcnRgKSxcbiAgICB9LCBhcHApO1xufVxuZWxzZSB7XG4gICAgc2VydmVyID0gaHR0cF8xLmRlZmF1bHQuY3JlYXRlU2VydmVyKGFwcCk7XG59XG5pZiAobW9kdWxlW1wiaG90XCJdKSB7XG4gICAgbW9kdWxlW1wiaG90XCJdLmFjY2VwdCgpO1xuICAgIG1vZHVsZVtcImhvdFwiXS5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJocmUgbm93bHNzZGZzIGxsbHNkZnNkZiA5OTk5OWtrIGZkbCBcIik7XG4gICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgIH0pO1xufVxuc2VydmVyLmxpc3Rlbih7IHBvcnQ6IGNvbmZpZy5wb3J0IH0sICgpID0+IGNvbnNvbGUubG9nKFwi8J+agCBTZXJ2ZXIgcmVhZHkgYXRcIiwgYGh0dHAke2NvbmZpZy5zc2wgPyBcInNcIiA6IFwiXCJ9Oi8vbG9jYWxob3N0OiR7Y29uZmlnLnBvcnR9L2dyYXBocWxgKSk7XG4iXSwic291cmNlUm9vdCI6IiJ9