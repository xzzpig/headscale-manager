module.exports = {
  schema: 'graph/schema.graphqls',
  documents: 'front/headscale-manager-ui/src/graphql/*.graphql',
  generates: {
    "front/headscale-manager-ui/src/graphql/codegen.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"]
    },
  }
}