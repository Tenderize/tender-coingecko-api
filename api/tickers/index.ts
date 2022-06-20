import { Request, Response } from "express";
import tickerService from '../../services/ticker.service';
import { networks } from "../../networks";
import { Ticker } from "../../interfaces/ticker.interface";

export default async (req: Request, res: Response) => {
    const _tickerService = new tickerService();
    const tickers: Ticker[] = [];
    for (let i = 0; i < networks.length; i += 1) {
        // TODO: Make requests simulataneously
        tickers.push(... await _tickerService.findAllTickers(networks[i]));
    }
    res.json(tickers);
};