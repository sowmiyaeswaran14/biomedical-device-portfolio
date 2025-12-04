import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceSchedules } from '@/db/schema';
import { and, gte, lte, isNotNull, eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Calculate time range (30 days from now)
    const now = Date.now();
    const thirtyDaysFromNow = now + (30 * 24 * 60 * 60 * 1000);

    // Query upcoming maintenance schedules
    const upcomingSchedules = await db
      .select()
      .from(maintenanceSchedules)
      .where(
        and(
          isNotNull(maintenanceSchedules.nextDue),
          gte(maintenanceSchedules.nextDue, now),
          lte(maintenanceSchedules.nextDue, thirtyDaysFromNow),
          eq(maintenanceSchedules.isActive, true)
        )
      )
      .orderBy(asc(maintenanceSchedules.nextDue))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(upcomingSchedules, { status: 200 });
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