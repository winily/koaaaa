import GenerateId from './generateId'
import Response from './response'
import { ok } from 'assert'
import { importModules, moduleCatch } from '../util/module'
import { join } from 'path'

export default async (app, config) => {
  // 注入系统工具
  app.tools = {}
  GenerateId(app, config)
  Response(app, config)

  let allModule = await importModules(join(app.config.appPath, 'tools')).catch(moduleCatch)
  // 注入配置的工具
  allModule.forEach(item => {
    ok(typeof item === 'function', 'config.tools item must be an function(app, config)')
    item(app, config)
  })
}