import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceSchedules, equipment } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const schedule = await db
        .select()
        .from(maintenanceSchedules)
        .where(eq(maintenanceSchedules.id, parseInt(id)))
        .limit(1);

      if (schedule.length === 0) {
        return NextResponse.json(
          { error: 'Maintenance schedule not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(schedule[0], { status: 200 });
    }

    // List with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const equipmentId = searchParams.get('equipmentId');
    const priority = searchParams.get('priority');
    const isActive = searchParams.get('isActive');
    const assignedTo = searchParams.get('assignedTo');

    let query = db.select().from(maintenanceSchedules);

    const conditions = [];

    // Equipment filter
    if (equipmentId) {
      const equipmentIdNum = parseInt(equipmentId);
      if (!isNaN(equipmentIdNum)) {
        conditions.push(eq(maintenanceSchedules.equipmentId, equipmentIdNum));
      }
    }

    // Priority filter
    if (priority) {
      conditions.push(eq(maintenanceSchedules.priority, priority));
    }

    // Active status filter
    if (isActive !== null && isActive !== undefined) {
      const isActiveValue = isActive === '1' || isActive === 'true';
      conditions.push(eq(maintenanceSchedules.isActive, isActiveValue));
    }

    // Assigned to filter
    if (assignedTo) {
      conditions.push(eq(maintenanceSchedules.assignedTo, assignedTo));
    }

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(maintenanceSchedules.title, `%${search}%`),
          like(maintenanceSchedules.description, `%${search}%`)
        )
      );
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(maintenanceSchedules.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { equipmentId, title, description, frequency, frequencyDays, lastPerformed, nextDue, priority, estimatedDuration, assignedTo, isActive } = body;

    // Validate required fields
    if (!equipmentId) {
      return NextResponse.json(
        { error: 'Equipment ID is required', code: 'MISSING_EQUIPMENT_ID' },
        { status: 400 }
      );
    }

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    // Validate equipmentId is a valid integer
    const equipmentIdNum = parseInt(equipmentId);
    if (isNaN(equipmentIdNum)) {
      return NextResponse.json(
        { error: 'Equipment ID must be a valid number', code: 'INVALID_EQUIPMENT_ID' },
        { status: 400 }
      );
    }

    // Verify equipment exists
    const equipmentExists = await db
      .select()
      .from(equipment)
      .where(eq(equipment.id, equipmentIdNum))
      .limit(1);

    if (equipmentExists.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found', code: 'EQUIPMENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare insert data with defaults
    const now = Date.now();
    const insertData = {
      equipmentId: equipmentIdNum,
      title: title.trim(),
      description: description?.trim() || null,
      frequency: frequency?.trim() || null,
      frequencyDays: frequencyDays ? parseInt(frequencyDays) : null,
      lastPerformed: lastPerformed ? parseInt(lastPerformed) : null,
      nextDue: nextDue ? parseInt(nextDue) : null,
      priority: priority?.trim() || 'medium',
      estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
      assignedTo: assignedTo?.trim() || null,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: now,
      updatedAt: now,
    };

    const newSchedule = await db
      .insert(maintenanceSchedules)
      .values(insertData)
      .returning();

    return NextResponse.json(newSchedule[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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

    const body = await request.json();
    const { equipmentId, title, description, frequency, frequencyDays, lastPerformed, nextDue, priority, estimatedDuration, assignedTo, isActive } = body;

    // Prepare update data
    const updateData: any = {
      updatedAt: Date.now(),
    };

    // Validate and add equipmentId if provided
    if (equipmentId !== undefined) {
      const equipmentIdNum = parseInt(equipmentId);
      if (isNaN(equipmentIdNum)) {
        return NextResponse.json(
          { error: 'Equipment ID must be a valid number', code: 'INVALID_EQUIPMENT_ID' },
          { status: 400 }
        );
      }

      // Verify equipment exists
      const equipmentExists = await db
        .select()
        .from(equipment)
        .where(eq(equipment.id, equipmentIdNum))
        .limit(1);

      if (equipmentExists.length === 0) {
        return NextResponse.json(
          { error: 'Equipment not found', code: 'EQUIPMENT_NOT_FOUND' },
          { status: 404 }
        );
      }

      updateData.equipmentId = equipmentIdNum;
    }

    // Add other fields if provided
    if (title !== undefined) {
      if (!title || title.trim() === '') {
        return NextResponse.json(
          { error: 'Title cannot be empty', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (frequency !== undefined) {
      updateData.frequency = frequency?.trim() || null;
    }

    if (frequencyDays !== undefined) {
      updateData.frequencyDays = frequencyDays ? parseInt(frequencyDays) : null;
    }

    if (lastPerformed !== undefined) {
      updateData.lastPerformed = lastPerformed ? parseInt(lastPerformed) : null;
    }

    if (nextDue !== undefined) {
      updateData.nextDue = nextDue ? parseInt(nextDue) : null;
    }

    if (priority !== undefined) {
      updateData.priority = priority?.trim() || 'medium';
    }

    if (estimatedDuration !== undefined) {
      updateData.estimatedDuration = estimatedDuration ? parseInt(estimatedDuration) : null;
    }

    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo?.trim() || null;
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const updated = await db
      .update(maintenanceSchedules)
      .set(updateData)
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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