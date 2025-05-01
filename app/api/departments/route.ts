
import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const departments = await db.department.findMany({
     
      where: {
        isActive: true,
      },
    
    });

    return NextResponse.json(
      { 
        success: true, 
        departments 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch departments' 
      },
      { status: 500 }
    );
  }
}