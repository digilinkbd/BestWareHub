
import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await db.user.findMany();

    return NextResponse.json(
      { 
        success: true, 
        users 
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