"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { resetPassword } from "@/services/auth.service";
import { resetPasswordSchema, ResetPasswordSchemaType } from "@/schema/password.schema";
import AuthSideBanner from "@/components/auth/AuthSideBanner";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const router = useRouter();

  const { handleSubmit, control, formState: { errors } } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    const email = localStorage.getItem("resetEmail");
    
    if (!email) {
      Swal.fire("Error", "Email not found. Please start over.", "error");
      router.push("/forgot-password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({ email, newPassword: data.password });
      
      if (res.message === "success" || res.statusMsg === "success") {
        localStorage.removeItem("resetEmail"); 
        Swal.fire("Success!", "Password changed successfully.", "success").then(() => {
          router.push("/login");
        });
      } else {
        Swal.fire("Error", res.message || "Failed to reset password", "error");
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
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Set New Password</h1>
              <p className="text-gray-600">Your identity has been verified. Set a new secure password.</p>
            </div>

            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-green-600 text-white ring-4 ring-green-100">
                  <FaEnvelope className="text-xs" />
                </div>
                <div className="w-16 h-0.5 mx-2 bg-green-500"></div> 
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-green-600 text-white ring-4 ring-green-100">
                  <FaKey className="text-xs" />
                </div>
                <div className="w-16 h-0.5 mx-2 bg-green-500"></div> 
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-green-600 text-white ring-4 ring-green-100">
                  <FaLock className="text-xs" />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">New Password</Label>
                <div className="relative">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={showPass ? "text" : "password"}
                        placeholder="Enter new password"
                        className="h-12 pr-10 border-2 rounded-xl"
                      />
                    )}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</Label>
                <div className="relative">
                  <Controller
                    name="rePassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={showRePass ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="h-12 pr-10 border-2 rounded-xl"
                      />
                    )}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowRePass(!showRePass)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showRePass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.rePassword && <p className="text-red-500 text-sm mt-1">{errors.rePassword.message}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-semibold shadow-lg"
              >
                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : "Reset Password"}
              </Button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}