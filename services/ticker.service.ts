import { querySubgraph } from '../external/subgraph';
import { getTargetPrice } from '../external/contracts';
import { BigNumber } from 'ethers';
import { Ticker } from '../interfaces/ticker.interface';
import { formatUnits } from 'ethers/lib/utils';

class TickerService {
  public async findAllTickers(subgraphURL : string): Promise<Ticker[]> {
    const yesterday = Math.round((new Date(new Date().getTime() - (24 * 60 * 60 * 1000))).getTime() / 1000);
    const query = `
            query {
                configs{
                    symbol
                    steak
                    tenderSwap
                    tenderToken
                }              
                tokenExchanges(where:{timestamp_gt:"${yesterday}"}, orderBy: timestamp, orderDirection: desc){
                    id
                    soldId
                    tokensSold
                    boughtId
                    tokensBought
                    steakAddress
                }
            }
        `;
    const res = await querySubgraph(query, subgraphURL);
    let data = []
    for(let i = 0; i < res.data.configs.length; i += 1){
        const conf = res.data.configs[i];
        data[conf.steak] = {
            ticker_id: `t${conf.symbol}-${conf.symbol}`,
            base: `t${conf.symbol}`,
            target: conf.symbol,
            pool_id: conf.tenderSwap,
            last_price: await getTargetPrice(conf.tenderSwap, conf.tenderToken, conf.symbol),
            base_volume: BigNumber.from(0).toString(),
            target_volume: BigNumber.from(0).toString()
        }
    }
    
    res.data.tokenExchanges.map((x) => {
        let baseVolume, targetVolume
        if(x.soldID == 0){
            targetVolume = x.tokensSold
            baseVolume = x.tokensBought
        } else {
            targetVolume = x.tokensBought
            baseVolume = x.tokensSold
        }

        data[x.steakAddress].base_volume = BigNumber.from(data[x.steakAddress].base_volume).add(baseVolume).toString();
        data[x.steakAddress].target_volume = BigNumber.from(data[x.steakAddress].target_volume).add(targetVolume).toString();
    })

    // Format to ethers from gwei
    // TODO: Improve this
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++){
        data[keys[i]].base_volume = formatUnits(data[keys[i]].base_volume)
        data[keys[i]].target_volume = formatUnits(data[keys[i]].target_volume)
    }

    return Object.values(data)
  }
}

export default TickerService;
