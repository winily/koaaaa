import { cpus } from 'os';
import { join, parse } from 'path'
import { cwd, env } from 'process'

import winston from 'winston'

import _ from 'lodash'
import { importModules } from './util/module';
const { merge } = _;

const appPath = cwd();

const customFormat = winston.format.printf((info) => {
  return `[Pixiu] ${info.level.toLocaleUpperCase()}:${info.timestamp}:${info.message}`
})

const systemDefault = {
  appPath: appPath,
  worker: {
    count: cpus().length
  },
  server: {
    port: 3000
  },
  logger: {
    format: winston.format.combine(
      winston.format.timestamp(),
      customFormat,
    ),
    transports: [
      new winston.transports.Console(),
    ]
  }
}

export default async () => {
  const modules = await importModules(join(appPath, 'config'), item => {
    const url = parse(item.path)
    return { [url.name.toLocaleUpperCase()]: item.default }
  })
  const configs = merge(...modules)
  const nodeEnv = (env.NODE_ENV || 'pron').toLocaleUpperCase()
  const envConfig = configs[nodeEnv] || {}
  envConfig.env = nodeEnv
  return merge(systemDefault, configs.DEFAULT, envConfig)
}