const {
  ApolloClient, InMemoryCache, gql, HttpLink,
} = require('@apollo/client');
const fetch = require('cross-fetch');

const querySubgraph = async (queryString, subgraphURL) => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: subgraphURL, fetch }),
  });

  return client.query({
    query: gql(queryString),
  });
};

module.exports = querySubgraph;
