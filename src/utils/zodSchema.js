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

