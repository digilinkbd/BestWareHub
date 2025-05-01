
import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const subcategories = await db.subCategory.findMany({
      select: {
        id: true,
        title: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        subcategories 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subcategories' 
      },
      { status: 500 }
    );
  }
}