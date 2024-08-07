// src/app.ts
import { Application } from '@midwayjs/koa';
import * as Koa from 'koa';
import * as koaBody from 'koa-body';

export default async (app: Application) => {
  const koaApp = app as Koa<Koa.DefaultState, Koa.DefaultContext>;

  // 使用 koa-body 解析请求体
  koaApp.use(koaBody({
    multipart: true, // 支持文件上传
    parsedMethods: ['POST', 'PUT', 'PATCH'], // 支持的请求方法
  }));

  // 其他中间件和路由配置...
};
