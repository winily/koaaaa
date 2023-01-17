import { readdir, stat } from 'fs/promises'
import { join } from 'path'

export const getCurrentPath = (url) => join(new URL(url).pathname, '..')

export const findAllPath = async (baseUrl) => {
  let paths = await readdir(baseUrl)
  const promiseAll = []
  const dirPath = []
  for (const item of paths) {
    const result = await stat(join(baseUrl, item))
    if (!result.isFile()) {
      promiseAll.push(
        findAllPath(join(baseUrl, item))
          .then(subPaths => subPaths.map(subItem => join(item, subItem)))
      )
      dirPath.push(item)
    }
  }

  paths = paths
    .filter(item => !dirPath.includes(item))
  const allResult = await Promise.all(promiseAll)
  paths = paths.concat(
    allResult.reduce((all, current) => all.concat(current), [])
  )
  return paths
}