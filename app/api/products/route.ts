
import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
      },
     
    });

    return NextResponse.json(
      { 
        success: true, 
        products 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}