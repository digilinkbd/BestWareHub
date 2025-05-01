"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
  ChevronDown,
  ChevronsUpDown,
  Home,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  username: string;
  email: string;
  avatarUrl?: string;
}

export function UserDropdownMenu({
  username,
  email,
  avatarUrl,
}: UserDropdownProps) {
  const router = useRouter();
  async function handleLogout() {
    try {
      await signOut();
      router.push("/auth");
    } catch (error) {
      console.log(error);
    }
  }

 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-full justify-start gap-2 px-4"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{username}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
      
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
        <Link href="/">
        <DropdownMenuItem>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </DropdownMenuItem>
        </Link>
      
        <Link href="/dashboard/orders">
        <DropdownMenuItem>
          
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Orders</span>
        </DropdownMenuItem>
            </Link>
      
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
