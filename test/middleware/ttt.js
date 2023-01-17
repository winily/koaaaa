
module.exports = (ctx, next) => {
  return next().catch((err) => {
    console.log(err.status, 'ttt')
    if (401 == err.status) {
      ctx.status = 401;
      ctx.error("请先登陆", 401);
    } else {
      throw err;
    }
  });
}