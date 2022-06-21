import { Request, Response } from "express";
import totalSupplyService from '../../services/totalSupply.service';
import { getSubraphFromSymbol } from "../../utils";

export default async (req: Request, res: Response) => {
    if(!req.query.symbol){
        res.json({error: "Missing query param: symbol"})
        return;
    }
    const symbol = req.query.symbol as string
    const underlyingSymbol = symbol.substring(1)
    const _totalSupplyService = new totalSupplyService();
    const network = await getSubraphFromSymbol(underlyingSymbol);
    console.log(network)
    if (!network) {
        res.json({error: "Cannot find token"})
        return;
    }
    const totalSupply = await _totalSupplyService.getTotalSupply(network, underlyingSymbol);
    res.json(totalSupply);
};