"use server";

import { db } from "@/prisma/db";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { signIn } from "next-auth/react";
import VerificationEmail from "@/components/email-templates/VerificationEmail";
import { ROLES } from "@/config/permissions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { z } from "zod";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Define roles


// Helper to generate verification code
export async function generateVerificationCode(length = 6) {
    let code = "";
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return code;
  }
  

// Helper to generate token expiry (30 minutes from now)
function generateTokenExpiry() {
  return new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
}

// Register user
export async function registerUser(data: { 
    name: string;
    email: string;
    password: string;
    image?: string;
  }) {
    const { name, email, password, image } = data;
    console.log(name , email , password , "data for the register inputs")

    
    try {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return {
          error: `Email ${email} is already in use`,
          status: 409,
        };
      }
  
      // Use a transaction for atomic operations
      return await db.$transaction(async (tx) => {
        
        await ensureRolesExist();
  
        // Get default user role
        const defaultRole = await tx.role.findUnique({
          where: { roleName: ROLES.USER.roleName },
        });
  
        if (!defaultRole) {
          throw new Error("Default role not found");
        }
  
        // Generate verification code
        const verifyToken = await generateVerificationCode();
        const tokenExpiry = generateTokenExpiry();
  
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user with role
        const newUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            image: image || "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png",
            verifyToken,
            tokenExpiry,
            roles: {
              connect: {
                id: defaultRole.id,
              },
            },
          },
          include: {
            roles: true,
          },
        });
  
        // Send verification email - handle failure gracefully
        const emailResult = await sendVerificationEmail(email, verifyToken, name);
        if (!emailResult.success) {
          console.warn("Failed to send verification email, but user was created", emailResult.error);
        }
  
        return {
          status: 200,
          userId: newUser.id,
        };
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        error: "Something went wrong. Please try again.",
        status: 500,
      };
    }
  }

// Verify email with code
export async function verifyEmail({ 
  email, 
  code 
}: { 
  email: string; 
  code: string 
}) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (!user.verifyToken) {
      return {
        success: false,
        error: "No verification code found",
      };
    }

    if (user.isVerified) {
      return {
        success: true,
        message: "Email already verified",
      };
    }

    if (user.tokenExpiry && new Date() > user.tokenExpiry) {
      return {
        success: false,
        error: "Verification code expired",
      };
    }

    if (user.verifyToken !== code) {
      return {
        success: false,
        error: "Invalid verification code",
      };
    }

    // Verify the user
    await db.user.update({
      where: { email },
      data: {
        isVerified: true,
        emailVerified: new Date(),
        verifyToken: null,
        tokenExpiry: null,
      },
    });

    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    console.error("Verification error:", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

// Resend verification code
export async function resendVerificationCode(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (user.isVerified) {
      return {
        success: false,
        error: "Email already verified",
      };
    }

    // Generate new code
    const verifyToken = await generateVerificationCode();
    const tokenExpiry = generateTokenExpiry();

    // Update user with new code
    await db.user.update({
      where: { email },
      data: {
        verifyToken,
        tokenExpiry,
      },
    });

    // Send email
    await sendVerificationEmail(email, verifyToken, user.name);

    return {
      success: true,
      message: "Verification code sent",
    };
  } catch (error) {
    console.error("Error resending code:", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

// Send verification email
async function sendVerificationEmail(email: string, code: string, name: string) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not configured");
        return { success: false, error: "Email service not configured" };
      }
      
      const verify= await resend.emails.send({
        from: 'Verification Code <info@mimos.com.bd>',
        to: [email],
        subject: 'Verification',
        react:await VerificationEmail ({ code, name }),
      });
      if (!verify) {
        throw new Error("Failed to send email - no response from service");
      }
      
      return { success: true };
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Return an object instead of throwing
      return { success: false, error: "Failed to send verification email" };
    }
  }

// Ensure roles exist in database
async function ensureRolesExist() {
  try {
    const existingRoles = await db.role.findMany();
    const roleNames = existingRoles.map(role => role.roleName);

    const rolesToCreate = Object.values(ROLES).filter(
      role => !roleNames.includes(role.roleName)
    );

    if (rolesToCreate.length > 0) {
      await db.$transaction(
        rolesToCreate.map(role => 
          db.role.create({ data: role })
        )
      );
    }
  } catch (error) {
    console.error("Error ensuring roles exist:", error);
  }
}



export async function updateVendorStatus(approvalToken: string) {
  try {
    const decodedToken = Buffer.from(approvalToken, 'base64').toString('utf-8');
    const [userId, storeId, expiryTimestamp] = decodedToken.split(':');
    
    // Check if token is expired
    if (Date.now() > parseInt(expiryTimestamp)) {
      return { success: false, message: "Approval link has expired" };
    }
    
    // Find the user and verify token
    const user = await db.user.findUnique({
      where: { 
        id: userId,
        approvalToken
      },
      include: {
        roles: true
      }
    });
    
    if (!user) {
      return { success: false, message: "Invalid approval token" };
    }
    
    // Get vendor role
    const vendorRole = await db.role.findFirst({
      where: { roleName: "vendor" }
    });
    
    if (!vendorRole) {
      return { success: false, message: "Vendor role not found" };
    }
    
    await db.$transaction(async (tx) => {
      // Update user - make sure to disconnect from the user role first
      await tx.user.update({
        where: { id: userId },
        data: {
          vendorStatus: "APPROVED",
          role: "VENDOR", // This updates the enum field
          approvalToken: null, 
          roles: {
            // First remove any 'user' role
            disconnect: user.roles.filter(r => r.roleName === "user").map(r => ({ id: r.id })),
            // Then connect the vendor role
            connect: { id: vendorRole.id }
          }
        }
      });
      
      // Update store status
      await tx.store.update({
        where: { id: storeId },
        data: { 
          isVerified: true,
          isActive: true
        }
      });
      
      // Create notification about successful account activation
      await tx.notification.create({
        data: {
          title: "Vendor Account Activated",
          message: "Your vendor account has been successfully activated. You can now start selling!",
          type: "success",
          userId,
          link: "/dashboard/vendor"
        }
      });
    });
    
    return { success: true, message: "Vendor status updated successfully" };
  } catch (error) {
    console.error("Error updating vendor status:", error);
    return { success: false, message: "Failed to update vendor status" };
  }
}