import * as z from "zod";

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

export const signupSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  
  password: z.string().regex(passwordRegex, {
    message: "Password must be at least 8 chars, include Uppercase, Lowercase, Number, and Special character",
  }),
  
  rePassword: z.string(),
  phone: z.string().min(10, { message: "Invalid phone number" }),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
});

export type SignupSchemaType = z.infer<typeof signupSchema>;