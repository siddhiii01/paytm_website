import type {Request, Response} from "express";
import { prisma } from "@db/prisma.js";
import {z} from "zod";
import { AppError } from "@utils/AppError.js";


// Input schema from dummy bank (matches what bank sends)
export const paymentCallbackSchema = z.object({
    token: z.string().min(1, "Token is required"),
    userId: z.number().int().positive(),
    amount: z.number().min(1).max(2100000),
    status: z.enum(['Success', 'Failed'])
});

type PaymentCallback = z.infer<typeof paymentCallbackSchema>;

/**
 * webhookHandler - Handles asynchronous callbacks from the bank
 * Called by dummy bank (or real bank) when user approves/declines payment
 *
 * Important properties:
 * - Idempotent: safe to call multiple times (no double-credits)
 * - Atomic: uses Prisma $transaction to prevent partial updates
 * - Validates: token, userId, amount match DB record
 */

export class Webhook {
    static webhookhanlder = async (req: Request, res: Response) => {
        //Validate incoming payload
        const parsed = paymentCallbackSchema.safeParse(req.body);
        if(!parsed.success){
            console.warn("Invalid webhook payload:", z.prettifyError(parsed.error));
            return res.status(400).json({
                message: "Invalid request body",
                errors: z.prettifyError(parsed.error),
            });
        }
        const { token, userId, amount, status } = parsed.data;

        try {
            let alreadyProcessed = false;
            let transactionFailed = false;

            //Atomic transaction – either all succeed or nothing changes
            await prisma.$transaction( async (tx) => {
                // Find the on-ramp transaction by token
                const onRampTx = await tx.onRampTx.findUnique({
                    where: {token}
                });

                if (!onRampTx) {
                    throw new AppError(`Transaction not found for token: ${token}`);
                }

                // Security: userId must match (prevents token guessing attacks)
                if (onRampTx.userId !== userId) {
                    throw new Error("User ID mismatch in webhook");
                }

                //preventing idempotency (replay attacks) -> if already final state do nothing
                //Checking Current Status to Prevent Duplicates
                if(onRampTx.status === "Success" || onRampTx.status === "Failed"){
                    console.log(`Webhook ignored (already ${onRampTx.status}): ${token}`);
                    alreadyProcessed = true
                    return;
                }

                // Only proceed if still in Processing
                if (onRampTx.status !== "Processing") {
                    throw new Error(`Unexpected status: ${onRampTx.status}`);
                }

                //// Handle failure case
                if(status === "Failed"){
                    await tx.onRampTx.update({
                        where: {token},
                        data: {
                            status: 'Failed'
                        }
                    })
                    transactionFailed = true;
                    console.log(`Transaction marked Failed: ${token}`);
                    return;
                }

                //handling Successs Tx : -> credit balance + ledger
                await tx.balance.update({
                    where: {
                        userId: onRampTx.userId
                    },
                    data: {
                        amount: {
                            increment: onRampTx.amount
                        }
                    },

                    
                });

                // Create ledger entry for history
                await tx.transactionLedger.create({
                    data: {
                        userId: onRampTx.userId,
                        transactionType: "ONRAMP",
                        direction: "CREDIT",
                        amount: onRampTx.amount, // paise
                        onRampTxLedger: onRampTx.id, // link back
                    },
                });

                // Finalize on-ramp record
                await tx.onRampTx.update({
                    where: {token},
                    data: {
                        status: 'Success'
                    }
                });
                console.log(`Wallet credited: +${onRampTx.amount/100} rupees for user ${userId}`);

               
            });

            //Always return 200 to bank (idempotent ACK)
            if (alreadyProcessed) {
                return res.status(200).json({message: 'Transaction already processed'});
            }
            
            if (transactionFailed) {
                return res.status(200).json({message: 'Transaction marked as failed'});
            }

            return res.status(200).json({ message: "Webhook processed successfully" });

        } catch(error: any){
            console.error("Webhook processing failed:", {
                token,
                error: error.message,
                stack: error.stack?.slice(0, 400),
            });

            // Still return 200 – most payment providers expect ACK even on error
            // (they may retry, which is why idempotency is critical)
            return res.status(200).json({ message: "Webhook received, but processing failed internally" });
        }

        

        
         
        
    }
}