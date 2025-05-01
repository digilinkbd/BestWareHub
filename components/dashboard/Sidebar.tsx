"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Plus,
  Palette,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "../global/Logo";
import { ISidebarLink, sidebarLinks } from "@/config/sidebar";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { NotificationMenu } from "../NotificationMenu";
import { UserDropdownMenu } from "../UserDropdownMenu";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  session: Session;
  notifications?: Notification[];
}

export default function Sidebar({ session, notifications = [] }: SidebarProps) {
  const router = useRouter();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const user = session.user;
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);
  
  // Helper function to check if user has permission
  const hasPermission = (permission: string): boolean => {
    return user.permissions?.includes(permission) ?? false;
  };

  // Filter sidebar links based on permissions
  const filterSidebarLinks = (links: ISidebarLink[]): ISidebarLink[] => {
    return links
      .filter((link) => hasPermission(link.permission))
      .map((link) => ({
        ...link,
        dropdownMenu: link.dropdownMenu?.filter((item) =>
          hasPermission(item.permission)
        ),
      }))
      .filter(
        (link) =>
          !link.dropdown || (link.dropdownMenu && link.dropdownMenu.length > 0)
      );
  };

  const filteredLinks = filterSidebarLinks(sidebarLinks);

  async function handleLogout() {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [pathname]);

  // Animation variants
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="fixed top-0 left-0 h-full w-[220px] lg:w-[280px] border-r border-blue-100 bg-white hidden md:block shadow-md"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="flex h-full max-h-screen flex-col">
        <motion.div 
          className="flex flex-shrink-0 mb-1 h-14 items-center justify-between px-4 lg:h-[60px] lg:px-6 bg-[#eab308]   text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Logo href="/dashboard" />
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <NotificationMenu notifications={notifications} />
          </motion.div>
        </motion.div>
        
        <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
          <div className="px-4">
            <nav className="grid items-start gap-1">
              {filteredLinks.map((item, i) => {
                const Icon = item.icon;
                const isHrefIncluded =
                  item.dropdownMenu &&
                  item.dropdownMenu.some((link) => link.href === pathname);

                const isOpen = openDropdownIndex === i;
                const isActive = pathname === item.href || isHrefIncluded;

                return (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    onHoverStart={() => setIsHovered(i)}
                    onHoverEnd={() => setIsHovered(null)}
                    ref={isActive ? activeItemRef : null}
                    className={cn(
                      "relative",
                      isActive && "activeItem"
                    )}
                  >
                    {item.dropdown ? (
                      <Collapsible open={isOpen}>
                        <CollapsibleTrigger
                          onClick={() => setOpenDropdownIndex(isOpen ? null : i)}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-blue-700 transition-all hover:bg-blue-50 w-full relative overflow-hidden",
                            isHrefIncluded && "bg-gradient-to-r from-blue-100 to-blue-50 font-medium"
                          )}
                        >
                          {isHrefIncluded && (
                            <motion.div 
                              className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400"
                              layoutId="activeIndicator"
                            />
                          )}
                          <motion.div
                            animate={{ rotate: isHovered === i ? 10 : 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className={cn(
                              "text-blue-500 text-sm" ,
                              isHrefIncluded && "text-blue-700"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </motion.div>
                        <span className=" text-sm">
                        {item.title}
                        </span>
                          <motion.div 
                            className="ml-auto"
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {isOpen ? (
                              <ChevronDown className="h-5 w-5 flex shrink-0 items-center justify-center text-blue-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 flex shrink-0 items-center justify-center text-blue-400" />
                            )}
                          </motion.div>
                        </CollapsibleTrigger>
                        <AnimatePresence>
                          {isOpen && (
                            <CollapsibleContent
                              asChild
                              forceMount
                            >
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="rounded-b-md mt-1 py-1 pl-7"
                              >
                                {item.dropdownMenu?.map((menuItem, j) => {
                                  const isMenuItemActive = pathname === menuItem.href;
                                  return (
                                    <motion.div
                                      key={j}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: j * 0.05 }}
                                      ref={isMenuItemActive ? activeItemRef : null}
                                    >
                                      <Link
                                        href={menuItem.href}
                                        className={cn(
                                          "flex items-center gap-3 rounded-md px-3 py-2 text-blue-600 transition-all hover:bg-blue-50 justify-between text-xs relative overflow-hidden",
                                          isMenuItemActive && "bg-blue-50/80 text-blue-700 font-medium"
                                        )}
                                      >
                                        {isMenuItemActive && (
                                          <motion.div 
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"
                                            layoutId="activeSubmenuIndicator"
                                          />
                                        )}
                                        <span className="text-sm">
                                        {menuItem.title}
                                        </span>
                                        <motion.span 
                                          className={cn(
                                            "ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50",
                                            isMenuItemActive && "bg-yellow-100"
                                          )}
                                          whileHover={{ scale: 1.2, backgroundColor: "#fef3c7" }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Plus className={cn(
                                            "w-3 h-3 text-blue-500",
                                            isMenuItemActive && "text-yellow-600"
                                          )} />
                                        </motion.span>
                                      </Link>
                                    </motion.div>
                                  );
                                })}
                              </motion.div>
                            </CollapsibleContent>
                          )}
                        </AnimatePresence>
                      </Collapsible>
                    ) : (
                      <motion.div
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link
                          href={item.href ?? "#"}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-blue-700 transition-all hover:bg-blue-50 relative overflow-hidden text-sm",
                            pathname === item.href && "bg-gradient-to-r from-blue-100 to-blue-50 font-medium"
                          )}
                        >
                          {pathname === item.href && (
                            <motion.div 
                              className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400"
                              layoutId="activeIndicator"
                            />
                          )}
                          <motion.div
                            animate={{ rotate: isHovered === i ? 10 : 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className={cn(
                              "text-blue-500",
                              pathname === item.href && "text-blue-700"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </motion.div>
                          <span className="text-sm ">
                          {item.title}
                          </span>
                          
                          {(isHovered === i || pathname === item.href) && (
                            <motion.div 
                              className="ml-auto"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                            >
                              <ChevronRight className={cn(
                                "h-4 w-4 text-blue-400",
                                pathname === item.href && "text-yellow-500"
                              )} />
                            </motion.div>
                          )}
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
              
              <motion.div
                variants={itemVariants}
                className="mt-3"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-blue-700 transition-all hover:bg-blue-50 border border-dashed border-blue-200 mb-2"
                  target="_blank"
                >
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-blue-500"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </motion.div>
                  Live Website
                </Link>
              </motion.div>
            </nav>
          </div>
        </ScrollArea>

        <motion.div 
          className="p-4 border-t border-blue-100 bg-gradient-to-b from-white to-blue-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <UserDropdownMenu
            username={session?.user?.name ?? ""}
            email={session?.user?.email ?? ""}
            avatarUrl={
              session?.user?.image ??
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(54)-NX3G1KANQ2p4Gupgnvn94OQKsGYzyU.png"
            }
          />
          
          <motion.div 
            className="mt-4 py-2 px-3 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-md flex items-center justify-between text-xs border border-blue-100/50 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 text-blue-600">
              <Palette className="h-3 w-3 text-yellow-500" />
              <span>BestWareHub</span>
            </div>
            <span className="text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded-sm text-[10px] font-medium">Active</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}