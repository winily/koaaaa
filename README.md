# Koaaaa

一个随便封装的多进程 koa 框架

### 1.项目结构

```
.
├── config
│   ├── default.js
│   ├── pron.js
│   └── dev.js
├── middleware
│   └── ttt.js
├── tools
│   └── redis.js
├── controller
│   └── testController.js
├── service
│   └── test.js
├── app.js
└── package.json
```

- config 配置目录「必需」，会自动读取改目录下的所有文件，配置文件以环境名命名例如：pron,dev,test, default 为默认配置，会与其他配置合并

- middleware「非必需」 中间件目录，目前暂时不支持中间件顺序设定，中间件暴露为标准的 koa 中间件 async (ctx, next) => Promise 模式

- tools「非必需」 工具目录，以 (app) => void 方式暴露挂载函数，函数内自己手动往某个地方挂载工具，有 app.tools 对象通常可以挂载到这上面

- controller 控制器目录「必需」，舍弃了 router 配置，每个控制器代码会传入 app, router, tools 对象
  例：

```js
module.exports = (app, router, tools) => {
  router.get('/test', async (ctx) => {
    try {
      ctx.success({ id: app.tools.generateId() })
    } catch (err) {
      console.error(err)
      ctx.error(err)
    }
  })
}
```

- service 服务目录「非必需」，自动加载并实例化服务对象，会在构造的时候传入 app 对象，对象会注入到 app.service 对象里面，会忽略 Service 后缀，例如下面例子的 TestService 可以使用 app.service.test 的方式调用

例:

```js
module.exports = class TestService {
  constructor(app) {
    this.app = app
    this.tools = app.tools
  }
}
```

### API

```ts
type app: Koa && {
  config: object,
  tools: {
    generateId: () => bigint
  },
  service: object,
}
```
