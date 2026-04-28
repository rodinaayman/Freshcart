"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  FaTruck, FaShieldAlt, FaClock, FaLock, FaUsers, FaStar, FaEye, FaEyeSlash, FaEnvelope, FaGoogle, FaFacebookF
} from "react-icons/fa";

import { loginSchema, LoginSchemaType } from "@/schema/login.schema";

import loginImage from "@/assets/images/login.png";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, formState: { errors } } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
           toast.error("Login Failed", {
          description: "Incorrect email or password. Please try again.",
        });
      } else {
           toast.success("Login Successful!", {
          description: "Redirecting to homepage...",
        });
        
           setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl">

        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <div className="relative w-full h-96 rounded-2xl shadow-lg overflow-hidden">
              <Image
                src={loginImage}
                alt="Fresh vegetables and fruits"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                FreshCart - Your One-Stop Shop for Fresh Products
              </h2>
              <p className="text-lg text-gray-600">
                Join thousands of happy customers who trust FreshCart for their daily grocery needs
              </p>

              <div className="flex items-center justify-center space-x-8 text-base text-gray-500">
                <div className="flex items-center">
                  <FaTruck className="text-green-600 mr-2 h-5 w-5" /> Free Delivery
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="text-green-600 mr-2 h-5 w-5" /> Secure Payment
                </div>
                <div className="flex items-center">
                  <FaClock className="text-green-600 mr-2 h-5 w-5" /> 24/7 Support
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">

            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-green-600">
                  Fresh<span className="text-gray-800">Cart</span>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
              <p className="text-gray-600 text-lg">Sign in to continue your fresh shopping experience</p>
            </div>

            <div className="space-y-3 mb-6">
              <Button type="button" variant="outline" className="w-full py-6 text-lg border-2 hover:border-green-300 hover:bg-green-50 transition-all">
                <FaGoogle className="mr-2 h-5 w-5 text-red-500" />
                Continue with Google
              </Button>

              <Button type="button" variant="outline" className="w-full py-6 text-lg border-2 hover:border-green-300 hover:bg-green-50 transition-all">
                <FaFacebookF className="mr-2 h-5 w-5 text-blue-600" />
                Continue with Facebook
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR CONTINUE WITH EMAIL</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold text-gray-700">Email Address</Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 h-14 text-lg border-2 rounded-xl focus-visible:ring-green-500"
                      />
                    )}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-base font-semibold text-gray-700">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-12 pr-12 h-14 text-lg border-2 rounded-xl focus-visible:ring-green-500"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 h-5 w-5"
                    />
                  )}
                />
                <Label htmlFor="rememberMe" className="text-base text-gray-700 font-normal cursor-pointer">
                  Keep me signed in
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 h-14 rounded-xl font-semibold text-xl shadow-lg hover:shadow-xl transition-all text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-600 text-base">
                New to FreshCart?
                <Link href="/signup" className="text-green-600 hover:text-green-700 ms-2 font-semibold">
                  Create an account
                </Link>
              </p>
            </div>

            <div className="flex items-center justify-center space-x-6 mt-6 text-xs text-gray-500">
              <div className="flex items-center"><FaLock className="mr-1 h-3 w-3" /> SSL Secured</div>
              <div className="flex items-center"><FaUsers className="mr-1 h-3 w-3" /> 50K+ Users</div>
              <div className="flex items-center"><FaStar className="mr-1 h-3 w-3" /> 4.9 Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}