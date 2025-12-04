import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workOrders } from '@/db/schema';
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
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const workOrderId = parseInt(id);

    // Fetch single work order
    const workOrder = await db.select()
      .from(workOrders)
      .where(eq(workOrders.id, workOrderId))
      .limit(1);

    if (workOrder.length === 0) {
      return NextResponse.json(
        { 
          error: 'Work order not found',
          code: 'NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(workOrder[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
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
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const workOrderId = parseInt(id);

    // Check if work order exists
    const existing = await db.select()
      .from(workOrders)
      .where(eq(workOrders.id, workOrderId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { 
          error: 'Work order not found',
          code: 'NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Prepare update data with auto-updated timestamp
    const updateData: any = {
      ...body,
      updatedAt: Date.now()
    };

    // Remove id from update data if present
    delete updateData.id;

    // Update work order
    const updated = await db.update(workOrders)
      .set(updateData)
      .where(eq(workOrders.id, workOrderId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to update work order',
          code: 'UPDATE_FAILED' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
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
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const workOrderId = parseInt(id);

    // Check if work order exists before deleting
    const existing = await db.select()
      .from(workOrders)
      .where(eq(workOrders.id, workOrderId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { 
          error: 'Work order not found',
          code: 'NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Delete work order
    const deleted = await db.delete(workOrders)
      .where(eq(workOrders.id, workOrderId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to delete work order',
          code: 'DELETE_FAILED' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Work order deleted successfully',
        workOrder: deleted[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}