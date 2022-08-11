import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { querySubgraph } from "../external/subgraph";
import { OrderBook } from "../interfaces/orderbook.interface";

class OrderBookService {
  public async getOrderBookFor(subgraphURL : string, symbol : string, depth: number): Promise<OrderBook> {
    depth = depth == 0 ? 1000 : depth;
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

    // tToken -> token , bids
    query = `
        query {        
        tokenExchanges(where:{
                steakAddress:"${res.data.configs[0].steak}",
                soldId: 1
            }, 
            first: ${depth / 2}, orderBy: timestamp, orderDirection: desc){
            tokensSold
            tokensBought
            }
        } 
    `
    let bidData = await querySubgraph(query, subgraphURL);

    // token -> tToken , asks
    query = `
        query {        
        tokenExchanges(where:{
                steakAddress:"${res.data.configs[0].steak}",
                soldId:0
            }, 
            first: ${depth / 2}, orderBy: timestamp, orderDirection: desc){
            tokensSold
            tokensBought
            }
        } 
    `
    let askData = await querySubgraph(query, subgraphURL);

    bidData.data.tokenExchanges.map((x) => {
        data.bids.push([calcPrice(x.tokensBought, x.tokensSold), formatUnits(x.tokensSold)])
    })
    askData.data.tokenExchanges.map((x) => {
        data.asks.push([calcPrice(x.tokensBought, x.tokensSold), formatUnits(x.tokensSold)])
    })

    return data
  }
}

function calcPrice(bought: number, sold: number) {
    const TEN_POW_18 = BigNumber.from(10).pow(18)
    return  formatUnits(BigNumber.from(bought).mul(TEN_POW_18).div(sold))
}
export default OrderBookService;
