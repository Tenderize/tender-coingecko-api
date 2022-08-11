import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { querySubgraph } from "../external/subgraph";
import { OrderBook } from "../interfaces/orderbook.interface";

class OrderBookService {
  public async getOrderBookFor(subgraphURL : string, symbol : string, depth: number): Promise<OrderBook> {
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

    // TODO: Write general purpose wrapper for pagination support
    // tToken -> token , bids
    let bidData = []
    let askData = []
    let returnedData
    let skip = 0

    do{
        query = `
            query {        
            tokenExchanges(where:{
                    steakAddress:"${res.data.configs[0].steak}",
                    soldId: 1
                }, 
                first: 100, skip: ${skip}, orderBy: timestamp, orderDirection: desc){
                tokensSold
                tokensBought
                }
            } 
        `
        returnedData = (await querySubgraph(query, subgraphURL)).data.tokenExchanges
        bidData = bidData.concat(returnedData)
        skip += 100
    } while (returnedData.length > 0)

    // token -> tToken , asks
    skip = 0
    do{
        query = `
            query {        
            tokenExchanges(where:{
                    steakAddress:"${res.data.configs[0].steak}",
                    soldId: 0
                }, 
                first: 100, skip: ${skip}, orderBy: timestamp, orderDirection: desc){
                tokensSold
                tokensBought
                }
            } 
        `
        returnedData = (await querySubgraph(query, subgraphURL)).data.tokenExchanges
        askData = askData.concat(returnedData)
        skip += 100
    } while (returnedData.length > 0)

    // TODO: Optimize by only fetching what is required
    if(depth > 0) {
        bidData = bidData.slice(0, depth / 2)
        askData = askData.slice(0, depth / 2)
    }
    

    bidData.map((x) => {
        data.bids.push([calcPrice(x.tokensBought, x.tokensSold), formatUnits(x.tokensSold)])
    })
    askData.map((x) => {
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
