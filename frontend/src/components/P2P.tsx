import type React from "react"
import {useForm} from "react-hook-form";
import { api } from "../utils/axios";
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

const paymentSchema = z.object({
    amount: z.number().min(1, "Amount can be ").max(10000, "At once only Rs.10000"),
    phoneNumber: z.string().trim()
});

type Payment = z.infer<typeof paymentSchema>

export const P2P:React.FC  =  () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        
    } = useForm<Payment>({resolver: zodResolver(paymentSchema)});

    const onSubmit = async (data: Payment) => {
        console.log("Payment data ",data)
        console.log("type of data: ", typeof data.phoneNumber, typeof data.amount)

        const response = await api.post('/p2ptransfer', data);
        console.log(response.data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input 
                placeholder="Enter PayX user phone number"
                {...register("phoneNumber")}
            />
            {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
            {/* <p>{errors.phoneNumber}</p> */}
            <input 
                placeholder="Enter amount"
                {...register("amount",{
                    valueAsNumber: true
                } )}
            />
             {errors.amount && <p>{errors.amount.message}</p>}
            <button type="submit">Pay</button>
        </form>
    )
}