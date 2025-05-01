"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, Bell, Search, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Session } from "next-auth";
import Logo from "../global/Logo";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { sidebarLinks } from "@/config/sidebar";
import { usePermission } from "@/hooks/usePermissions";
import { UserDropdownMenu } from "../UserDropdownMenu";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import MobileVendorStatus from "../frontend/MobileVendorStatus";
import { ScrollArea } from "../ui/scroll-area";

export default function Navbar({ session, notifications = [] }: { session: Session, notifications?: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission } = usePermission();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter sidebar links based on user permissions
  const filteredLinks = sidebarLinks.filter((link) => {
    // Check main link permission
    if (!hasPermission(link.permission)) {
      return false;
    }

    // If it's a dropdown, check if user has permission for any dropdown item
    if (link.dropdown && link.dropdownMenu) {
      return link.dropdownMenu.some((item) => hasPermission(item.permission));
    }

    return true;
  });

  // Flatten dropdown menus for mobile view
  const mobileLinks = filteredLinks.reduce(
    (acc, link) => {
      // Add main link if it's not a dropdown
      if (!link.dropdown) {
        acc.push({
          title: link.title,
          href: link.href || "#",
          icon: link.icon,
          permission: link.permission,
        });
        return acc;
      }

      // Add dropdown items if user has permission
      if (link.dropdownMenu) {
        link.dropdownMenu.forEach((item) => {
          if (hasPermission(item.permission)) {
            acc.push({
              title: item.title,
              href: item.href,
              icon: link.icon,
              permission: item.permission,
            });
          }
        });
      }

      return acc;
    },
    [] as Array<{ title: string; href: string; icon: any; permission: string }>
  );

  async function handleLogout() {
    try {
      await signOut();
      router.push("/auth");
    } catch (error) {
      console.log(error);
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const searchVariants = {
    closed: { width: "40px", opacity: 0.9 },
    open: { width: "240px", opacity: 1 }
  };

  return (
    <motion.header 
      className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-blue-100 bg-white text-black px-4 lg:h-[60px] lg:px-6 shadow-md"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <Sheet>
        <SheetTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="shrink-0 md:hidden text-black hover:bg-blue-600/40">
              <Menu className="h-7 w-7" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </motion.div>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col border-r border-blue-100 bg-white p-0 overflow-hidden">
          <div className="flex flex-shrink-0 h-16 items-center justify-between px-4 bg-[#eab308]  text-white">
            <Logo href="/dashboard" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="bg-blue-400/30 p-1.5 rounded-full"
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
          </div>
          
          <ScrollArea className="flex-1">
            <nav className="grid gap-2 text-md font-medium p-4">
              {/* Render mobile navigation links */}
              {mobileLinks.map((item, i) => {
                const Icon = item.icon;
                const isActive = item.href === pathname;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 3 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-blue-700 transition-all hover:bg-blue-50 relative overflow-hidden",
                        isActive && "bg-[#eab308] font-medium"
                      )}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="mobileActiveIndicator"
                          className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#eab308]"
                        />
                      )}
                      <Icon className={cn("h-4 w-4", isActive ? "text-blue-700" : "text-blue-500")} />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </ScrollArea>

          <motion.div 
            className="mt-auto p-4 border-t border-blue-100 bg-gradient-to-b from-white to-blue-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button onClick={handleLogout} variant="outline" size="sm" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
              Logout
            </Button>
            
            <motion.div 
              className="mt-4 py-2 px-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md flex items-center justify-between text-xs border border-blue-100/50 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 text-blue-600">
                <Palette className="h-3 w-3 text-purple-500" />
                <span>Blue & purple</span>
              </div>
              <span className="text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-sm text-[10px] font-medium">Active</span>
            </motion.div>
          </motion.div>
        </SheetContent>
      </Sheet>

     <MobileVendorStatus session={session}/>

      <div className="flex-1"></div>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="mr-2"
            >
              <Input 
                placeholder="Search..." 
                className="h-8 bg-black-600 text-black placeholder:text-black border-blue-500/30 focus-visible:ring-yellow-400 focus-visible:ring-offset-yellow-600"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center"
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-[#eab308] backdrop-blur-sm text-black hover:bg-blue-500/40"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </motion.div>
        <motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="flex items-center"
>
  <Link href="/dashboard/notifications">
    <motion.div 
      className={cn(
        "relative rounded-full bg-[#eab308] backdrop-blur-sm p-2 text-black hover:bg-blue-500/40 cursor-pointer",
        notifications.length > 0 && "ring-2 ring-blue-400"
      )}
      whileHover={{ 
        boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)" 
      }}
    >
      <Bell className="h-4 w-4" />
      
      {/* Notification count badge */}
      {notifications.length > 0 && (
        <motion.span 
          className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-bold text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 10 
          }}
        >
          {notifications.length}
        </motion.span>
      )}
      
      {/* Pulse effect when notifications are available */}
      {notifications.length > 0 && (
        <motion.span
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ 
            opacity: 0,
            scale: 1.6,
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeOut"
          }}
          style={{
            background: "linear-gradient(rgba(37, 99, 235, 0.5), rgba(37, 99, 235, 0.1))",
            zIndex: -1
          }}
        />
      )}
    </motion.div>
  </Link>
</motion.div>

        <motion.div 
          className="flex items-center"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <div className=" p-1 rounded-md">
            <UserDropdownMenu
              username={session?.user?.name ?? ""}
              email={session?.user?.email ?? ""}
              avatarUrl={
                session?.user?.image ??
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(54)-NX3G1KANQ2p4Gupgnvn94OQKsGYzyU.png"
              }
            />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}