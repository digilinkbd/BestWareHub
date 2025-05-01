"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { User, Mail, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { registerUser } from "@/actions/auth"
import { signIn } from "next-auth/react"

interface UserProps {
  name: string
  email: string
  password: string
  image?: string
}

interface RegisterFormProps {
  onSwitchToLogin: () => void
  onSwitchToVerification: () => void
  onSetEmail: (email: string) => void
}

export default function RegisterForm({ onSwitchToLogin, onSwitchToVerification, onSetEmail }: RegisterFormProps) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailErr, setEmailErr] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserProps>()

  const emailValue = watch("email")

  async function onSubmit(data: UserProps) {
    setLoading(true)
    setEmailErr(null)
    
    // Add default profile image
    data.image = "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png"

    try {
      const result = await registerUser(data);
      
      if (result.status === 409) {
        setLoading(false);
        // setEmailErr(result);
        toast.error("Email already exists");
      } else if (result.status === 200) {
        setLoading(false);
        toast.success("Account created successfully");
        if (emailValue) {
          onSetEmail(emailValue);
          onSwitchToVerification();
        }
      } else {
        setLoading(false);
        toast.error("Something went wrong");
      }
    } catch (error) {
      setLoading(false)
      console.error("Network Error:", error)
      toast.error("It seems something is wrong, try again")
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:gap-5 gap-6"
    >
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">Create an Account On BestWareHub</h1>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-yellow-500 hover:text-yellow-700 underline underline-offset-4"
          >
            Sign in
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-base">
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="John Doe"
                className={cn(
                  "h-12 px-4 text-base border-1 shadow-sm focus:ring-2 focus:ring-yellow-200",
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-yellow-500",
                )}
                {...register("name", { required: "Full name is required" })}
              />
              <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.name.message}
              </motion.p>
            )}
          </div>

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
                  errors.email || emailErr
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-yellow-500",
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
            {emailErr && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {emailErr}
              </motion.p>
            )}
          </div>

          {/* <div className="grid gap-2">
            <Label htmlFor="phone" className="text-base">
              Phone
            </Label>
            <div className="relative">
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                className={cn(
                  "h-12 px-4 text-base border-1 shadow-sm focus:ring-2 focus:ring-yellow-200",
                  errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-yellow-500",
                )}
                {...register("phone", { required: "Phone number is required" })}
              />
              <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.phone.message}
              </motion.p>
            )}
          </div> */}

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-base">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className={cn(
                  "h-12 px-4 text-base border-1 shadow-sm focus:ring-2 focus:ring-yellow-200",
                  errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-yellow-500",
                )}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
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
            "Create Account"
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
        Sign up with Google
      </Button>

      <div className="text-balance text-center text-xs text-gray-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-yellow-600">
        By creating an account, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.
      </div>
    </motion.div>
  )
}