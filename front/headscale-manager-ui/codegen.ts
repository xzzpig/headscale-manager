
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "../../graph/schema.graphqls",
  documents: "src/graphql/*.graphql",
  generates: {
    "src/graphql/codegen.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"]
    },
  }
};

export default config;
