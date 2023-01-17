import { join } from 'path'
import { koaBody } from 'koa-body'
import { importModules, moduleCatch } from '../util/module'

export default async (app) => {
  app.use(koaBody(app.config.body))

  // 加载外部组件
  let allModule = await importModules(join(app.config.appPath, 'middleware')).catch(moduleCatch)

  allModule
    .forEach(item => {
      app.use(item)
    })
}