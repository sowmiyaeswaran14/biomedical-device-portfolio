import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Validate ID format
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const logId = parseInt(id);

    // Fetch single maintenance log
    const log = await db
      .select()
      .from(maintenanceLogs)
      .where(eq(maintenanceLogs.id, logId))
      .limit(1);

    if (log.length === 0) {
      return NextResponse.json(
        { error: 'Maintenance log not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(log[0], { status: 200 });
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

    // Validate ID format
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const logId = parseInt(id);

    // Check if log exists
    const existingLog = await db
      .select()
      .from(maintenanceLogs)
      .where(eq(maintenanceLogs.id, logId))
      .limit(1);

    if (existingLog.length === 0) {
      return NextResponse.json(
        { error: 'Maintenance log not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Prepare update data with auto-updated timestamp
    const updateData: any = {
      ...body,
      updatedAt: Date.now(),
    };

    // Remove id from update data if present
    delete updateData.id;

    // Update the maintenance log
    const updated = await db
      .update(maintenanceLogs)
      .set(updateData)
      .where(eq(maintenanceLogs.id, logId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update maintenance log', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

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

    // Validate ID format
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const logId = parseInt(id);

    // Check if log exists before deletion
    const existingLog = await db
      .select()
      .from(maintenanceLogs)
      .where(eq(maintenanceLogs.id, logId))
      .limit(1);

    if (existingLog.length === 0) {
      return NextResponse.json(
        { error: 'Maintenance log not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the maintenance log
    const deleted = await db
      .delete(maintenanceLogs)
      .where(eq(maintenanceLogs.id, logId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete maintenance log', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Maintenance log deleted successfully',
        deletedLog: deleted[0],
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