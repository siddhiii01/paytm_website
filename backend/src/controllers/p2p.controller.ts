import { prisma } from "@db/prisma.js";
import type {Request, Response} from "express";
import z from "zod";
import { TransactionIntent } from '../utils/transactionIntent.js';
import { asyncHanlder } from '../utils/asyncHandler.js';
import { AppError } from "@utils/AppError.js";

const paymentSchema = z.object({
    amount: z.number().min(1).max(10000),
    phoneNumber: z.string().trim()
});

type P2PTransferResponse ={
    transactionId: number,
    status: "Completed",
    amount: number,
    recevierphoneNumber: string,
    typeofTransfer: string
}

export class p2p {
    static walletTransfer = asyncHanlder(async (req: Request, res: Response) => {
        //validating input
        const parsed = paymentSchema.safeParse(req.body);
        if(!parsed.success){
            throw new AppError("Zod validation failed", 400, parsed.error.flatten().fieldErrors);
        }
        const {phoneNumber, amount} = parsed.data;

        //geting authenticated user
        const senderId = (req as any).userId;
        if(!senderId){
            return res.status(401).json({message: "Unauthorized"});
        }
        let p2pTransfer;             
        p2pTransfer  = await prisma.$transaction( async (tx) => {
            console.log("Transaction started");
            
            //Fetching sender and it's wallet balance:
            const sender = await tx.user.findUnique({
                where: {id : senderId},
                include: {balances: true}
            });
            console.log("sender info from db", sender);

            if(!sender){
                throw new Error("Sender not found")
            }

            if(!sender.balances){
                throw new Error("Sender wallet not initialsed")
            }

            if(sender.balances.amount < amount){
                throw new Error("Insufficient Balance")
            }

            //fetching receiver and it's wallet balance
            const receiver = await tx.user.findUnique({
                where: {phoneNumber},
                include: {balances: true}
            });
            console.log("receiver", receiver);

            if(!receiver){
                throw new Error("Reciver not found");
            }

            if(!receiver.balances){
                throw new Error("Recieve wallet balance not initalised");
            }

            if(sender.id == receiver.id){
                throw new Error("Cannot send money to yourself");
            }

            const intent = TransactionIntent.createTransactionIntent(senderId, receiver.id, amount);
            console.log("intent: ", intent)
                //creating p2p transfer -> pending state
                // const p2pTransfer  =await tx.p2PTransfer.create({
                //     data: {
                //         senderId: sender.id,
                //         receiverId: receiver.id,
                //         amount,
                //         status: "PENDING"
                //     }
                // });
                // console.log("p2p", p2pTransfer);
            
                //updating balances of both : sender and receiver
                //locked send amt
                // await tx.balance.update({
                //     where: {userId: senderId}, 
                //     data: {
                //         amount: {decrement: amount},
                //         locked: {increment: amount} //race conditions
                //     },
                // });
                // await tx.balance.update({
                //     where: {userId: receiver.id},
                //     data: {amount: {increment: amount}}
                // });
                // //unlock sender locked amt
                // await tx.balance.update({
                //     where: {userId: senderId},
                //     data: {
                //         locked: {decrement: amount}
                //     }
                // })

                // //creating ledger entry
                // const ledger = await tx.transactionLedger.createMany({
                //     data: [
                //         //sneder
                //         {
                //             userId: sender.id,
                //             transactionType: "P2P_TRANSFER",
                //             direction: "DEBIT",
                //             amount,
                //             p2pTransferLedger: p2pTransfer.id

                //         }, 
                //         //receiver
                //         {
                //             userId: receiver.id,
                //             transactionType: "P2P_TRANSFER",
                //             direction: "CREDIT",
                //             amount,
                //             p2pTransferLedger: p2pTransfer.id
                //         }
                //     ]
                // });

                // console.log("Ledger Enteries: ", ledger);

                // //marking transfer completed
                // await tx.p2PTransfer.update({
                //     where: {id: p2pTransfer.id},
                //     data: {
                //         status:  "COMPLETED"
                //     }
                // });

                // return {
                //     transactionId: p2pTransfer.id,
                //     status: "COMPLETED",
                //     amount,
                //     receiverphoneNumber : receiver.phoneNumber,
                //     typeofTransfer: "P2P"
                
                // }
        });
       
    })
}


// try/catch -> HTTP level security
// $transaction -> DB level Security 