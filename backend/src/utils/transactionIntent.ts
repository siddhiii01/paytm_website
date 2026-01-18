    import { prisma } from "@db/prisma.js";


    export class TransactionIntent {
        //this function was basically there to create a record that:
        //user A -> intends to send X to user B at T time 
        // all of the other system depends on this logic after an row is created
        static async createTransactionIntent(senderId:any, receiverId:any, amount:any){
            try{
                const intent = await prisma.transactionIntent.create({
                    data : {
                        senderId,
                        receiverId,
                        amount,
                        status: 'PENDING',
                        riskScore: 0
                    }, include: {
                            sender: {
                                select: {id: true, email: true, name: true}
                            },
                            receiver: {
                                select: {id:true, email: true, name: true}
                            },
                    },
                });
                return intent;
            } catch(error){
                console.log("Error while creating transaction intent: ", error);
                throw new Error('Failed to create Transaction intent')
            }
        }

        
    }