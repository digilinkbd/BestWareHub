// permissions.ts

export type Permission = {
  create: string;
  read: string;
  update: string;
  delete: string;
};

export type ModulePermissions = {
  display: string;
  name: string;
  permissions: Permission;
};

export const permissions: ModulePermissions[] = [
  {
    display: "Dashboard",
    name: "dashboard",
    permissions: {
      create: "dashboard.create",
      read: "dashboard.read",
      update: "dashboard.update",
      delete: "dashboard.delete",
    },
  },
  {
    display: "Users",
    name: "users",
    permissions: {
      create: "users.create",
      read: "users.read",
      update: "users.update",
      delete: "users.delete",
    },
  },
  {
    display: "Users",
    name: "users",
    permissions: {
      create: "users.create",
      read: "users.read",
      update: "users.update",
      delete: "users.delete",
    },
  },

  {
    display: "Roles",
    name: "roles",
    permissions: {
      create: "roles.create",
      read: "roles.read",
      update: "roles.update",
      delete: "roles.delete",
    },
  },
  {
    display: "Sales",
    name: "sales",
    permissions: {
      create: "sales.create",
      read: "sales.read",
      update: "sales.update",
      delete: "sales.delete",
    },
  },
  {
    display: "Customers",
    name: "customers",
    permissions: {
      create: "customers.create",
      read: "customers.read",
      update: "customers.update",
      delete: "customers.delete",
    },
  },
  {
    display: "Orders",
    name: "orders",
    permissions: {
      create: "orders.create",
      read: "orders.read",
      update: "orders.update",
      delete: "orders.delete",
    },
  },
  {
    display: "Reports",
    name: "reports",
    permissions: {
      create: "reports.create",
      read: "reports.read",
      update: "reports.update",
      delete: "reports.delete",
    },
  },
  {
    display: "Settings",
    name: "settings",
    permissions: {
      create: "settings.create",
      read: "settings.read",
      update: "settings.update",
      delete: "settings.delete",
    },
  },
  {
    display: "Categories",
    name: "categories",
    permissions: {
      create: "categories.create",
      read: "categories.read",
      update: "categories.update",
      delete: "categories.delete",
    },
  },
  {
    display: "Products",
    name: "products",
    permissions: {
      create: "products.create",
      read: "products.read",
      update: "products.update",
      delete: "products.delete",
    },
  },
  {
    display: "Vendor Applicationss",
    name: "seller",
    permissions: {
      create: "seller.create",
      read: "seller.read",
      update: "seller.update",
      delete: "seller.delete",
    },
  },
  // {
  //   display: "Blogs",
  //   name: "blogs",
  //   permissions: {
  //     create: "blogs.create",
  //     read: "blogs.read",
  //     update: "blogs.update",
  //     delete: "blogs.delete",
  //   },
  // },
];
export const ROLES = {
  ADMIN: {
    displayName: "Administrator",
    roleName: "admin",
    description: "Administrator with full system access",
    permissions: [
      "dashboard.read",
      "dashboard.write",
      "users.read",
      "users.write",
      "campaign.update",
      "campaign.read",
      "roles.read",
      "roles.write",
      "profile.read",
      "profile.write",
      "orders.read",
      "orders.write",
      "blogs.read",
      "blogs.write",
      "vendor-applications.read",
      "vendors.read",
      "categories.read",
      "categories.write",
      "change-password.read",
      "change-password.write",
      "stores.read",
      "product-approvals.read",
      "stores.write",
    ],
  },
  VENDOR: {
    displayName: "Vendor",
    roleName: "vendor",
    description: "Vendor with store management capabilities",
    permissions: [
      "dashboard.read",
      "products.read",
      "products.write",
      "store.read",
      "store.write",
      "sales.read",
      "profile.read",
      "profile.update",
    ],
  },
  USER: {
    displayName: "User",
    roleName: "user",
    description: "Regular user with basic access",
    permissions: [
      "dashboard.read",
      "profile.read",
      "profile.update",
      "orders.read",
      "change-password.read",
      "change-password.write",
      "test.read",
    ],
  },
};

// Helper function to get all permission strings
export function getAllPermissions(): string[] {
  return permissions.flatMap((module) => Object.values(module.permissions));
}

// Helper function to check if a permission exists
export function isValidPermission(permission: string): boolean {
  return getAllPermissions().includes(permission);
}

// Helper to get module permissions by name
export function getModulePermissions(
  moduleName: string
): Permission | undefined {
  const module = permissions.find((m) => m.name === moduleName);
  return module?.permissions;
}

// Type for the permissions object
export type PermissionsType = {
  [K in (typeof permissions)[number]["name"]]: Permission;
};
