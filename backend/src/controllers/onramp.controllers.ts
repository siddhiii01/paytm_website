
// Step 1 — User sends amount + provider
// Step 2 — Server generates a unique token (for redirect / status tracking)
// Step 3 — You store the transaction in the DB
// Step 4 — You respond with a redirect URL to a mock bank
import type {Request, Response} from "express";
import {initiateOnRampSchema} from "@validations/onramp.schema.js";
import { prisma } from "@db/prisma.js";


export const initiateOnRampTx = async (req:Request, res:Response) =>{
    const result = initiateOnRampSchema.safeParse(req.body);
    if(!result.success){
        return res.json({
            error: result.error
        })
    }

    const userId = (req as any).userId;
    console.log(userId)

    const token = "kdjdjjjhdjkdkjd"
    const tx = await prisma.onRampTx.create({
        data: {
            amount: result.data.amount,
            provider: result.data.provider,
            userId,
            token
        }
    })

    console.log(tx);
    res.json({
        data : tx
    })

}