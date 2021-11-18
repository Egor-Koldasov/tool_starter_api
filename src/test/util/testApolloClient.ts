import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import { NormalizedCacheObject } from "@apollo/client/cache";
import config from "../../config";
import { makeTestFetch } from "./testFetch";

const fetch = makeTestFetch();
export const makeTestApolloClient = () => {
  const link = new HttpLink({
    uri: `http://localhost:${config.graphqlPort}/graphql`,
    fetch, 
    fetchOptions: {
      credentials: 'include'
    },
    credentials: 'include'
  });
  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
    credentials: 'include'
  });
  return client
}

type ApolloClientTestFn = (client: ApolloClient<NormalizedCacheObject>) => Promise<void>
export const testApolloClient = async (fn: ApolloClientTestFn) => {
  const client = makeTestApolloClient();
  try {
    await fn(client);
  } catch (error: any) {
    if (error?.networkError?.result?.errors) {
      throw error.networkError.result.errors;
    }
    throw error;
  }
}