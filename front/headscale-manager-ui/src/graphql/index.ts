import myconfig from "@/config";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: myconfig?.graphqlEndpoint ?? '/graphql'
})
