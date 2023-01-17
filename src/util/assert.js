import { ok } from 'assert'

export const requied = (value, message) => {
  ok(value !== undefined, message)
  ok(value !== null, message)
  ok(value !== '', message)
}