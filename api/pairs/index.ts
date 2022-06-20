import { Request, Response } from "express";
import pairService from '../../services/pair.service';
import { Pair } from "../../interfaces/pair.interface";
import { networks } from "../../networks";

export default async (req: Request, res: Response) => {
    const _pairService = new pairService();
    const pairs: Pair[] = [];
    for (let i = 0; i < networks.length; i += 1) {
        pairs.push(... await _pairService.findAllPairs(networks[i]));
    }
    res.json(pairs);
};