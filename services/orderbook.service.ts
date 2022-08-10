import { formatUnits } from "ethers/lib/utils";
import { querySubgraph } from "../external/subgraph";
import { OrderBook } from "../interfaces/orderbook.interface";

class OrderBookService {
  public async getOrderBookFor(subgraphURL : string, symbol : string, depth: number): Promise<OrderBook> {
    const yesterday = Math.round((new Date(new Date().getTime() - (24 * 60 * 60 * 1000))).getTime() / 1000);
    let data : OrderBook = {
        ticker_id: `t${symbol}-${symbol}`,
        timestamp: Math.round(Date.now() / 1000).toString(),
        bids: [],
        asks: []
    }

    let query = `
            query {
                configs(where:{symbol:"${symbol}"}){
                    steak
                }              
            }
        `;
    let res = await querySubgraph(query, subgraphURL);
    query = `
        query {        
        tokenExchanges(where:{steakAddress:"${res.data.configs[0].steak}"}, 
            first: ${depth / 2}, orderBy: timestamp, orderDirection: desc){
            id
            soldId
            tokensSold
            boughtId
            tokensBought
            steakAddress
            }
        } 
    `
    res = await querySubgraph(query, subgraphURL);
    res.data.tokenExchanges.map((x) => {
        // TODO: check oreder here
        if(x.soldID == 0){
            data.bids.push([formatUnits(x.tokensBought), formatUnits(x.tokensSold)])
        } else {
            data.bids.push([formatUnits(x.tokensSold), formatUnits(x.tokensBought)])
        }
    })

    data.asks = data.bids

    return data
  }
}
export default OrderBookService;
