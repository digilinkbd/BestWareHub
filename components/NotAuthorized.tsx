// components/NotAuthorized.tsx
import Link from "next/link";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      {/* Yellow gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-70"></div>
      
      {/* Content with frame */}
      <div className="relative z-10 max-w-md w-full">
        <div className="p-8 bg-white rounded-lg shadow-lg border-2 border-yellow-400">
          {/* Yellow decorative frame corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-500 -translate-x-1 -translate-y-1"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-500 translate-x-1 -translate-y-1"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-500 -translate-x-1 translate-y-1"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-500 translate-x-1 translate-y-1"></div>
          
          <div className="text-center">
            <div className="flex justify-center">
              <div className="relative">
                <Shield className="w-16 h-16 mx-auto mb-4 text-yellow-600 opacity-30" />
                <AlertTriangle className="w-8 h-8 absolute top-4 left-4 text-yellow-600" />
              </div>
            </div>
            
            <h1 className="text-3xl text-yellow-700 font-bold tracking-tight mb-3">
              Not Authorized
            </h1>
            
            <div className="h-1 w-16 bg-yellow-400 mx-auto mb-4"></div>
            
            <p className="text-gray-600 mb-6">
              You don&apos;t have permission to access this page.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                asChild 
                className="bg-yellow-500 hover:bg-yellow-600 text-white border-none"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline"
                className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              >
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}