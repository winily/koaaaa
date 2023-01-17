import { readdir } from 'fs/promises'
import { join } from 'path'

export const importModules = async (path, callback = item => item.default) => {
  const dir = await readdir(path)
  let allModule = dir.map(async item => {
    const fullpath = join(path, `./${item}`)
    const result = await import(fullpath)
    result.path = fullpath
    return result
  })
  return (await Promise.all(allModule)).map(callback)
}

export const moduleCatch = (error) => {
  if (!(error instanceof Error) || !error.message.includes('no such file or directory')) {
    return Promise.reject(error)
  }
} 