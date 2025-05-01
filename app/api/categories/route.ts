
import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      
      where: {
        isActive: true,
      },
      
    });

    return NextResponse.json(
      { 
        success: true, 
        categories 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories' 
      },
      { status: 500 }
    );
  }
}