import { querySubgraph } from '../external/subgraph';
import { Pair } from '../interfaces/pair.interface';

class PairService {
  public async findAllPairs(subgraphURL : string): Promise<Pair[]> {
    const configsQuery = `
    query {
        configs{
            symbol
            tenderSwap
        }              
    }
    `;
    const res = await querySubgraph(configsQuery, subgraphURL);
    const pairs: Pair[] = res.data.configs.map((x) => ({
        ticker_id: `t${x.symbol}-${x.symbol}`,
        base: `t${x.symbol}`,
        target: x.symbol,
        pool_id: x.tenderSwap,
      }));
    return pairs;
  }
}

export default PairService;
