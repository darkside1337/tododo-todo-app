import { z } from "zod";

export const todoSchema = z.object({
  id: z.string().optional(),
  body: z
    .string()
    .min(2, {
      message: "Todo Item must be atleast 2 letters.",
    })
    .max(100, {
      message: "Todo Item must cannot be longer than 100 characters.",
    }),
  status: z.enum(["complete", "incomplete"], {
    message: "either complete or incomplete",
  }),
});
