import { db } from "./db";
import bcrypt from "bcryptjs";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'; // Add this if not already imported for generating unique slugs

// Base API URL
const API_BASE_URL = "https://kartify-multi-vendor-template-mu.vercel.app/api";

// API User Type
type ApiUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string | null;
  password: string | null;
  status: boolean;
  isVerified: boolean;
  verifyToken: string | null;
  tokenExpiry: string | null;
  role: "ADMIN" | "USER" | "SECRETARY" | "VENDOR";
  plan: string | null;
  jobTitle: string | null;
  balance: number;
  commission: number;
  vendorStatus: "PENDING" | "REJECTED" | "APPROVED" | "NORMAL";
  createdAt: string;
  updatedAt: string;
  approvalToken: string | null;
};

// Department Type
type ApiDepartment = {
  id: string;
  title: string;
  slug: string;
  image: string;
  images: string[];
  description: string | null;
  isActive: boolean;
  icon: string | null;
  position: number | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

// Category Type
type ApiCategory = {
  id: string;
  title: string;
  slug: string;
  image: string;
  images: string[];
  description: string | null;
  isActive: boolean;
  icon: string | null;
  position: number | null;
  featured: boolean;
  departmentId: string;
  createdAt: string;
  updatedAt: string | null;
};

// SubCategory Type
type ApiSubCategory = {
  id: string;
  title: string;
  slug?: string;
  image?: string;
  images?: string[];
  description?: string;
  isActive?: boolean;
  icon?: string;
  position?: number;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Brand Type
type ApiBrand = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  logo: string | null;
  description: string | null;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subCategoryId: string | null;
};

// Product Type
type ApiProduct = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  productImages: string[];
  description: string | null;
  shortDesc: string | null;
  isActive: boolean;
  isWholesale: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  sku: string | null;
  barcode: string | null;
  productCode: string | null;
  unit: string | null;
  productPrice: number;
  salePrice: number | null;
  wholesalePrice: number | null;
  wholesaleQty: number | null;
  productStock: number | null;
  lowStockAlert: number | null;
  qty: number | null;
  isDiscount: boolean;
  discount: number | null;
  tax: number | null;
  tags: string[];
  attributes: any | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
  rating: number | null;
  shopName: string | null;
  status: "DRAFT" | "PENDING" | "ACTIVE" | "INACTIVE";
  categoryId: string | null;
  subCategoryId: string | null;
  departmentId: string;
  brandId: string | null;
  vendorId: string | null;
  storeId: string | null;
  type: string | null;
  createdAt: string;
  updatedAt: string | null;
};

const allPermissions = [
 "dashboard.create","dashboard.read","dashboard.update","dashboard.delete","users.create","users.read","users.update","users.delete","roles.create","roles.read","roles.update","roles.delete","sales.create","sales.read","sales.update","sales.delete","customers.create","customers.read","customers.update","customers.delete","orders.create","orders.read","orders.update","orders.delete","reports.create","reports.read","reports.update","reports.delete","settings.create","settings.read","settings.update","settings.delete","categories.create","categories.read","categories.update","categories.delete","products.create","products.read","products.update","products.delete","blogs.create","blogs.read","blogs.update","blogs.delete","vendor-applications.read","stores.read","stores.create","vendors.read","product-approvals.read","marketing.read","wishlist.read","notifications.read","campaign.update","campaign.read"
];

// Define user role permissions (basic access)
const userPermissions = [
 "dashboard.read","profile.read","profile.update","orders.read","orders.create","change-password.read","change-password.write","profile.read","profile.write","","notifications.read"
];

// Define vendor role permissions
const vendorPermissions = [
  "dashboard.read","dashboard.read","products.write","store.read","profile.read","profile.update","wishlist.read","inventory.read","notifications.read","sales.read","reports.read","orders.read","change-password.read"
 ];
 
 async function cleanDatabase() {
  console.log("Cleaning up existing data...");
  try {
    // Delete all wishlist items first
    console.log("Deleting wishlist items...");
    await db.wishlistItem.deleteMany({});
    
    // Delete wishlists
    console.log("Deleting wishlists...");
    await db.wishlist.deleteMany({});
    
    // Delete all product relationships first
    console.log("Deleting product relationships...");
    await db.review.deleteMany({});
    await db.orderItem.deleteMany({});
    await db.sale.deleteMany({});

    // Delete products
    console.log("Deleting products...");
    await db.product.deleteMany({});
    
    // Delete stores
    console.log("Deleting stores...");
    await db.store.deleteMany({});
    
    // Delete brands
    console.log("Deleting brands...");
    await db.brand.deleteMany({});
    
    // Delete subcategories
    console.log("Deleting subcategories...");
    await db.subCategory.deleteMany({});
    
    // Delete categories
    console.log("Deleting categories...");
    await db.category.deleteMany({});
    
    // Delete departments
    console.log("Deleting departments...");
    await db.department.deleteMany({});

    // Get all users
    console.log("Fetching users to disconnect roles...");
    const users = await db.user.findMany({
      include: {
        roles: true,
      },
    });
    
    // Disconnect all roles from users
    console.log("Disconnecting roles from users...");
    for (const user of users) {
      if (user.roles.length > 0) {
        await db.user.update({
          where: { id: user.id },
          data: {
            roles: {
              disconnect: user.roles.map((role) => ({ id: role.id })),
            },
          },
        });
      }
    }

    // Delete all sessions first
    console.log("Deleting sessions...");
    await db.session.deleteMany({});

    // Delete all accounts
    console.log("Deleting accounts...");
    await db.account.deleteMany({});

    // Delete user profiles
    console.log("Deleting user profiles...");
    await db.userProfile.deleteMany({});

    // Now safely delete all users
    console.log("Deleting users...");
    const deleteUsers = await db.user.deleteMany({});
    console.log(`Deleted ${deleteUsers.count} users`);
    
    console.log("Database cleanup completed.");
  } catch (error) {
    console.error("Error during cleanup:", error);
    throw error;
  }
}

async function createRoles() {
  console.log("Creating roles...");
  try {
    // Create admin role with all permissions
    const adminRole = await db.role.upsert({
      where: { roleName: "admin" },
      update: {},
      create: {
        displayName: "Administrator",
        roleName: "admin",
        description: "Full system access",
        permissions: allPermissions,
      },
    });

    // Create user role with limited permissions
    const userRole = await db.role.upsert({
      where: { roleName: "user" },
      update: {},
      create: {
        displayName: "User",
        roleName: "user",
        description: "Basic user access",
        permissions: userPermissions,
      },
    });

    // Create vendor role
    const vendorRole = await db.role.upsert({
      where: { roleName: "vendor" },
      update: {},
      create: {
        displayName: "Vendor",
        roleName: "vendor",
        description: "Vendor access",
        permissions: vendorPermissions,
      },
    });

    console.log("Roles created successfully");
    return { adminRole, userRole, vendorRole };
  } catch (error) {
    console.error("Error creating roles:", error);
    throw error;
  }
}

async function fetchDataFromAPI<T>(endpoint: string): Promise<T[]> {
  try {
    const url = `${API_BASE_URL}/${endpoint}`;
    console.log(`Fetching data from ${url}...`);
    
    const response = await axios.get(url);
    
    // Handle the different response structures
    if (response.data && response.data.success) {
      const dataKey = endpoint === 'departments' ? 'departments' :
                     endpoint === 'categories' ? 'categories' :
                     endpoint === 'sub-categories' ? 'subcategories' :
                     endpoint === 'brands' ? 'brands' :
                     endpoint === 'products' ? 'products' :
                     endpoint === 'users' ? 'users' : '';
      
      if (Array.isArray(response.data[dataKey])) {
        console.log(`Fetched ${response.data[dataKey].length} ${endpoint} from API`);
        return response.data[dataKey] as T[];
      }
    }
    
    throw new Error(`Invalid API response format for ${endpoint}`);
  } catch (error) {
    console.error(`Error fetching ${endpoint} from API:`, error);
    throw error;
  }
}

async function fetchUsersFromAPI() {
  return fetchDataFromAPI<ApiUser>('users');
}

async function seedUsers(apiUsers: ApiUser[], roles: any) {
  console.log("Seeding users...");
  try {
    const createdUsers = [];
    
    for (const apiUser of apiUsers) {
      // Set up role connection based on user role
      let roleConnection;
      switch (apiUser.role) {
        case "ADMIN":
          roleConnection = { connect: { id: roles.adminRole.id } };
          break;
        case "VENDOR":
          roleConnection = { connect: { id: roles.vendorRole.id } };
          break;
        default:
          roleConnection = { connect: { id: roles.userRole.id } };
      }

      // Set password if not present
      const password = await bcrypt.hash(`Password${new Date().getFullYear()}`, 10);

      // Convert date strings to Date objects or null
      const emailVerified = apiUser.emailVerified ? new Date(apiUser.emailVerified) : null;
      const tokenExpiry = apiUser.tokenExpiry ? new Date(apiUser.tokenExpiry) : null;
      const createdAt = new Date(apiUser.createdAt);
      const updatedAt = new Date(apiUser.updatedAt);

      // Create user with role connection
      const user = await db.user.create({
        data: {
          id: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          emailVerified,
          image: apiUser.image,
          password,
          status: apiUser.status,
          isVerified: apiUser.isVerified,
          verifyToken: apiUser.verifyToken,
          tokenExpiry,
          role: apiUser.role,
          plan: apiUser.plan,
          jobTitle: apiUser.jobTitle,
          balance: apiUser.balance,
          commission: apiUser.commission,
          vendorStatus: apiUser.vendorStatus,
          createdAt,
          updatedAt,
          approvalToken: apiUser.approvalToken,
          roles: roleConnection,
        },
      });

      createdUsers.push(user);
      console.log(`Created user: ${apiUser.name} (${apiUser.email})`);
    }
    
    console.log(`${apiUsers.length} users seeded successfully`);
    return createdUsers;
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

// New function to create stores for vendors
async function createStoresForVendors(users: any[]) {
  console.log("Creating stores for vendors...");
  const stores = [];
  const vendorUsers = users.filter(user => user.role === "VENDOR" || user.role === "ADMIN");
  
  for (const vendor of vendorUsers) {
    try {
      // Generate a unique slug for the store
      const storeSlug = `${vendor.name.toLowerCase().replace(/\s+/g, '-')}-store-${uuidv4().substring(0, 8)}`;
      
      const store = await db.store.create({
        data: {
          storeName: `${vendor.name}'s Store`,
          slug: storeSlug,
          licenseUrl: "https://example.com/license.pdf", // Placeholder
          idProofUrl: "https://example.com/id_proof.pdf", // Placeholder
          logo: vendor.image || "https://via.placeholder.com/150",
          bannerUrl: "https://via.placeholder.com/1200x300",
          description: `Official store of ${vendor.name}`,
          storeEmail: vendor.email,
          storePhone: "123-456-7890", // Placeholder
          storeAddress: "123 Store Street",
          storeCity: "Store City",
          storeState: "Store State",
          storeCountry: "Store Country",
          storeZip: "12345",
          storeWebsite: "https://example.com",
          hasGst: Math.random() > 0.5,
          socialLinks: JSON.stringify({
            facebook: "https://facebook.com",
            twitter: "https://twitter.com",
            instagram: "https://instagram.com"
          }),
          isVerified: vendor.isVerified,
          isActive: vendor.status,
          userId: vendor.id,
          featuredProducts: [],
          createdAt: vendor.createdAt,
          updatedAt: vendor.updatedAt,
        }
      });
      
      stores.push(store);
      console.log(`Created store for vendor: ${vendor.name}`);
    } catch (error) {
      console.error(`Error creating store for vendor ${vendor.name}:`, error);
      // Continue with other vendors even if one fails
    }
  }
  
  console.log(`Created ${stores.length} stores for vendors`);
  return stores;
}

async function seedDepartments(apiDepartments: ApiDepartment[]) {
  console.log("Seeding departments...");
  try {
    const createdDepartments = [];
    
    for (const apiDept of apiDepartments) {
      // Convert date strings to Date objects
      const createdAt = new Date(apiDept.createdAt);
      const updatedAt = new Date(apiDept.updatedAt);
      
      const department = await db.department.create({
        data: {
          id: apiDept.id,
          title: apiDept.title,
          slug: apiDept.slug,
          image: apiDept.image,
          images: apiDept.images,
          description: apiDept.description,
          isActive: apiDept.isActive,
          icon: apiDept.icon,
          position: apiDept.position,
          featured: apiDept.featured,
          createdAt,
          updatedAt,
        },
      });
      
      createdDepartments.push(department);
      console.log(`Created department: ${apiDept.title}`);
    }
    
    console.log(`${apiDepartments.length} departments seeded successfully`);
    return createdDepartments;
  } catch (error) {
    console.error("Error seeding departments:", error);
    throw error;
  }
}

async function seedCategories(apiCategories: ApiCategory[]) {
  console.log("Seeding categories...");
  try {
    const createdCategories = [];
    
    for (const apiCat of apiCategories) {
      // Convert date strings to Date objects
      const createdAt = new Date(apiCat.createdAt);
      const updatedAt = apiCat.updatedAt ? new Date(apiCat.updatedAt) : undefined;
      
      const category = await db.category.create({
        data: {
          id: apiCat.id,
          title: apiCat.title,
          slug: apiCat.slug,
          image: apiCat.image,
          images: apiCat.images,
          description: apiCat.description,
          isActive: apiCat.isActive,
          icon: apiCat.icon,
          position: apiCat.position,
          featured: apiCat.featured,
          departmentId: apiCat.departmentId,
          createdAt,
          updatedAt,
        },
      });
      
      createdCategories.push(category);
      console.log(`Created category: ${apiCat.title}`);
    }
    
    console.log(`${apiCategories.length} categories seeded successfully`);
    return createdCategories;
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
}

async function seedSubCategories(apiSubCategories: ApiSubCategory[]) {
  console.log("Seeding subcategories...");
  try {
    const createdSubCategories = [];
    
    for (const apiSubCat of apiSubCategories) {
      // Generate a slug if not present
      const slug = apiSubCat.slug || apiSubCat.title.toLowerCase().replace(/\s+/g, '-');
      
      // Set default values for missing fields
      const image = apiSubCat.image || null;
      const images = apiSubCat.images || [];
      const description = apiSubCat.description || null;
      const isActive = apiSubCat.isActive !== undefined ? apiSubCat.isActive : true;
      const icon = apiSubCat.icon || null;
      const position = apiSubCat.position || 0;
      const categoryId = apiSubCat.categoryId || null;
      
      // Create subcategory with available data
      const createdAt = apiSubCat.createdAt ? new Date(apiSubCat.createdAt) : new Date();
      const updatedAt = apiSubCat.updatedAt ? new Date(apiSubCat.updatedAt) : new Date();
      
      const subCategory = await db.subCategory.create({
        data: {
          id: apiSubCat.id,
          title: apiSubCat.title,
          slug,
          image,
          images,
          description,
          isActive,
          icon,
          position,
          categoryId,
          createdAt,
          updatedAt,
        },
      });
      
      createdSubCategories.push(subCategory);
      console.log(`Created subcategory: ${apiSubCat.title}`);
    }
    
    console.log(`${apiSubCategories.length} subcategories seeded successfully`);
    return createdSubCategories;
  } catch (error) {
    console.error("Error seeding subcategories:", error);
    throw error;
  }
}

async function seedBrands(apiBrands: ApiBrand[]) {
  console.log("Seeding brands...");
  try {
    const createdBrands = [];
    
    for (const apiBrand of apiBrands) {
      // Convert date strings to Date objects
      const createdAt = new Date(apiBrand.createdAt);
      const updatedAt = new Date(apiBrand.updatedAt);
      
      const brand = await db.brand.create({
        data: {
          id: apiBrand.id,
          title: apiBrand.title,
          slug: apiBrand.slug,
          imageUrl: apiBrand.imageUrl,
          logo: apiBrand.logo,
          description: apiBrand.description,
          featured: apiBrand.featured,
          isActive: apiBrand.isActive,
          subCategoryId: apiBrand.subCategoryId,
          createdAt,
          updatedAt,
        },
      });
      
      createdBrands.push(brand);
      console.log(`Created brand: ${apiBrand.title}`);
    }
    
    console.log(`${apiBrands.length} brands seeded successfully`);
    return createdBrands;
  } catch (error) {
    console.error("Error seeding brands:", error);
    throw error;
  }
}

async function seedProducts(apiProducts: ApiProduct[], users: any[], stores: any[]) {
  console.log("Seeding products...");
  try {
    const createdProducts = [];
    
    // Create a lookup map for stores by userId for quicker access
    const storesByUserId = stores.reduce((acc, store) => {
      acc[store.userId] = store;
      return acc;
    }, {});
    
    // Find some admin and vendor users to associate with products
    const adminUsers = users.filter(user => user.role === "ADMIN");
    const vendorUsers = users.filter(user => user.role === "VENDOR");
    
    let userIndex = 0;
    
    for (const apiProduct of apiProducts) {
      try {
        // Convert date strings to Date objects
        const createdAt = new Date(apiProduct.createdAt);
        const updatedAt = apiProduct.updatedAt ? new Date(apiProduct.updatedAt) : undefined;
        
        // Assign a vendor ID to some products (distribute them among available vendors)
        let vendorId = null;
        let storeId = null;
        
        if (Math.random() > 0.3 && vendorUsers.length > 0) {
          vendorId = vendorUsers[userIndex % vendorUsers.length].id;
          // Check if this vendor has a store
          if (storesByUserId[vendorId]) {
            storeId = storesByUserId[vendorId].id;
          }
          userIndex++;
        }
        // If no vendor, sometimes assign to an admin
        else if (Math.random() > 0.5 && adminUsers.length > 0) {
          vendorId = adminUsers[userIndex % adminUsers.length].id;
          // Check if this admin has a store
          if (storesByUserId[vendorId]) {
            storeId = storesByUserId[vendorId].id;
          }
          userIndex++;
        }
        
        const product = await db.product.create({
          data: {
            id: apiProduct.id,
            title: apiProduct.title,
            slug: apiProduct.slug,
            imageUrl: apiProduct.imageUrl,
            productImages: apiProduct.productImages,
            description: apiProduct.description,
            shortDesc: apiProduct.shortDesc,
            isActive: apiProduct.isActive,
            isWholesale: apiProduct.isWholesale,
            isFeatured: apiProduct.isFeatured,
            isNewArrival: apiProduct.isNewArrival,
            sku: apiProduct.sku,
            barcode: apiProduct.barcode,
            productCode: apiProduct.productCode,
            unit: apiProduct.unit,
            productPrice: apiProduct.productPrice,
            salePrice: apiProduct.salePrice,
            wholesalePrice: apiProduct.wholesalePrice,
            wholesaleQty: apiProduct.wholesaleQty,
            productStock: apiProduct.productStock,
            lowStockAlert: apiProduct.lowStockAlert,
            qty: apiProduct.qty,
            isDiscount: apiProduct.isDiscount,
            discount: apiProduct.discount,
            tax: apiProduct.tax,
            tags: apiProduct.tags,
            attributes: apiProduct.attributes,
            metaTitle: apiProduct.metaTitle,
            metaDescription: apiProduct.metaDescription,
            metaKeywords: apiProduct.metaKeywords,
            rating: apiProduct.rating,
            shopName: apiProduct.shopName,
            status: apiProduct.status,
            categoryId: apiProduct.categoryId,
            subCategoryId: apiProduct.subCategoryId,
            departmentId: apiProduct.departmentId,
            brandId: apiProduct.brandId,
            vendorId,
            storeId, // Only set storeId if we have a valid store
            type: apiProduct.type || "regular",
            createdAt,
            updatedAt,
          },
        });
        
        createdProducts.push(product);
        console.log(`Created product: ${apiProduct.title}`);
      } catch (error) {
        console.error(`Error creating product ${apiProduct.title}:`, error);
        // Continue with other products even if one fails
      }
    }
    
    console.log(`${createdProducts.length} products seeded successfully`);
    return createdProducts;
  } catch (error) {
    console.error("Error seeding products:", error);
    throw error;
  }
}

async function assignSubCategoriesToCategories() {
  console.log("Assigning subcategories to categories...");
  try {
    // Get all categories and subcategories
    const categories = await db.category.findMany();
    const subcategories = await db.subCategory.findMany({ where: { categoryId: null } });
    
    if (categories.length === 0) {
      console.log("No categories available to assign subcategories");
      return;
    }
    
    // Assign subcategories to random categories
    for (const subcategory of subcategories) {
      const randomCategoryIndex = Math.floor(Math.random() * categories.length);
      const randomCategory = categories[randomCategoryIndex];
      
      await db.subCategory.update({
        where: { id: subcategory.id },
        data: { categoryId: randomCategory.id },
      });
      
      console.log(`Assigned subcategory "${subcategory.title}" to category "${randomCategory.title}"`);
    }
    
    console.log(`${subcategories.length} subcategories assigned to categories`);
  } catch (error) {
    console.error("Error assigning subcategories to categories:", error);
    throw error;
  }
}

async function main() {
  console.log("Starting database seed process...");

  try {
    // First clean up existing data
    await cleanDatabase();

    // Create roles
    const roles = await createRoles();

    // Fetch users from API and seed them
    const apiUsers = await fetchUsersFromAPI();
    const users = await seedUsers(apiUsers, roles);

    // Create stores for vendors (NEW STEP)
    const stores = await createStoresForVendors(users);

    // Seed departments
    const apiDepartments = await fetchDataFromAPI<ApiDepartment>('departments');
    await seedDepartments(apiDepartments);
    
    // Seed categories
    const apiCategories = await fetchDataFromAPI<ApiCategory>('categories');
    await seedCategories(apiCategories);
    
    // Seed subcategories
    const apiSubCategories = await fetchDataFromAPI<ApiSubCategory>('sub-categories');
    await seedSubCategories(apiSubCategories);
    
    // Assign subcategories to categories if not already assigned
    await assignSubCategoriesToCategories();
    
    // Seed brands
    const apiBrands = await fetchDataFromAPI<ApiBrand>('brands');
    await seedBrands(apiBrands);
    
    // Seed products - now passing stores as well
    const apiProducts = await fetchDataFromAPI<ApiProduct>('products');
    await seedProducts(apiProducts, users, stores);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error in main seed process:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Failed to seed database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });