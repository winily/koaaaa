import Router from 'koa-router';
import { importModules, moduleCatch } from './util/module'
import { join } from 'path'

export default async (app) => {

  const allModule = await importModules(join(app.config.appPath, 'controller'))
  const router = new Router();

  allModule
    .forEach(item => item(app, router, app.tools || {}))

  app.use(router.routes());
  return router
}