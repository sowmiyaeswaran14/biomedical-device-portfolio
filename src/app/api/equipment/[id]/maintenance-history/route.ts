import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceLogs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Validate ID is a valid integer
    const equipmentId = parseInt(id);
    if (!id || isNaN(equipmentId)) {
      return NextResponse.json(
        {
          error: 'Valid equipment ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Query all maintenance logs for the equipment
    const logs = await db
      .select()
      .from(maintenanceLogs)
      .where(eq(maintenanceLogs.equipmentId, equipmentId))
      .orderBy(desc(maintenanceLogs.performedAt));

    // Return empty array if no logs found (not an error condition)
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error('GET maintenance logs error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}