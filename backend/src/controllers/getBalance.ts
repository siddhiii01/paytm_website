import { prisma } from "@db/prisma.js";
import { Prisma } from "@prisma/client";
import type {Request, Response} from "express";

type UserWithBalance = Prisma.UserGetPayload<{
    include: {balances: true}
}>

export const getBalance = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    // res.send(userId)
    const user: UserWithBalance | null = await prisma.user.findUnique({
        where: {id: userId},
        include: {balances: true}
    });

    if(!user){
        return res.status(404).json({
            error: "User not found"
        });
    }
    res.status(200).json({
        data: {
            email: user.email,
            amount: user.balances?.amount ?? 0 //nullish coalescing operator -> If the value on the left is null or undefined, use 0 instead.
        },

    })

}