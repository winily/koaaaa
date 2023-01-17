import { createHash } from 'crypto'

export const md5 = (password, salt) => {
  let md5 = createHash('md5')
  return md5.update(`${password}${salt}`).digest('hex')
}