
import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const brands = await db.brand.findMany({
      
      where: {
        isActive: true,
      },
      
    });

    return NextResponse.json(
      { 
        success: true, 
        brands 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch brands' 
      },
      { status: 500 }
    );
  }
}