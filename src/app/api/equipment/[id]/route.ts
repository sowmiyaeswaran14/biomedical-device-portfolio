import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { equipment } from '@/db/schema';
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

    const equipmentId = parseInt(id);

    // Fetch single equipment record
    const result = await db
      .select()
      .from(equipment)
      .where(eq(equipment.id, equipmentId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
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

    const equipmentId = parseInt(id);

    // Check if equipment exists
    const existing = await db
      .select()
      .from(equipment)
      .where(eq(equipment.id, equipmentId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Prepare update data
    const updateData: any = {
      updatedAt: Date.now(),
    };

    // Add optional fields if provided
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.model !== undefined) updateData.model = body.model?.trim() || null;
    if (body.serialNumber !== undefined) updateData.serialNumber = body.serialNumber?.trim() || null;
    if (body.manufacturer !== undefined) updateData.manufacturer = body.manufacturer?.trim() || null;
    if (body.category !== undefined) updateData.category = body.category?.trim() || null;
    if (body.location !== undefined) updateData.location = body.location?.trim() || null;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.purchaseDate !== undefined) updateData.purchaseDate = body.purchaseDate;
    if (body.warrantyExpiry !== undefined) updateData.warrantyExpiry = body.warrantyExpiry;
    if (body.lastMaintenance !== undefined) updateData.lastMaintenance = body.lastMaintenance;
    if (body.nextMaintenance !== undefined) updateData.nextMaintenance = body.nextMaintenance;
    if (body.notes !== undefined) updateData.notes = body.notes?.trim() || null;

    // Update equipment
    const updated = await db
      .update(equipment)
      .set(updateData)
      .where(eq(equipment.id, equipmentId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update equipment', code: 'UPDATE_FAILED' },
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

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const equipmentId = parseInt(id);

    // Check if equipment exists
    const existing = await db
      .select()
      .from(equipment)
      .where(eq(equipment.id, equipmentId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete equipment
    const deleted = await db
      .delete(equipment)
      .where(eq(equipment.id, equipmentId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete equipment', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Equipment deleted successfully',
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