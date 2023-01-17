import { Snowflake } from 'nodejs-snowflake'

export default (app) => {
  const snowflake = new Snowflake();
  app.tools.generateId = () => snowflake.getUniqueID() // 挂载工具
}