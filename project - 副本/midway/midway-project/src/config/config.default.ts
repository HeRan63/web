import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1721629613207_6285',
  koa: {
    port: 7001,
  },
  jwt: {
    secret: 'your-secret-key',
    expiresIn: '1d',
  },
  cors: {
    origin: '*',
  },
} as MidwayConfig;
