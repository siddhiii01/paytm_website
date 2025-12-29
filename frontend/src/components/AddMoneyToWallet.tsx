import {useForm} from "react-hook-form";
import { api } from "../utils/axios";
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

const PROVIDERS = ["HDFC", "AXIS", "SBI"] as const;

const moneySchema = z.object({
    amount : z.number().min(1).max(10000),
    provider: z.enum(PROVIDERS),
});

type Money = z.infer<typeof moneySchema>;

export const AddMoneyToWallet = () => {
    const {
        register, 
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<Money>({resolver: zodResolver(moneySchema)});

    const onSubmit = async (data: Money) => {
        try {
            console.log("Money Added", data, typeof data);
            const response = await api.post(`/addmoneytowallet`,data);
            console.log("Paytm Server response on ramp: ",response.data);
            const { success, paymentUrl } = response.data;
            if(success){
                window.location.href = paymentUrl;
            }
            console.log(window.location.href)
            reset(); //clearing the form after success

        } catch(error){
            console.error("Failed to add money", error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add Money to PayX Wallet</h2>
        <input 
            placeholder="Enter Amount"
            type="number"
            {...register("amount", {
                valueAsNumber: true
            })}
        />
        <label>Select Your Bank</label>
        <select {...register("provider")}>
            <option value="HDFC">HDFC</option>
            <option value="AXIS">AXIS</option>
            <option value="SBI">SBI</option>
        </select>


        {errors.amount && (<p>{errors.amount.message}</p>)}

        <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding...": "Add Money to Wallet"}
        </button>

        </form>
    )
}

