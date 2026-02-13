// import { z } from "zod";

// export const paymentSchema = z.object({
//     phoneNumber: z
//         .string()
//         .min(10, "Phone number must be 10 digits")
//         .max(10, "Phone number must be 10 digits"),

//     // amount must come in PAISA (integer)
//     amount: z
//         .number()
//         .min(100, "Minimum ₹1 (100 paise)")
//         .refine(val => Number.isInteger(val), {
//             message: "Amount must be an integer (in paise)"
//         })
// });

// export type Payment = z.infer<typeof paymentSchema>;