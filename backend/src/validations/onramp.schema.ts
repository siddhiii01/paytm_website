import {z} from "zod";



// Schema for initiating an on-ramp transaction
export const initiateOnRampSchema = z.object({
  amount: z
    .number()
    .min(100, "Minimum amount is ₹1") // 100 paisa = ₹1
    .max(10000000, "Maximum amount is ₹100,000"), // 10 crore paisa
  provider: z.enum(["HDFC", "AXIS", "ICICI"], {
    errorMap: () => ({ message: "Invalid bank provider" }),
  }),
});

//TypeInference for schema
export type InititateOnRampInput = z.infer<typeof initiateOnRampSchema>

export const getTransactionSchema = z.object({
    token: z.string().min(1, "Token is required")
})