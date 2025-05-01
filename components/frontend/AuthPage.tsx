"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/Forms/LoginForm"
import RegisterForm from "@/components/Forms/RegisterForm"
import VerificationForm from "@/components/Forms/VerificationForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type AuthView = "login" | "register" | "verification"

interface AuthPageProps {
  returnUrl?: string;
  vendorParam?: string;
  approvalTokenParam?: string;
  pageParam?: string;
  statusParam?: string;
  searchParam?: string;
}

export default function AuthPage({
  returnUrl = "/dashboard",
  vendorParam = "",
  approvalTokenParam = "",

}: AuthPageProps) {
  const [currentView, setCurrentView] = useState<AuthView>("login")
  const [email, setEmail] = useState<string>("")
  const router = useRouter()

  const handleSwitchView = (view: AuthView) => {
    setCurrentView(view)
  }

  const handleSetEmail = (email: string) => {
    setEmail(email)
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Header */}
      <header className="w-full py-0 px-6 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center pt-2">
          {/* <Logo /> */}
          <Button variant="outline" asChild size="sm" > 
            <Link href="/">
              <Home/>
            </Link>
          </Button>
          <div className="flex items-center space-x-6">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-1 text-gray-700 hover:text-yellow-600 transition-colors font-bold mt-2"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden md:py-0 py-8">
        {/* Auth Container with improved visual design */}
        <div className="z-10 w-full max-w-lg md:px-4 px-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg md:p-8 p-3"
          >
            <AnimatePresence mode="wait">
              {currentView === "login" && (
                <LoginForm 
                  onSwitchToRegister={() => handleSwitchView("register")} 
                  returnUrl={returnUrl}
                  vendorParam={vendorParam}
                  approvalTokenParam={approvalTokenParam}
                />
              )}

              {currentView === "register" && (
                <RegisterForm
                  onSwitchToLogin={() => handleSwitchView("login")}
                  onSwitchToVerification={() => handleSwitchView("verification")}
                  onSetEmail={handleSetEmail}
                />
              )}

              {currentView === "verification" && (
                <VerificationForm email={email} onSwitchToLogin={() => handleSwitchView("login")} />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}