"use client";

import { useSession } from "next-auth/react";

export function usePermission() {
  const { data: session } = useSession();

  const hasPermission = (permission: string): boolean => {
    if (!session?.user?.permissions) return false;
    return session.user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    const userPermissions = session?.user?.permissions ?? [];
    return permissions.some(permission => userPermissions.includes(permission));
  };
  
  const hasAllPermissions = (permissions: string[]): boolean => {
    const userPermissions = session?.user?.permissions ?? [];
    return permissions.every(permission => userPermissions.includes(permission));
  };
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
