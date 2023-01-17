import { importModules, moduleCatch } from './util/module'
import { join } from 'path'


const toServiceName = (service) => {
  let name = service.name
  name = name.replace('Service', '')
  return `${name[0].toLocaleLowerCase()}${name.substring(1)}`
}

export default async (app) => {
  const allModule = await importModules(join(app.config.appPath, 'service')).catch(moduleCatch)
  const service = {}
  allModule.forEach(item => {
    const name = toServiceName(item)
    service[name] = new item(app)
  })
  app.service = service
}