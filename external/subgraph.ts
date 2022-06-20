import {
    ApolloClient, InMemoryCache, gql, HttpLink,
  } from '@apollo/client'
  import fetch from 'cross-fetch'
  
export async function querySubgraph (queryString, subgraphURL){
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({ uri: subgraphURL, fetch }),
    });

    return client.query({
        query: gql(queryString),
    });
};

  