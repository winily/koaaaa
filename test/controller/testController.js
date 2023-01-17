const process = require('process')

module.exports = (app, router, tools) => {
  router.get('/test', async (ctx) => {
    try {
      ctx.success({ id: app.tools.generateId(), big: BigInt(123) })
    } catch (err) {
      console.error(err)
      ctx.error(err)
    }
  })
}