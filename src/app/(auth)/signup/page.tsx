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
  FaStar, FaTruck, FaShieldAlt, FaLock, FaEye, FaEyeSlash, 
  FaEnvelope, FaGoogle, FaFacebookF, FaPhone, FaUser, FaUserPlus 
} from "react-icons/fa";

import { signupSchema, SignupSchemaType } from "@/schema/signup.schema";

import signupImg from '@/assets/images/review-author.png';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { handleSubmit, control, formState: { errors } } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });

  const onSubmit = async (data: SignupSchemaType) => {
    if (!agreeTerms) {
      toast.error("Agreement Required", {
        description: "You must agree to the terms and conditions.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Registration failed");

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.info("Registration Successful", {
          description: "Please login now.",
        });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.success("Welcome!", {
          description: "Account created successfully.",
        });
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      }

    } catch (error: any) {
      toast.error("Registration Failed", {
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl">
        
        <div className="hidden lg:block space-y-8">
          
          <div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Welcome to <span className="text-green-600">FreshCart</span>
            </h1>
            <p className="text-2xl mt-4 text-gray-600">
              Join thousands of happy customers who enjoy fresh groceries.
            </p>
          </div>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex justify-center items-center shrink-0 text-2xl">
                <FaStar />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Premium Quality</h2>
                <p className="text-lg text-gray-600">Premium products sourced from trusted suppliers.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex justify-center items-center shrink-0 text-2xl">
                <FaTruck />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Fast Delivery</h2>
                <p className="text-lg text-gray-600">Same-day delivery available in most areas.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex justify-center items-center shrink-0 text-2xl">
                <FaShieldAlt />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Secure Shopping</h2>
                <p className="text-lg text-gray-600">Your data and payments are completely secure.</p>
              </div>
            </li>
          </ul>

          <div className="bg-white shadow-lg p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <Image src={signupImg} alt="Author" width={50} height={50} className="rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Sarah Johnson</h3>
                <div className="flex text-yellow-400 text-lg">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="h-4 w-4" />)}
                </div>
              </div>
            </div>
            <p className="italic text-gray-600 text-lg">
              "FreshCart has transformed my shopping experience. Highly recommend!"
            </p>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-10 lg:p-14">
            
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Create Your Account</h2>
              <p className="text-gray-500 text-xl">Start your fresh journey with us today</p>
            </div>

            <div className="flex gap-4 mb-8">
              <Button type="button" variant="outline" className="flex-1 py-7 text-xl border-2 hover:bg-gray-50">
                <FaGoogle className="mr-2 h-6 w-6 text-red-500" /> Google
              </Button>
              <Button type="button" variant="outline" className="flex-1 py-7 text-xl border-2 hover:bg-gray-50">
                <FaFacebookF className="mr-2 h-6 w-6 text-blue-600" /> Facebook
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-lg">
                <span className="px-6 bg-white text-gray-500 font-medium">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-semibold text-gray-700">Name*</Label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <Controller name="name" control={control} render={({ field }) => (
                    <Input {...field} id="name" placeholder="Ali" className="pl-14 h-16 text-xl border-2 rounded-xl" />
                  )} />
                </div>
                {errors.name && <p className="text-red-500 text-base mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-semibold text-gray-700">Email*</Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <Controller name="email" control={control} render={({ field }) => (
                    <Input {...field} id="email" type="email" placeholder="ali@example.com" className="pl-14 h-16 text-xl border-2 rounded-xl" />
                  )} />
                </div>
                {errors.email && <p className="text-red-500 text-base mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg font-semibold text-gray-700">Password*</Label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <Controller name="password" control={control} render={({ field }) => (
                    <Input {...field} id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" className="pl-14 pr-14 h-16 text-xl border-2 rounded-xl" />
                  )} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <FaEyeSlash className="h-6 w-6" /> : <FaEye className="h-6 w-6" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-base mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rePassword" className="text-lg font-semibold text-gray-700">Confirm Password*</Label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <Controller name="rePassword" control={control} render={({ field }) => (
                    <Input {...field} id="rePassword" type={showRePassword ? "text" : "password"} placeholder="Confirm your password" className="pl-14 pr-14 h-16 text-xl border-2 rounded-xl" />
                  )} />
                  <button type="button" onClick={() => setShowRePassword(!showRePassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showRePassword ? <FaEyeSlash className="h-6 w-6" /> : <FaEye className="h-6 w-6" />}
                  </button>
                </div>
                {errors.rePassword && <p className="text-red-500 text-base mt-1">{errors.rePassword.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-lg font-semibold text-gray-700">Phone Number*</Label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <Controller name="phone" control={control} render={({ field }) => (
                    <Input {...field} id="phone" type="tel" placeholder="+1 234 567 8900" className="pl-14 h-16 text-xl border-2 rounded-xl" />
                  )} />
                </div>
                {errors.phone && <p className="text-red-500 text-base mt-1">{errors.phone.message}</p>}
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} className="data-[state=checked]:bg-green-600 h-6 w-6" />
                <Label htmlFor="terms" className="text-lg text-gray-700 font-normal cursor-pointer">
                  I agree to the <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</Link> *
                </Label>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-16 rounded-xl font-bold text-2xl shadow-lg text-white" disabled={isLoading}>
                <FaUserPlus className="mr-2 h-6 w-6" />
                {isLoading ? "Creating Account..." : "Create My Account"}
              </Button>
            </form>

            <p className="border-t pt-8 border-gray-100 mt-8 text-center text-xl">
              Already have an account? <Link href="/login" className="text-green-600 hover:underline font-bold">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}