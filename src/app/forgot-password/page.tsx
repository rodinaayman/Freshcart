"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { forgotPassword } from "@/services/auth.service";
import AuthSideBanner from "@/components/auth/AuthSideBanner"; 

import * as z from "zod";
const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});
type ForgotSchemaType = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { handleSubmit, control, formState: { errors } } = useForm<ForgotSchemaType>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotSchemaType) => {
    setIsLoading(true);
    try {
      const res = await forgotPassword(data.email);
      if (res.statusMsg === "success") {
        localStorage.setItem("resetEmail", data.email);
        Swal.fire("Success!", "Reset code sent to your email.", "success").then(() => {
          router.push("/verify-reset-code");
        });
      } else {
        Swal.fire("Error", res.message || "Failed to send code", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl">
        
         <AuthSideBanner />

         <div className="w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
              <p className="text-gray-600">No worries, we'll send you a reset code</p>
            </div>

            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-green-600 text-white ring-4 ring-green-100">
                  <FaEnvelope className="text-xs" />
                </div>
                <div className="w-16 h-0.5 mx-2 bg-gray-200"></div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-gray-100 text-gray-400">
                  <FaKey className="text-xs" />
                </div>
                <div className="w-16 h-0.5 mx-2 bg-gray-200"></div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-gray-100 text-gray-400">
                  <FaLock className="text-xs" />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</Label>
                <div className="relative">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        id="email"
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    )}
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-lg">
                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : "Send Reset Code"}
              </Button>

              <div className="text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                  <FaArrowLeft className="text-xs" /> Back to Sign In
                </Link>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}