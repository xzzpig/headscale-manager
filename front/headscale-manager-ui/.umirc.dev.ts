import { defineConfig } from '@umijs/max';

export default defineConfig({
  proxy:{
    "/graphql":{
      target:"http://localhost:8080"
    },
  }
});

