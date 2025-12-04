import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { equipment, maintenanceSchedules, maintenanceLogs, workOrders } from '@/db/schema';
import { eq, and, lte, gte, or, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Calculate date ranges
    const now = Date.now();
    const thirtyDaysFromNow = now + (30 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    // 1. Equipment by status - using sql aggregation for grouping
    const equipmentStatusCounts = await db
      .select({
        status: equipment.status,
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(equipment)
      .groupBy(equipment.status);

    // Transform to object with all statuses
    const equipmentByStatus = {
      operational: 0,
      maintenance: 0,
      out_of_service: 0,
      retired: 0,
    };

    equipmentStatusCounts.forEach((row) => {
      if (row.status && row.status in equipmentByStatus) {
        equipmentByStatus[row.status as keyof typeof equipmentByStatus] = row.count;
      }
    });

    // 2. Total equipment count
    const totalEquipmentResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(equipment);
    const totalEquipment = totalEquipmentResult[0]?.count || 0;

    // 3. Upcoming maintenance (next 30 days)
    const upcomingMaintenanceResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(maintenanceSchedules)
      .where(
        and(
          gte(maintenanceSchedules.nextDue, now),
          lte(maintenanceSchedules.nextDue, thirtyDaysFromNow)
        )
      );
    const upcomingMaintenance = upcomingMaintenanceResult[0]?.count || 0;

    // 4. Overdue maintenance (past due)
    const overdueMaintenanceResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(maintenanceSchedules)
      .where(lte(maintenanceSchedules.nextDue, now));
    const overdueMaintenance = overdueMaintenanceResult[0]?.count || 0;

    // 5. Recent logs (last 30 days)
    const recentLogsResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(maintenanceLogs)
      .where(gte(maintenanceLogs.createdAt, thirtyDaysAgo));
    const recentLogs = recentLogsResult[0]?.count || 0;

    // 6. Active work orders (pending or in_progress)
    const activeWorkOrdersResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(workOrders)
      .where(
        or(
          eq(workOrders.status, 'pending'),
          eq(workOrders.status, 'in_progress')
        )
      );
    const activeWorkOrders = activeWorkOrdersResult[0]?.count || 0;

    // Return aggregated statistics
    return NextResponse.json({
      equipmentByStatus,
      totalEquipment,
      upcomingMaintenance,
      overdueMaintenance,
      recentLogs,
      activeWorkOrders,
    }, { status: 200 });

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