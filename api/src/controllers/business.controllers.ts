import { Request, Response } from "express";

export function businessQRScanController(_req: Request, res: Response) {
    res.status(200).json({ discount: 'Placeholder'})
}