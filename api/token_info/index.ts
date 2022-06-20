import { Request, Response } from "express";
import tokenInfo from '../../token_info.json';

export default async (req: Request, res: Response) => {
    res.json(tokenInfo);
};