"use client";

import { credentialLogin } from "@/app/actions/auth/login.action";
import { registerUser } from "@/app/actions/auth/register.action";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/validators/register-schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data);
      if (res?.error) {
        toast.error(res.error?.message || "Registration failed");
        return;
      }

      const loginRes = await credentialLogin({
        email: data.email,
        password: data.password,
      });

      if (loginRes?.success) {
        toast.success(`Hi ${data.firstName}, Welcome to Edu-Nest! 🎉`);
        reset();
        router.push(res?.redirectTo || "/");
      } else {
        toast.error(loginRes.error || "Login failed. Please try again.");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* First/Last Name */}
      <div className="flex justify-between gap-4">
        <div className="w-full">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword")}
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-muted-foreground"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      {/* Educator Checkbox */}
      <div className="flex items-center space-x-2 pt-1">
        <Controller
          name="isEducator"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Checkbox
              id="isEducator"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="isEducator" className="text-sm">
          I want to become an educator
        </Label>
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start space-x-2 pt-1">
        <Controller
          name="acceptTerms"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Checkbox
              id="acceptTerms"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Label htmlFor="acceptTerms" className="text-sm leading-snug">
          I agree to the{" "}
          <Link href="#" className="text-primary underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary underline">
            Privacy Policy
          </Link>
        </Label>
      </div>
      {errors.acceptTerms && (
        <p className="text-sm text-red-500 mt-1">
          {errors.acceptTerms.message}
        </p>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full mt-2.5" disabled={isSubmitting}>
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
