import GenerateId from './generateId'
import Response from './response'
import { ok } from 'assert'
export default async (app, config) => {
  // 注入系统工具
  app.tools = {}
  GenerateId(app, config)
  Response(app, config)

  const toolsConfig = config.tools || {}
  ok(typeof toolsConfig === 'object', 'config.tools must be an object')
  // 注入配置的工具
  Object.keys(toolsConfig).forEach(key => {
    ok(typeof toolsConfig[key] === 'function', 'config.tools item must be an function(app, config)')
    toolsConfig[key](app, config)
  })
}