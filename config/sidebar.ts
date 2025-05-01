// config/sidebar.ts
import {
  BaggageClaim,
  BarChart2,
  BarChart4,
  Bell,
  Book,
  Cable,
  CircleDollarSign,
  FolderTree,
  Home,
  KeyRound,
  List,
  LucideIcon,
  Presentation,
  RollerCoaster,
  Settings,
  ShoppingBasket,
  ShoppingCartIcon,
  Store,
  User,
  UserPlus,
  Users,
} from "lucide-react";

export interface ISidebarLink {
  title: string;
  href?: string;
  icon: LucideIcon;
  dropdown: boolean;
  permission: string; // Required permission to view this item
  dropdownMenu?: MenuItem[];
}

type MenuItem = {
  title: string;
  href: string;
  permission: string; // Required permission to view this menu item
};

export const sidebarLinks: ISidebarLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    dropdown: false,
    permission: "dashboard.read",
  },
  {
    title: "Catalog",
    icon: BaggageClaim,
    href: "/dashboard/departments",
    dropdown: true,
    permission: "users.read",
    dropdownMenu: [
      {
        title: "Departments",
        href: "/dashboard/departments",
        permission: "users.read",
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        permission: "categories.read",
      },
      {
        title: "Sub-Categories",
        href: "/dashboard/sub-categories",
        permission: "categories.read",
      },
      {
        title: "Brands",
        href: "/dashboard/brands",
        permission: "roles.read",
      },
      {
        title: "Products",
        href: "/dashboard/products",
        permission: "roles.read",
      },
    ],
  },
  {
    title: "Users",
    icon: Users,
    href: "/dashboard/users",
    dropdown: true,
    permission: "users.read",
    dropdownMenu: [
      {
        title: "Users",
        href: "/dashboard/users",
        permission: "users.read",
      },
    
    ],
  },
  {
    title: "Vendor Management",
    icon: User,
    href: "/dashboard/vendor-applications",
    dropdown: true,
    permission: "users.read",
    dropdownMenu: [
   
      {
        title: "Vendors",
        href: "/dashboard/vendors", 
        permission: "vendors.read",
      },
      {
        title: "Vendor Applicationss",
        href: "/dashboard/vendor-applications", 
        permission: "vendor-applications.read",
      },
    ],
  },
  {
    title: "Inventory",
    icon: BaggageClaim,
    dropdown: true,
    href: "/dashboard/products",
    permission: "inventory.read",
    dropdownMenu: [
      {
        title: "Products",
        href: "/dashboard/products",
        permission: "inventory.read",
      },
    ],
  },
  {
    title: "Sales",
    icon: CircleDollarSign,
    dropdown: true,
    href: "/dashboard/sales",
    permission: "sales.read",
    dropdownMenu: [
      {
        title: "Sales",
        href: "/dashboard/sales",
        permission: "sales.read",
      },
      {
        title: "Customers",
        href: "/dashboard/sales/customers",
        permission: "customers.read",
      },
    ],
  },
  // {
  //   title: "Blogs",
  //   icon: Book,
  //   dropdown: false,
  //   href: "/dashboard/blogs",
  //   permission: "blogs.read",
  // },
  {
    title: "Campaigns",
    icon: Store,
    dropdown: false,
    href: "/dashboard/marketing",
    permission: "marketing.read",
  },
  {
    title: "Product Approvals",
    icon: ShoppingBasket,
    dropdown: false,
    href: "/dashboard/product-approvals",
    permission: "product-approvals.read",
  },
  {
    title: "Change password",
    href: "/dashboard/change-password",
    icon: KeyRound,
    dropdown: false,
    permission: "change-password.read",
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCartIcon,
    dropdown: false,
    permission: "orders.read",
  },
  {
    title: "Reports",
    icon: BarChart4,
    dropdown: true,
    href: "/dashboard/reports/products",
    permission: "reports.read",
    dropdownMenu: [
      {
        title: "Product Report",
        href: "/dashboard/reports/product",
        permission: "reports.read",
      },
      {
        title: "Inventory Report",
        href: "/dashboard/reports/inventory",
        permission: "reports.read",
      },
      // {
      //   title: "Customers Report",
      //   href: "/dashboard/reports/customers",
      //   permission: "reports.read",
      // },
    ],
  },
  {
    title: "Roles",
    href: "/dashboard/users/roles",
    icon: RollerCoaster,
    dropdown: false,
    permission: "roles.read",
  },

  {
    title: "WishList",
    href: "/wishlist",
    permission: "wishlist.read",
    icon: List,
    dropdown: false,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    dropdown: false,
    permission: "notifications.read",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    permission: "roles.read",
    icon: KeyRound,
    dropdown: false,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    dropdown: false,
    permission: "settings.read",
  }
 
];
