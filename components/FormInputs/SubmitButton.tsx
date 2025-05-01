import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

type SubmitButtonProps = {
  title: string;
  className?: string;
  buttonIcon?: any;
  loading: boolean;
  showIcon?: boolean;
};

export default function SubmitButton({
  title,
  loading,
  className,
  buttonIcon = Plus,
  showIcon = true,
}: SubmitButtonProps) {
  const ButtonIcon = buttonIcon;

  return (
    <button
      type={loading ? "button" : "submit"}
      disabled={loading}
      className={cn(
        "flex items-center justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 min-w-[140px] h-[40px]", 
        className
      )}
    >
      {loading ? (
        <div className="flex space-x-1">
          <motion.div
            className="h-2 w-2 bg-white rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
          />
          <motion.div
            className="h-2 w-2 bg-white rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
          />
          <motion.div
            className="h-2 w-2 bg-white rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
          />
        </div>
      ) : (
        <>
          {showIcon && <ButtonIcon className="w-4 h-4 mr-2" />}
          {title}
        </>
      )}
    </button>
  );
}
