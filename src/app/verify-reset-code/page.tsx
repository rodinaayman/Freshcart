"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaEnvelope, FaLock, FaKey, FaSpinner } from "react-icons/fa";
import { verifyResetCode } from "@/services/auth.service";
import AuthSideBanner from "@/components/auth/AuthSideBanner";

export default function VerifyResetCodePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { handleSubmit, control, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await verifyResetCode(data.resetCode);
      if (res.status === "Success") {
        Swal.fire("Success!", "Code verified.", "success").then(() => {
          router.push("/reset-password");
        });
      } else {
        Swal.fire("Error", res.message || "Invalid Code", "error");
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
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Code</h1>
              <p className="text-gray-600">Enter the code sent to your email.</p>
            </div>

                     <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-green-600 text-white ring-4 ring-green-100">
                  <FaEnvelope className="text-xs" />
                </div>
                <div className="w-16 h-0.5 mx-2 bg-green-500"></div> </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-green-600 text-white ring-4 ring-green-100">
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
              <Controller
                name="resetCode"
                control={control}
                rules={{ required: "Code is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Reset Code"
                    className="h-14 text-center text-xl tracking-widest border-2 rounded-xl"
                    maxLength={6}
                  />
                )}
              />
              {errors.resetCode && <p className="text-red-500 text-sm text-center">{errors.resetCode.message}</p>}

              <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg">
                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : "Verify"}
              </Button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}