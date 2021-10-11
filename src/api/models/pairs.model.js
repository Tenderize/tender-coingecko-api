const querySubgraph = require('../services/subgraph');

const getPairs = async (subgraphURL) => {
  console.log(subgraphURL);
  const configsQuery = `
        query {
            configs{
                symbol
                tenderSwap
            }              
        }
    `;
  const res = await querySubgraph(configsQuery, subgraphURL);
  return res.data.configs.map((x) => ({
    ticker_id: `t${x.symbol}-${x.symbol}`,
    base: `t${x.symbol}`,
    target: x.symbol,
    pool_id: x.tenderSwap,
  }));
};

module.exports = getPairs;
