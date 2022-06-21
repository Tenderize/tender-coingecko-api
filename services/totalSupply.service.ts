import { getTotalSupply } from '../external/contracts';
import { querySubgraph } from '../external/subgraph';

class TotalSupplyService {
  public async getTotalSupply(network : string, symbol : string): Promise<string> {
    const query = `
            query {
                configs(where:{symbol:"${symbol}"}){
                    tenderToken
                }              
            }
        `;
    const res = await querySubgraph(query, network);
    const tenderTokenAddress = res.data.configs[0].tenderToken;
    return await getTotalSupply(tenderTokenAddress, symbol)
  }
}

export default TotalSupplyService;
