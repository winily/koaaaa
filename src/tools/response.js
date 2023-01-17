export default (app) => {
  app.context.success = function (data, code = 200) {
    this.body = {
      message: "success",
      code,
      data
    }
  }
  app.context.error = function (message = "Oops! server did not respond.", code = 500) {
    if (message instanceof Error) message = message.message
    this.body = {
      message,
      code
    }
  }
}