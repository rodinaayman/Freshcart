import * as z from "zod";

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
const passMessage = "Password must be at least 8 chars, include Uppercase, Lowercase, Number, and Special character";

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  
  password: z.string().regex(passwordRegex, { message: passMessage }),
  
  rePassword: z.string(),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;