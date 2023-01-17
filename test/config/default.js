module.exports = {
  worker: {
    count: 4
  },
  server: {
    port: 6655,
    base_url: 'chess',
    router_scan_path: '/controller'
  },
  database: {
    mysql: {
      charset: 'utf8', //应该设置编码（省略在某些情况下会有错误）
      waitForConnections: true, // 为true时，连接排队等待可用连接。为false将立即抛出错误
      connectionLimit: 10, //单次可创建最大连接数
      queueLimit: 0 //连接池的最大请求数，从getConnection方法前依次排队。设置为0将没有限制
    }
  },
  body: {
    multipart: true, // 支持文件上传
    // encoding: 'gzip',
  }
}