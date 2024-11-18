import { z } from 'zod'

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  signInTime: z.number()
})

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})
