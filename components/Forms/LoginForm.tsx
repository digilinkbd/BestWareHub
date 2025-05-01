"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { updateVendorStatus } from "@/actions/auth";

interface LoginProps {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

interface LoginFormProps {
  onSwitchToRegister: () => void;
  returnUrl?: string;
  vendorParam?: string;
  approvalTokenParam?: string;
}

export default function LoginForm({ onSwitchToRegister, returnUrl = "/dashboard", vendorParam, approvalTokenParam }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isVendorLogin, setIsVendorLogin] = useState(!!vendorParam);
  const [approvalToken, setApprovalToken] = useState<string | null>(approvalTokenParam || null);
  console.log(approvalToken , "thsii")
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginProps>();

  const router = useRouter();


  useEffect(() => {
    if (vendorParam === "approve" && approvalTokenParam) {
      setIsVendorLogin(true);
      setApprovalToken(approvalTokenParam);
    }
  }, [vendorParam, approvalTokenParam]);

  async function onSubmit(data: LoginProps) {
    try {
      setLoading(true);
      setPasswordError(false);

      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (loginData?.error) {
        setLoading(false);
        toast.error("Sign-in error: Check your credentials");
        setPasswordError(true);
        setTimeout(() => setPasswordError(false), 500);
      } else {
        reset();
        
        // If this is a vendor approval login, update the status
        if (isVendorLogin && approvalToken) {
          toast.loading("Activating your vendor account...", { id: "vendor-activation" });
          
          const response = await updateVendorStatus(approvalToken);
          
          if (response?.success) {
            toast.success("Vendor account activated successfully Login!", { id: "vendor-activation" });
            await signIn("credentials", {
              ...data,
              redirect: false,
            });
            
            setLoading(false);
            router.push("/dashboard");
          } else {
            toast.error(response?.message || "Vendor approval failed.", { id: "vendor-activation" });
            setLoading(false);
            router.push("/dashboard");
          }
        } else {
          toast.success("Login Successful");
          setLoading(false);
          router.push(`${returnUrl}`);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Network error. Please try again.");
    }
  }

  const handleGoogleSignIn = () => {
    if (isVendorLogin) {
      toast.error("Please use email login to activate your vendor account");
      return;
    }
    signIn("google", { callbackUrl: returnUrl });
  }


  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:gap-6 gap-6"
    >
       <div className="flex flex-col items-center gap-2">
        {isVendorLogin ? (
          <>
            <div className="flex items-center gap-2 text-yellow-600 mb-2">
              <Store className="h-6 w-6" />
              <span className="text-sm font-medium px-2 py-1 bg-yellow-100 rounded-full">Vendor Activation</span>
            </div>
            <h1 className="text-2xl font-bold">Activate Your Vendor Account</h1>
            <p className="text-center text-sm text-gray-600 max-w-sm">
              Please log in with your credentials to complete the vendor activation process and start selling on Kartify.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Welcome to Kartify</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={onSwitchToRegister}
                className="text-yellow-500 hover:text-yellow-700 underline underline-offset-4"
              >
                Sign up
              </button>
            </div>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className={cn(
                  "h-12 px-4 text-base border-1 shadow-sm focus:ring-2 focus:ring-yellow-200",
                  errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-yellow-500",
                )}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <button type="button" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                Forgot password?
              </button>
            </div>
            <motion.div
              animate={passwordError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={cn(
                  "h-12 px-4 text-base border-1 shadow-sm focus:ring-2 focus:ring-yellow-200",
                  errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-yellow-500",
                )}
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </motion.div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <Label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          {loading ? (
            <div className="flex space-x-2 items-center justify-center">
              <motion.div
                className="h-2 w-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              />
              <motion.div
                className="h-2 w-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
              />
              <motion.div
                className="h-2 w-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
              />
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200">
        <span className="relative z-10 bg-white px-2 text-gray-500">Or continue with</span>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        className="w-full h-12 text-base font-medium border-2 border-gray-200 hover:bg-gray-50 text-gray-700"
      >
        <img src="https://cdn-icons-png.flaticon.com/128/2702/2702602.png" alt="" className="w-4 h-4 mr-2" />
        Sign in with Google
      </Button>

      <div className="text-balance text-center text-xs text-gray-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-yellow-600">
        By signing in, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.
      </div>
    </motion.div>
  )
}

