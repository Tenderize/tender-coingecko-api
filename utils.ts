import { querySubgraph } from "./external/subgraph";
import { networks } from "./networks";

export const getSteakSymbolFromTicker = (tickerID) => {
  return tickerID.split('-')[1]
};

export const getSubraphFromSymbol = async (symbol) => {
  const configsQuery = `
        query {
            configs{
                symbol
            }              
        }
    `;
    for (let i = 0; i < networks.length; i += 1) {
      const resp = await querySubgraph(configsQuery, networks[i]);
      for (let j = 0; j < resp.data.configs.length; j += 1){
        if (resp.data.configs[j].symbol == symbol) {
        return networks[i];
      }
    }
  }
  return '';
};