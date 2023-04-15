import { defineConfig } from '@umijs/max';
import icon from "@/assets/favicon.svg"

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
      redirect: '/project',
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

