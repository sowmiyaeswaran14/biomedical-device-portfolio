import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceSchedules } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const scheduleId = parseInt(id);

    // Fetch single maintenance schedule by ID
    const schedule = await db
      .select()
      .from(maintenanceSchedules)
      .where(eq(maintenanceSchedules.id, scheduleId))
      .limit(1);

    if (schedule.length === 0) {
      return NextResponse.json(
        { error: 'Maintenance schedule not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(schedule[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const scheduleId = parseInt(id);

    // Parse request body
    const updates = await request.json();

    // Check if schedule exists
    const existingSchedule = await db
      .select()
      .from(maintenanceSchedules)
      .where(eq(maintenanceSchedules.id, scheduleId))
      .limit(1);

    if (existingSchedule.length === 0) {
      return NextResponse.json(
        { error: 'Maintenance schedule not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Update the schedule with auto-updated timestamp
    const updated = await db
      .update(maintenanceSchedules)
      .set({
        ...updates,
        updatedAt: Date.now(),
      })
      .where(eq(maintenanceSchedules.id, scheduleId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const scheduleId = parseInt(id);

    // Check if schedule exists
    const existingSchedule = await db
      .select()
      .from(maintenanceSchedules)
      .where(eq(maintenanceSchedules.id, scheduleId))
      .limit(1);

    if (existingSchedule.length === 0) {
      return NextResponse.json(
        { error: 'Maintenance schedule not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the schedule
    const deleted = await db
      .delete(maintenanceSchedules)
      .where(eq(maintenanceSchedules.id, scheduleId))
      .returning();

    return NextResponse.json(
      {
        message: 'Maintenance schedule deleted successfully',
        deleted: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}