var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/local-injection.js
var require_local_injection = __commonJS({
  "src/local-injection.js"() {
    BigInt.prototype.toJSON = function() {
      return this.toString();
    };
  }
});

// src/index.js
var import_cluster = __toESM(require("cluster"));
var import_os2 = require("os");
var import_winston3 = __toESM(require("winston"));

// src/application.js
var import_process = __toESM(require("process"));
var import_http = require("http");
var import_winston = __toESM(require("winston"));
var import_koa = __toESM(require("koa"));

// src/tools/generateId.js
var import_nodejs_snowflake = require("nodejs-snowflake");
var generateId_default = (app) => {
  const snowflake = new import_nodejs_snowflake.Snowflake();
  app.tools.generateId = () => snowflake.getUniqueID();
};

// src/tools/response.js
var response_default = (app) => {
  app.context.success = function(data, code = 200) {
    this.body = {
      message: "success",
      code,
      data
    };
  };
  app.context.error = function(message = "Oops! server did not respond.", code = 500) {
    if (message instanceof Error)
      message = message.message;
    this.body = {
      message,
      code
    };
  };
};

// src/tools/index.js
var import_assert = require("assert");

// src/util/module.js
var import_promises = require("fs/promises");
var import_path = require("path");
var importModules = async (path, callback = (item) => item.default) => {
  const dir = await (0, import_promises.readdir)(path);
  let allModule = dir.map(async (item) => {
    const fullpath = (0, import_path.join)(path, `./${item}`);
    const result = await Promise.resolve().then(() => __toESM(require(fullpath)));
    result.path = fullpath;
    return result;
  });
  return (await Promise.all(allModule)).map(callback);
};
var moduleCatch = (error) => {
  if (!(error instanceof Error) || !error.message.includes("no such file or directory")) {
    return Promise.reject(error);
  }
  return Promise.resolve([]);
};

// src/tools/index.js
var import_path2 = require("path");
var tools_default = async (app, config) => {
  app.tools = {};
  generateId_default(app, config);
  response_default(app, config);
  let allModule = await importModules((0, import_path2.join)(app.config.appPath, "tools")).catch(moduleCatch);
  allModule.forEach((item) => {
    (0, import_assert.ok)(typeof item === "function", "config.tools item must be an function(app, config)");
    item(app, config);
  });
};

// src/service.js
var import_path3 = require("path");
var toServiceName = (service) => {
  let name = service.name;
  name = name.replace("Service", "");
  return `${name[0].toLocaleLowerCase()}${name.substring(1)}`;
};
var service_default = async (app) => {
  const allModule = await importModules((0, import_path3.join)(app.config.appPath, "service")).catch(moduleCatch);
  const service = {};
  allModule.forEach((item) => {
    const name = toServiceName(item);
    service[name] = new item(app);
  });
  app.service = service;
};

// src/middleware/index.js
var import_path4 = require("path");
var import_koa_body = require("koa-body");
var middleware_default = async (app) => {
  app.use((0, import_koa_body.koaBody)(app.config.body));
  let allModule = await importModules((0, import_path4.join)(app.config.appPath, "middleware")).catch(moduleCatch);
  allModule.forEach((item) => {
    app.use(item);
  });
};

// src/controller.js
var import_koa_router = __toESM(require("koa-router"));
var import_path5 = require("path");
var controller_default = async (app) => {
  const allModule = await importModules((0, import_path5.join)(app.config.appPath, "controller"));
  const router = new import_koa_router.default();
  allModule.forEach((item) => item(app, router, app.tools || {}));
  app.use(router.routes());
  return router;
};

// src/application.js
var application_default = async (config) => {
  const app = new import_koa.default();
  app.config = config;
  app.logger = import_winston.default.createLogger(config.logger || {});
  app.originServer = (0, import_http.createServer)(app.callback());
  await tools_default(app, config);
  await service_default(app);
  await middleware_default(app);
  await controller_default(app);
  app.originServer.listen(config.server.port, () => {
    app.logger.info(`\u8FDB\u7A0B ${import_process.default.pid} \u5DF2\u7ECF\u542F\u52A8!`);
    import_process.default.send("ok");
  });
};

// src/config.js
var import_os = require("os");
var import_path6 = require("path");
var import_process2 = require("process");
var import_winston2 = __toESM(require("winston"));
var import_lodash = __toESM(require("lodash"));
var { merge } = import_lodash.default;
var appPath = (0, import_process2.cwd)();
var customFormat = import_winston2.default.format.printf((info) => {
  return `[Pixiu] ${info.level.toLocaleUpperCase()}:${info.timestamp}:${info.message}`;
});
var systemDefault = {
  appPath,
  worker: {
    count: (0, import_os.cpus)().length
  },
  server: {
    port: 3e3
  },
  logger: {
    format: import_winston2.default.format.combine(
      import_winston2.default.format.timestamp(),
      customFormat
    ),
    transports: [
      new import_winston2.default.transports.Console()
    ]
  }
};
var config_default = async () => {
  const modules = await importModules((0, import_path6.join)(appPath, "config"), (item) => {
    const url = (0, import_path6.parse)(item.path);
    return { [url.name.toLocaleUpperCase()]: item.default };
  });
  const configs = merge(...modules);
  const nodeEnv = (import_process2.env.NODE_ENV || "pron").toLocaleUpperCase();
  const envConfig = configs[nodeEnv] || {};
  envConfig.env = nodeEnv;
  return merge(systemDefault, configs.DEFAULT, envConfig);
};

// src/index.js
Promise.resolve().then(() => __toESM(require_local_injection()));
module.exports = async () => {
  const config = await config_default();
  if (!import_cluster.default.isPrimary)
    return application_default(config);
  const logger = import_winston3.default.createLogger(config.logger || {});
  logger.info(`\u672C\u673A CPU \u6570\u91CF ${(0, import_os2.cpus)().length}, \u5C06\u542F\u52A8\uFF1A${config.worker.count}, \u4E2A\u8FDB\u7A0B\u3002`);
  const workers = [];
  for (let i = 0; i < config.worker.count; i++) {
    const worker = import_cluster.default.fork();
    workers.push(worker);
  }
  import_cluster.default.on("exit", (worker) => {
    logger.info(`\u8FDB\u7A0B ${worker.process.pid} \u88AB\u52A8\u9000\u51FA\u4E86\uFF0C\u5C1D\u8BD5\u91CD\u65B0\u5524\u8D77\u4E00\u4E2A\u8FDB\u7A0B\uFF01`);
    import_cluster.default.fork();
  });
  let okCount = 0;
  for (let worker of workers) {
    worker.on("message", (message) => {
      message === "ok" && okCount++;
    });
  }
  const intervalId = setInterval(() => {
    if (okCount < workers.length)
      return;
    logger.info(`URL: http://localhost:${config.server.port}`);
    clearInterval(intervalId);
  }, 200);
};
//# sourceMappingURL=index.js.map
