import { Request, Response } from "express";

export function businessQRScanController(_req: Request, res: Response) {
    const user_business_id: String = _req.body.user_business_id
    console.log(user_business_id)
    const id_array = user_business_id.split('=')
    res.status(200).json({ discount: id_array[0]})
}