import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { equipment } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(equipment)
        .where(eq(equipment.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Equipment not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const location = searchParams.get('location');

    let query = db.select().from(equipment);

    // Build filter conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(equipment.status, status));
    }

    if (category) {
      conditions.push(eq(equipment.category, category));
    }

    if (location) {
      conditions.push(eq(equipment.location, location));
    }

    if (search) {
      const searchCondition = or(
        like(equipment.name, `%${search}%`),
        like(equipment.model, `%${search}%`),
        like(equipment.manufacturer, `%${search}%`),
        like(equipment.serialNumber, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(equipment.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Sanitize and prepare data
    const now = Date.now();
    const insertData = {
      name: body.name.trim(),
      model: body.model ? body.model.trim() : null,
      serialNumber: body.serialNumber ? body.serialNumber.trim() : null,
      manufacturer: body.manufacturer ? body.manufacturer.trim() : null,
      category: body.category ? body.category.trim() : null,
      location: body.location ? body.location.trim() : null,
      status: body.status || 'operational',
      purchaseDate: body.purchaseDate || null,
      warrantyExpiry: body.warrantyExpiry || null,
      lastMaintenance: body.lastMaintenance || null,
      nextMaintenance: body.nextMaintenance || null,
      notes: body.notes ? body.notes.trim() : null,
      createdAt: now,
      updatedAt: now,
    };

    const newRecord = await db.insert(equipment)
      .values(insertData)
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    
    // Handle unique constraint violation for serial number
    if ((error as Error).message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ 
        error: 'Serial number already exists',
        code: 'DUPLICATE_SERIAL_NUMBER' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();

    // Check if record exists
    const existing = await db.select()
      .from(equipment)
      .where(eq(equipment.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Equipment not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (body.name !== undefined) {
      if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
        return NextResponse.json({ 
          error: "Name must be a non-empty string",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updateData.name = body.name.trim();
    }

    if (body.model !== undefined) {
      updateData.model = body.model ? body.model.trim() : null;
    }

    if (body.serialNumber !== undefined) {
      updateData.serialNumber = body.serialNumber ? body.serialNumber.trim() : null;
    }

    if (body.manufacturer !== undefined) {
      updateData.manufacturer = body.manufacturer ? body.manufacturer.trim() : null;
    }

    if (body.category !== undefined) {
      updateData.category = body.category ? body.category.trim() : null;
    }

    if (body.location !== undefined) {
      updateData.location = body.location ? body.location.trim() : null;
    }

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.purchaseDate !== undefined) {
      updateData.purchaseDate = body.purchaseDate;
    }

    if (body.warrantyExpiry !== undefined) {
      updateData.warrantyExpiry = body.warrantyExpiry;
    }

    if (body.lastMaintenance !== undefined) {
      updateData.lastMaintenance = body.lastMaintenance;
    }

    if (body.nextMaintenance !== undefined) {
      updateData.nextMaintenance = body.nextMaintenance;
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes ? body.notes.trim() : null;
    }

    const updated = await db.update(equipment)
      .set(updateData)
      .where(eq(equipment.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    
    // Handle unique constraint violation for serial number
    if ((error as Error).message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ 
        error: 'Serial number already exists',
        code: 'DUPLICATE_SERIAL_NUMBER' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(equipment)
      .where(eq(equipment.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Equipment not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(equipment)
      .where(eq(equipment.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Equipment deleted successfully',
      data: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    
    // Handle foreign key constraint violation
    if ((error as Error).message.includes('FOREIGN KEY constraint failed')) {
      return NextResponse.json({ 
        error: 'Cannot delete equipment with associated maintenance records or work orders',
        code: 'FOREIGN_KEY_CONSTRAINT' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}