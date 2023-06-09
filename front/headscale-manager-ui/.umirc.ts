import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  headScripts: [
    {
      src: "./myconfig.js",
    }
  ],
  layout: {
    title: 'Headscale Manager',
  },
  history: {
    type: 'hash',
  },
  fastRefresh: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  routes: [
    {
      path: '/',
      redirect: '/device',
    },
    {
      name: '设备',
      path: '/device',
      component: './Device',
    },
    {
      name: '项目',
      path: '/project',
      component: './Project',
    },
    {
      name: '路由',
      path: '/route',
      component: './Route',
    },
    {
      name: '机器',
      path: '/machine',
      component: './Machine',
    },
  ],
  npmClient: 'yarn',
});

