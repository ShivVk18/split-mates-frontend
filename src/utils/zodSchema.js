import z from "zod";


export const groupSchema = z.object({
     name: z.string().min(1, "Group name is required"),
     description: z.string().optional(),
     category: z.enum(["GENERAL",
  "TRIP",
  "HOME",
  "COUPLE",
  "FRIENDS",
  "WORK",
  "PROJECT",
  "EVENT",
  "TRAVEL",
  "FOOD",
  "UTILITIES",
  "ENTERTAINMENT",
  "SHOPPING",
  "TRANSPORT",
  "OTHER"]) ,
  currency: z.string().min(1, "Currency is required").default("INR")
})  

export const createExpenseSchema = z.object({
  groupId: z.string().optional().nullable(),
  paidById: z.string({
    required_error: "PaidById is required",
  }),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1, "Description cannot be empty"),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
  message: "Amount must be a valid positive number"
}),
  currency: z.string().default("USD").optional(),
  splitType: z.enum(["EQUAL", "PERCENTAGE", "EXACT", "SHARES"], {
    required_error: "Split type is required",
  }),
  date: z.string().optional().nullable(),
  isSettled: z.boolean().optional().default(false),
  notes: z.string().optional().nullable(),

  // splits → must be an array of { userId, amount?, percentage?, shares? }
  splits: z.array(z.object({
    userId: z.string(),
    amount: z.number().optional(),
    percentage: z.number().optional(),
    shares: z.number().optional(),
  })).optional().default([]),

  // tagIds → optional array of strings
  tagIds: z.array(z.string()).optional().default([]),
});