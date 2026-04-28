import * as z from "zod";
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
const passMessage = "Password must be at least 8 chars, include Uppercase, Lowercase, Number, and Special character";
const passwordRules = z.string().regex(passwordRegex, { message: passMessage });
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  password: passwordRules,
  rePassword: z.string(),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
});
export const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: passwordRules,
  rePassword: z.string(),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
});

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;