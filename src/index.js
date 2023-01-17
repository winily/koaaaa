import cluster from 'cluster';
import { cpus } from 'os'
import winston from 'winston'

import('./local-injection')

import application from './application';
import Config from './config';
import controller from './controller';

const statisticalRouter = async (app) => {
  const router = await controller(app);
  const routerList = router.stack.map(item => `[${item.methods.join(',')}]:${item.path}`).join('\n')
  console.log()
  app.logger.debug(`Router: \n${routerList}\n`)
}

const debug = async (config, logger) => {
  const main = {
    app: { config, logger, use: () => { } }
  }
  await statisticalRouter(main.app);

  // 释放 app 资源
  delete main.app
}

module.exports = async () => {
  const config = await Config()
  if (!cluster.isPrimary) return application(config);

  const logger = winston.createLogger(config.logger || {})
  if (config.env === 'DEV') await debug(config, logger)

  logger.info(`本机 CPU 数量 ${cpus().length}, 将启动：${config.worker.count}, 个进程。`)
  const workers = []
  for (let i = 0; i < config.worker.count; i++) {
    const worker = cluster.fork()
    workers.push(worker)
  }

  cluster.on('exit', (worker) => {
    logger.info(`进程 ${worker.process.pid} 被动退出了，尝试重新唤起一个进程！`);
    cluster.fork()
  });

  let okCount = 0;
  for (let worker of workers) {
    worker.on('message', (message) => {
      message === 'ok' && okCount++;
    })
  }

  const intervalId = setInterval(() => {
    if (okCount < 4) return
    logger.info(`URL: http://localhost:${config.server.port}`)
    clearInterval(intervalId)
  }, 200)
}

// export const start = 