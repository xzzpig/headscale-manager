// 运行时配置

import React from "react";

import RootContainer from "./components/RootContainer";
import icon from "@/favicon.svg"

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '' };
}

export const layout = () => {
  return {
    logo: icon,
    menu: {
      locale: false,
    },
  };
};


export function rootContainer(container: React.ReactNode) {
  return React.createElement(RootContainer, {}, container);
}