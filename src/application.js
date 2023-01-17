import process from 'process';
import { createServer } from 'http'
import winston from 'winston'
import Koa from 'koa'

import tools from './tools/index.js';
import service from './service.js';
import middleware from './middleware/index.js';
import controller from './controller.js';

export default async (config) => {
  const app = new Koa();
  app.config = config
  app.logger = winston.createLogger(config.logger || {})
  app.originServer = createServer(app.callback())

  // 注册相关服务 工具
  await tools(app, config);
  await service(app);
  await middleware(app);
  await controller(app);

  app.originServer.listen(config.server.port, () => {
    app.logger.info(`进程 ${process.pid} 已经启动!`)
    process.send('ok')
  })
}