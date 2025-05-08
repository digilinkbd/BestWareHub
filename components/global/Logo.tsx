import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({
  variant = "light",
  size = "md",
  full = true,
  href = "/",
}: {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  href?: string;
}) {
  const imageSize = size === "lg" ? 64 : size === "md" ? 64 : 64;

  return (
    <Link href={href} className="flex items-center space-x-2">
      <div className={cn("rounded-full p-1", variant === "light" ? "bg-[#FFFFF]" : "bg-white")}>
        <Image
          src="/images/bestware_large.png"
          alt="BestWareHub Logo"
          width={imageSize}
          height={imageSize}
        />
      </div>
      {full && (
        <span
          className={cn(
            "font-black text-xl",
            size === "lg" && "text-4xl",
            variant === "light" ? "text-black" : "text-blue-800"
          )}
        >
          BESTWAREHUB
        </span>
      )}
    </Link>
  );
}
