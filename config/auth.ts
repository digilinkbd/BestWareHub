import { AuthOptions, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/prisma/db";

async function getUserWithRoles(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      roles: true, // Include roles relation
      store: true, // Include store relation

    },
  });

  if (!user) {
    return null;
  }

  // Get all permissions from user's roles
  const permissions = user.roles.flatMap((role) => role.permissions);

  // Remove duplicates from permissions
  const uniquePermissions = [...new Set(permissions)];



  return {
    ...user,
    permissions: uniquePermissions,
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
    error: "/auth", // Add this line to redirect errors to login page
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          image: profile.avatar_url,
          email: profile.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || `${profile.given_name} ${profile.family_name}`,
          image: profile.picture,
          email: profile.email,
        };
      },
    }),
    CredentialsProvider({
      // Your existing credentials provider code
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "name@example.com" },
        password: { label: "Password", type: "password" },
      },
      // Inside the CredentialsProvider's authorize function
  async authorize(credentials) {
  try {
    if (!credentials?.email || !credentials?.password) {
      throw { error: "No Inputs Found", status: 401 };
    }

    const existingUser = await db.user.findUnique({
      where: { email: credentials.email },
      include: {
        roles: true,
        store: true, 
      },
    });

    if (!existingUser) {
      throw { error: "No user found", status: 401 };
    }

    
    // Check if user is verified
    if (!existingUser.isVerified) {
      throw { error: "Email not verified", status: 403 };
    }

    let passwordMatch: boolean = false;
    if (existingUser && existingUser.password) {
      passwordMatch = await compare(
        credentials.password,
        existingUser.password
      );
    }

    if (!passwordMatch) {
      throw { error: "Incorrect password", status: 401 };
    }

    const permissions = existingUser.roles.flatMap(
      (role) => role.permissions
    );

    // Remove duplicates from permissions
    const uniquePermissions = [...new Set(permissions)];

   
   
    return {
      id: existingUser.id,
      name: existingUser.name,
      image: existingUser.image,
      email: existingUser.email,
      roles: existingUser.roles,
      permissions: uniquePermissions,
      store: existingUser.store,
      vendorStatus: existingUser.vendorStatus,
    };
  } catch (error: any) {
    throw error;
  }
}
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      
      // Allow credential logins to pass through
      if (account?.provider === "credentials") {
        return true;
      }

      // For OAuth providers (Google, GitHub)
      if (account && (account.provider === "google" || account.provider === "github")) {
        try {
          
          // Check if user exists with this email
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true, roles: true },
          });

          // If no user exists, it will be created by the adapter
          if (!existingUser) {
            // Find default role
            const defaultRole = await db.role.findFirst({
              where: { roleName: "user" },
            });

            if (!defaultRole) {
              return false;
            }

            // Allow creation to proceed, then add role in JWT callback
            return true;
          } 
          
          
          // If user exists but no account for this provider
          if (existingUser && !existingUser.accounts.some(
            (acc) => acc.provider === account.provider
          )) {
            // Link this account to the existing user
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });

            // If user doesn't have any roles, assign default role
            if (!existingUser.roles.length) {
              const defaultRole = await db.role.findFirst({
                where: { roleName: "user" },
              });

              if (defaultRole) {
                await db.user.update({
                  where: { id: existingUser.id },
                  data: {
                    roles: {
                      connect: { id: defaultRole.id },
                    },
                    isVerified: true,
                    emailVerified: new Date(),
                  },
                });
              }
            }

            return true;
          }

          // User exists and already has this provider account
          return true;
        } catch (error) {
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      
      if (user) {
        // For initial sign in
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        
        // Add store info if available
        if (user.store) {
          token.storeId = user.store.id;
          token.storeName = user.store.storeName;
        }
        
        // Add vendor status
        if (user.vendorStatus) {
          token.vendorStatus = user.vendorStatus;
        }
        
        // If coming from OAuth and we need to set roles
        if (account && (account.provider === "google" || account.provider === "github")) {
          // Get user with roles
          const userData = await getUserWithRoles(user.id);
          if (userData) {
            // Check if user needs roles
            if (!userData.roles || userData.roles.length === 0) {
              // Find default role
              const defaultRole = await db.role.findFirst({
                where: { roleName: "user" },
              });
              
              if (defaultRole) {
                // Add default role
                await db.user.update({
                  where: { id: user.id },
                  data: {
                    roles: {
                      connect: { id: defaultRole.id },
                    },
                    isVerified: true,
                    emailVerified: new Date(),
                  },
                });
                
                // Refresh user data
                const updatedUser = await getUserWithRoles(user.id);
                if (updatedUser) {
                  token.roles = updatedUser.roles;
                  token.permissions = updatedUser.permissions;
                  token.store = updatedUser.store;
                  token.vendorStatus = updatedUser.vendorStatus;
                }
              }
            } else {
              token.roles = userData.roles;
              token.permissions = userData.permissions;
              token.store = userData.store;
              token.vendorStatus = userData.vendorStatus;
            }
          }
        } else {
          // From credentials provider, roles already included
          token.roles = user.roles;
          token.permissions = user.permissions;
          token.store = user.store;
          token.vendorStatus = user.vendorStatus;
        }
      } else {
        const userData = await getUserWithRoles(token.id);
        if (userData) {
          token.roles = userData.roles;
          token.permissions = userData.permissions;
          token.store = userData.store;
          token.vendorStatus = userData.vendorStatus;
        }
      }
      return token;
    },
    
    // Update the session callback to include the vendor info
    async session({ session, token }) {
      
      if (session.user && token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
        
        // Add store and vendor status information
        if (token.store) {
          session.user.store = token.store;
        }
        
        if (token.vendorStatus) {
          session.user.vendorStatus = token.vendorStatus;
        }
        
        // Include store ID if available
        if (token.storeId) {
          session.user.storeId = token.storeId;
        }
      }
      return session;
    }
  },
};