import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceSchedules } from '@/db/schema';
import { and, lt, isNotNull, eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const priority = searchParams.get('priority');

    // Get current timestamp
    const now = Date.now();

    // Build query conditions
    const conditions = [
      isNotNull(maintenanceSchedules.nextDue),
      lt(maintenanceSchedules.nextDue, now),
      eq(maintenanceSchedules.isActive, true)
    ];

    // Add priority filter if provided
    if (priority) {
      conditions.push(eq(maintenanceSchedules.priority, priority));
    }

    // Query overdue maintenance schedules
    const overdueSchedules = await db
      .select()
      .from(maintenanceSchedules)
      .where(and(...conditions))
      .orderBy(asc(maintenanceSchedules.nextDue))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(overdueSchedules, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}