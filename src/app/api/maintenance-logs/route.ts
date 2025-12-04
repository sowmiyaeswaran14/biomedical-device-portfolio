import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceLogs } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

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

      const record = await db
        .select()
        .from(maintenanceLogs)
        .where(eq(maintenanceLogs.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Maintenance log not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with filtering, search, pagination, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const equipmentId = searchParams.get('equipmentId');
    const scheduleId = searchParams.get('scheduleId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const performedBy = searchParams.get('performedBy');
    const sortField = searchParams.get('sort') ?? 'performedAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    let query = db.select().from(maintenanceLogs);

    // Build filter conditions
    const conditions = [];

    if (equipmentId) {
      conditions.push(eq(maintenanceLogs.equipmentId, parseInt(equipmentId)));
    }

    if (scheduleId) {
      conditions.push(eq(maintenanceLogs.scheduleId, parseInt(scheduleId)));
    }

    if (type) {
      conditions.push(eq(maintenanceLogs.type, type));
    }

    if (status) {
      conditions.push(eq(maintenanceLogs.status, status));
    }

    if (performedBy) {
      conditions.push(eq(maintenanceLogs.performedBy, performedBy));
    }

    if (search) {
      conditions.push(
        or(
          like(maintenanceLogs.title, `%${search}%`),
          like(maintenanceLogs.description, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const validSortFields = [
      'id',
      'equipmentId',
      'title',
      'type',
      'performedBy',
      'performedAt',
      'status',
      'cost',
      'createdAt',
      'updatedAt',
    ];
    const sortColumn = validSortFields.includes(sortField) ? sortField : 'performedAt';
    const orderFn = sortOrder.toLowerCase() === 'asc' ? asc : desc;

    query = query.orderBy(orderFn(maintenanceLogs[sortColumn as keyof typeof maintenanceLogs]));

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

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

    // Validate required fields
    if (!body.equipmentId) {
      return NextResponse.json(
        { error: 'Equipment ID is required', code: 'MISSING_EQUIPMENT_ID' },
        { status: 400 }
      );
    }

    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!body.type || typeof body.type !== 'string' || body.type.trim() === '') {
      return NextResponse.json(
        { error: 'Type is required', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

    if (!body.performedBy || typeof body.performedBy !== 'string' || body.performedBy.trim() === '') {
      return NextResponse.json(
        { error: 'Performed by is required', code: 'MISSING_PERFORMED_BY' },
        { status: 400 }
      );
    }

    if (!body.performedAt) {
      return NextResponse.json(
        { error: 'Performed at timestamp is required', code: 'MISSING_PERFORMED_AT' },
        { status: 400 }
      );
    }

    // Validate equipmentId is a valid integer
    const equipmentId = parseInt(body.equipmentId);
    if (isNaN(equipmentId)) {
      return NextResponse.json(
        { error: 'Equipment ID must be a valid integer', code: 'INVALID_EQUIPMENT_ID' },
        { status: 400 }
      );
    }

    // Validate scheduleId if provided
    let scheduleId = null;
    if (body.scheduleId !== null && body.scheduleId !== undefined) {
      scheduleId = parseInt(body.scheduleId);
      if (isNaN(scheduleId)) {
        return NextResponse.json(
          { error: 'Schedule ID must be a valid integer', code: 'INVALID_SCHEDULE_ID' },
          { status: 400 }
        );
      }
    }

    // Validate performedAt is a valid timestamp
    const performedAt = parseInt(body.performedAt);
    if (isNaN(performedAt)) {
      return NextResponse.json(
        { error: 'Performed at must be a valid timestamp', code: 'INVALID_PERFORMED_AT' },
        { status: 400 }
      );
    }

    const now = Date.now();

    // Prepare insert data
    const insertData: any = {
      equipmentId,
      scheduleId,
      title: body.title.trim(),
      description: body.description ? body.description.trim() : null,
      type: body.type.trim(),
      performedBy: body.performedBy.trim(),
      performedAt,
      duration: body.duration ? parseInt(body.duration) : null,
      status: body.status || 'completed',
      partsReplaced: body.partsReplaced || null,
      cost: body.cost ? parseFloat(body.cost) : null,
      notes: body.notes ? body.notes.trim() : null,
      createdAt: now,
      updatedAt: now,
    };

    const newRecord = await db.insert(maintenanceLogs).values(insertData).returning();

    return NextResponse.json(newRecord[0], { status: 201 });
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

    const body = await request.json();

    // Check if record exists
    const existing = await db
      .select()
      .from(maintenanceLogs)
      .where(eq(maintenanceLogs.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Maintenance log not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (body.equipmentId !== undefined) {
      const equipmentId = parseInt(body.equipmentId);
      if (isNaN(equipmentId)) {
        return NextResponse.json(
          { error: 'Equipment ID must be a valid integer', code: 'INVALID_EQUIPMENT_ID' },
          { status: 400 }
        );
      }
      updateData.equipmentId = equipmentId;
    }

    if (body.scheduleId !== undefined) {
      if (body.scheduleId === null) {
        updateData.scheduleId = null;
      } else {
        const scheduleId = parseInt(body.scheduleId);
        if (isNaN(scheduleId)) {
          return NextResponse.json(
            { error: 'Schedule ID must be a valid integer', code: 'INVALID_SCHEDULE_ID' },
            { status: 400 }
          );
        }
        updateData.scheduleId = scheduleId;
      }
    }

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim() === '') {
        return NextResponse.json(
          { error: 'Title cannot be empty', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updateData.title = body.title.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description ? body.description.trim() : null;
    }

    if (body.type !== undefined) {
      if (typeof body.type !== 'string' || body.type.trim() === '') {
        return NextResponse.json(
          { error: 'Type cannot be empty', code: 'INVALID_TYPE' },
          { status: 400 }
        );
      }
      updateData.type = body.type.trim();
    }

    if (body.performedBy !== undefined) {
      if (typeof body.performedBy !== 'string' || body.performedBy.trim() === '') {
        return NextResponse.json(
          { error: 'Performed by cannot be empty', code: 'INVALID_PERFORMED_BY' },
          { status: 400 }
        );
      }
      updateData.performedBy = body.performedBy.trim();
    }

    if (body.performedAt !== undefined) {
      const performedAt = parseInt(body.performedAt);
      if (isNaN(performedAt)) {
        return NextResponse.json(
          { error: 'Performed at must be a valid timestamp', code: 'INVALID_PERFORMED_AT' },
          { status: 400 }
        );
      }
      updateData.performedAt = performedAt;
    }

    if (body.duration !== undefined) {
      updateData.duration = body.duration ? parseInt(body.duration) : null;
    }

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.partsReplaced !== undefined) {
      updateData.partsReplaced = body.partsReplaced;
    }

    if (body.cost !== undefined) {
      updateData.cost = body.cost ? parseFloat(body.cost) : null;
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes ? body.notes.trim() : null;
    }

    const updated = await db
      .update(maintenanceLogs)
      .set(updateData)
      .where(eq(maintenanceLogs.id, parseInt(id)))
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

    // Check if record exists
    const existing = await db
      .select()
      .from(maintenanceLogs)
      .where(eq(maintenanceLogs.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Maintenance log not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(maintenanceLogs)
      .where(eq(maintenanceLogs.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Maintenance log deleted successfully',
        data: deleted[0],
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