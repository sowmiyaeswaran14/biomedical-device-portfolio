import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workOrders } from '@/db/schema';
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

      const workOrder = await db
        .select()
        .from(workOrders)
        .where(eq(workOrders.id, parseInt(id)))
        .limit(1);

      if (workOrder.length === 0) {
        return NextResponse.json(
          { error: 'Work order not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(workOrder[0], { status: 200 });
    }

    // List with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const equipmentId = searchParams.get('equipmentId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');
    const assignedTo = searchParams.get('assignedTo');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    let query = db.select().from(workOrders);

    // Build filter conditions
    const conditions = [];

    if (equipmentId) {
      conditions.push(eq(workOrders.equipmentId, parseInt(equipmentId)));
    }

    if (status) {
      conditions.push(eq(workOrders.status, status));
    }

    if (priority) {
      conditions.push(eq(workOrders.priority, priority));
    }

    if (type) {
      conditions.push(eq(workOrders.type, type));
    }

    if (assignedTo) {
      conditions.push(eq(workOrders.assignedTo, assignedTo));
    }

    if (search) {
      conditions.push(
        or(
          like(workOrders.title, `%${search}%`),
          like(workOrders.description, `%${search}%`)
        )
      );
    }

    // Apply filters if any
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply sorting
    const orderByColumn = workOrders[sortField as keyof typeof workOrders] ?? workOrders.createdAt;
    query = query.orderBy(sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn));

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

    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!body.type || body.type.trim() === '') {
      return NextResponse.json(
        { error: 'Type is required', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

    // Validate equipmentId is a valid number
    if (isNaN(parseInt(body.equipmentId))) {
      return NextResponse.json(
        { error: 'Equipment ID must be a valid number', code: 'INVALID_EQUIPMENT_ID' },
        { status: 400 }
      );
    }

    // Prepare insert data with defaults
    const now = Date.now();
    const insertData = {
      equipmentId: parseInt(body.equipmentId),
      title: body.title.trim(),
      description: body.description?.trim() || null,
      priority: body.priority || 'medium',
      status: body.status || 'pending',
      type: body.type.trim(),
      reportedBy: body.reportedBy?.trim() || null,
      assignedTo: body.assignedTo?.trim() || null,
      scheduledDate: body.scheduledDate ? parseInt(body.scheduledDate) : null,
      completedDate: body.completedDate ? parseInt(body.completedDate) : null,
      estimatedCost: body.estimatedCost ? parseFloat(body.estimatedCost) : null,
      actualCost: body.actualCost ? parseFloat(body.actualCost) : null,
      notes: body.notes?.trim() || null,
      createdAt: now,
      updatedAt: now,
    };

    const newWorkOrder = await db.insert(workOrders).values(insertData).returning();

    return NextResponse.json(newWorkOrder[0], { status: 201 });
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

    // Check if work order exists
    const existingWorkOrder = await db
      .select()
      .from(workOrders)
      .where(eq(workOrders.id, parseInt(id)))
      .limit(1);

    if (existingWorkOrder.length === 0) {
      return NextResponse.json(
        { error: 'Work order not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Prepare update data
    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (body.equipmentId !== undefined) {
      if (isNaN(parseInt(body.equipmentId))) {
        return NextResponse.json(
          { error: 'Equipment ID must be a valid number', code: 'INVALID_EQUIPMENT_ID' },
          { status: 400 }
        );
      }
      updateData.equipmentId = parseInt(body.equipmentId);
    }

    if (body.title !== undefined) {
      if (!body.title || body.title.trim() === '') {
        return NextResponse.json(
          { error: 'Title cannot be empty', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updateData.title = body.title.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    if (body.priority !== undefined) {
      updateData.priority = body.priority;
    }

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.type !== undefined) {
      if (!body.type || body.type.trim() === '') {
        return NextResponse.json(
          { error: 'Type cannot be empty', code: 'INVALID_TYPE' },
          { status: 400 }
        );
      }
      updateData.type = body.type.trim();
    }

    if (body.reportedBy !== undefined) {
      updateData.reportedBy = body.reportedBy?.trim() || null;
    }

    if (body.assignedTo !== undefined) {
      updateData.assignedTo = body.assignedTo?.trim() || null;
    }

    if (body.scheduledDate !== undefined) {
      updateData.scheduledDate = body.scheduledDate ? parseInt(body.scheduledDate) : null;
    }

    if (body.completedDate !== undefined) {
      updateData.completedDate = body.completedDate ? parseInt(body.completedDate) : null;
    }

    if (body.estimatedCost !== undefined) {
      updateData.estimatedCost = body.estimatedCost ? parseFloat(body.estimatedCost) : null;
    }

    if (body.actualCost !== undefined) {
      updateData.actualCost = body.actualCost ? parseFloat(body.actualCost) : null;
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes?.trim() || null;
    }

    const updated = await db
      .update(workOrders)
      .set(updateData)
      .where(eq(workOrders.id, parseInt(id)))
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

    // Check if work order exists
    const existingWorkOrder = await db
      .select()
      .from(workOrders)
      .where(eq(workOrders.id, parseInt(id)))
      .limit(1);

    if (existingWorkOrder.length === 0) {
      return NextResponse.json(
        { error: 'Work order not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(workOrders)
      .where(eq(workOrders.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Work order deleted successfully',
        workOrder: deleted[0],
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