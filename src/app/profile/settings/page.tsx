"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { updateUserData, changeUserPassword } from "@/services/user.service";
import { updateProfileSchema, changePasswordSchema, UpdateProfileSchemaType, ChangePasswordSchemaType } from "@/schema/profile.schema";

export default function SettingsPage() {
  const { data: session, update } = useSession(); 
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, re: false });

  const profileForm = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
    },
    values: { 
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "", 
    }
  });

  const passwordForm = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    }
  });

  const onProfileSubmit = async (data: UpdateProfileSchemaType) => {
    if (!session?.accessToken) return;
    setLoadingProfile(true);
    try {
      const res = await updateUserData(session.accessToken, data);
      if (res.message === "success") {
        Swal.fire("Success!", "Profile updated successfully.", "success");
        update({ name: data.name, email: data.email });
      } else {
        Swal.fire("Error", res.message || "Failed to update", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoadingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordSchemaType) => {
    if (!session?.accessToken) return;
    setLoadingPassword(true);
    try {
      const res = await changeUserPassword(session.accessToken, data);
      if (res.message === "success") {
        Swal.fire("Success!", "Password changed successfully.", "success");
        passwordForm.reset();
      } else {
        Swal.fire("Error", res.message || "Failed to change password", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Update your profile information and change your password</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <FaUser className="text-2xl text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Profile Information</h3>
              <p className="text-sm text-gray-500">Update your personal details</p>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Full Name</Label>
              <Input {...profileForm.register("name")} placeholder="Enter your name" className="w-full px-4 py-3 rounded-xl" />
              {profileForm.formState.errors.name && <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.name.message}</p>}
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Email Address</Label>
              <Input {...profileForm.register("email")} type="email" placeholder="Enter your email" className="w-full px-4 py-3 rounded-xl" />
              {profileForm.formState.errors.email && <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.email.message}</p>}
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</Label>
              <Input {...profileForm.register("phone")} type="tel" placeholder="01xxxxxxxxx" className="w-full px-4 py-3 rounded-xl" />
            </div>
            <div className="pt-4">
              <Button type="submit" disabled={loadingProfile} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg">
                {loadingProfile ? <FaSpinner className="animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <FaLock className="text-2xl text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>

          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Current Password</Label>
              <div className="relative">
                <Input type={showPass.current ? "text" : "password"} {...passwordForm.register("currentPassword")} placeholder="Enter current password" className="w-full px-4 py-3 pr-12 rounded-xl" />
                <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">New Password</Label>
              <div className="relative">
                <Input type={showPass.new ? "text" : "password"} {...passwordForm.register("password")} placeholder="Enter new password" className="w-full px-4 py-3 pr-12 rounded-xl" />
                 <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</Label>
              <div className="relative">
                <Input type={showPass.re ? "text" : "password"} {...passwordForm.register("rePassword")} placeholder="Confirm new password" className="w-full px-4 py-3 pr-12 rounded-xl" />
                <button type="button" onClick={() => setShowPass({...showPass, re: !showPass.re})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.re ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordForm.formState.errors.rePassword && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.rePassword.message}</p>}
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loadingPassword} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors shadow-lg">
                 {loadingPassword ? <FaSpinner className="animate-spin" /> : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}