import { Request, Response } from "express";
import orderbookService from '../../services/orderbook.service';
import { OrderBook } from "../../interfaces/orderbook.interface";
import { getSteakSymbolFromTicker, getSubraphFromSymbol } from "../../utils";

export default async (req: Request, res: Response) => {
    if(!req.query.ticker_id){
        res.json({error: "Missing query param: ticker_id"})
        return;
    }

    const _orderBookService = new orderbookService();
    const symbol = getSteakSymbolFromTicker(req.query.ticker_id)
    const network = await getSubraphFromSymbol(symbol);
    if(!network){
        res.json({error: "Ticker not found"})
        return;
    }   

    const orders: OrderBook = await _orderBookService.getOrderBookFor(
        network,
        symbol,
        req.query.depth ? +req.query.depth : 100
    )
    
    res.json(orders)
};