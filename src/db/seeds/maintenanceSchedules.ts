import { db } from '@/db';
import { maintenanceSchedules } from '@/db/schema';

async function main() {
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    const sampleSchedules = [
        // Equipment 1 - 2 schedules
        {
            equipmentId: 1,
            title: 'Annual Safety Inspection',
            description: 'Comprehensive safety inspection including electrical testing, mechanical checks, and performance verification according to manufacturer specifications',
            frequency: 'annual',
            frequencyDays: 365,
            lastPerformed: now - (30 * DAY_MS),
            nextDue: now - (30 * DAY_MS) + (365 * DAY_MS),
            priority: 'critical',
            estimatedDuration: 240,
            assignedTo: 'John Smith',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },
        {
            equipmentId: 1,
            title: 'Quarterly Calibration Check',
            description: 'Precision calibration verification to ensure accurate measurements and optimal performance standards',
            frequency: 'quarterly',
            frequencyDays: 90,
            lastPerformed: now - (45 * DAY_MS),
            nextDue: now - (45 * DAY_MS) + (90 * DAY_MS),
            priority: 'high',
            estimatedDuration: 120,
            assignedTo: 'Sarah Johnson',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 2 - 2 schedules
        {
            equipmentId: 2,
            title: 'Monthly Performance Verification',
            description: 'Complete performance testing and validation of all operational parameters against baseline specifications',
            frequency: 'monthly',
            frequencyDays: 30,
            lastPerformed: now - (15 * DAY_MS),
            nextDue: now - (15 * DAY_MS) + (30 * DAY_MS),
            priority: 'high',
            estimatedDuration: 90,
            assignedTo: 'Mike Chen',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },
        {
            equipmentId: 2,
            title: 'Weekly Visual Inspection',
            description: 'Routine visual inspection for wear, damage, leaks, and general condition assessment',
            frequency: 'weekly',
            frequencyDays: 7,
            lastPerformed: now - (3 * DAY_MS),
            nextDue: now - (3 * DAY_MS) + (7 * DAY_MS),
            priority: 'medium',
            estimatedDuration: 30,
            assignedTo: 'Emily Davis',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 3 - 2 schedules
        {
            equipmentId: 3,
            title: 'Preventive Maintenance Service',
            description: 'Comprehensive preventive maintenance including lubrication, adjustment, and component inspection',
            frequency: 'quarterly',
            frequencyDays: 90,
            lastPerformed: now - (60 * DAY_MS),
            nextDue: now - (60 * DAY_MS) + (90 * DAY_MS),
            priority: 'high',
            estimatedDuration: 180,
            assignedTo: 'Robert Wilson',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },
        {
            equipmentId: 3,
            title: 'Filter Replacement',
            description: 'Replace air filters and clean intake systems to maintain optimal airflow and efficiency',
            frequency: 'monthly',
            frequencyDays: 30,
            lastPerformed: now - (20 * DAY_MS),
            nextDue: now - (20 * DAY_MS) + (30 * DAY_MS),
            priority: 'medium',
            estimatedDuration: 60,
            assignedTo: 'John Smith',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 4 - 2 schedules
        {
            equipmentId: 4,
            title: 'Electrical Safety Testing',
            description: 'Complete electrical safety testing including ground continuity, insulation resistance, and leakage current measurements',
            frequency: 'semi_annual',
            frequencyDays: 180,
            lastPerformed: now - (90 * DAY_MS),
            nextDue: now - (90 * DAY_MS) + (180 * DAY_MS),
            priority: 'critical',
            estimatedDuration: 120,
            assignedTo: 'Sarah Johnson',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },
        {
            equipmentId: 4,
            title: 'Monthly Lubrication Service',
            description: 'Lubricate all moving parts and bearings according to maintenance schedule',
            frequency: 'monthly',
            frequencyDays: 30,
            lastPerformed: now - (10 * DAY_MS),
            nextDue: now - (10 * DAY_MS) + (30 * DAY_MS),
            priority: 'medium',
            estimatedDuration: 45,
            assignedTo: 'Mike Chen',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 5 - 1 schedule
        {
            equipmentId: 5,
            title: 'Accuracy Calibration',
            description: 'Precision calibration and accuracy verification using certified standards and measurement equipment',
            frequency: 'quarterly',
            frequencyDays: 90,
            lastPerformed: now - (75 * DAY_MS),
            nextDue: now - (75 * DAY_MS) + (90 * DAY_MS),
            priority: 'critical',
            estimatedDuration: 150,
            assignedTo: 'Emily Davis',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 6 - 1 schedule
        {
            equipmentId: 6,
            title: 'Semi-Annual Deep Clean',
            description: 'Thorough cleaning and decontamination of all surfaces and internal components',
            frequency: 'semi_annual',
            frequencyDays: 180,
            lastPerformed: now - (120 * DAY_MS),
            nextDue: now - (120 * DAY_MS) + (180 * DAY_MS),
            priority: 'medium',
            estimatedDuration: 180,
            assignedTo: 'Robert Wilson',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 7 - 1 schedule
        {
            equipmentId: 7,
            title: 'Annual Certification Review',
            description: 'Complete certification review and compliance verification with regulatory standards',
            frequency: 'annual',
            frequencyDays: 365,
            lastPerformed: now - (180 * DAY_MS),
            nextDue: now - (180 * DAY_MS) + (365 * DAY_MS),
            priority: 'high',
            estimatedDuration: 240,
            assignedTo: 'John Smith',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 8 - 1 schedule
        {
            equipmentId: 8,
            title: 'Monthly Operational Check',
            description: 'Verify all operational functions, controls, and safety interlocks are working correctly',
            frequency: 'monthly',
            frequencyDays: 30,
            lastPerformed: now - (25 * DAY_MS),
            nextDue: now - (25 * DAY_MS) + (30 * DAY_MS),
            priority: 'high',
            estimatedDuration: 60,
            assignedTo: 'Sarah Johnson',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 9 - 1 schedule
        {
            equipmentId: 9,
            title: 'Quarterly System Update',
            description: 'Software updates, firmware upgrades, and system configuration backup',
            frequency: 'quarterly',
            frequencyDays: 90,
            lastPerformed: now - (50 * DAY_MS),
            nextDue: now - (50 * DAY_MS) + (90 * DAY_MS),
            priority: 'low',
            estimatedDuration: 90,
            assignedTo: 'Mike Chen',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 10 - 1 schedule
        {
            equipmentId: 10,
            title: 'Weekly Functionality Test',
            description: 'Quick functionality test of all primary systems and emergency protocols',
            frequency: 'weekly',
            frequencyDays: 7,
            lastPerformed: now - (5 * DAY_MS),
            nextDue: now - (5 * DAY_MS) + (7 * DAY_MS),
            priority: 'low',
            estimatedDuration: 30,
            assignedTo: 'Emily Davis',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 11 - 1 schedule
        {
            equipmentId: 11,
            title: 'Semi-Annual Component Replacement',
            description: 'Replace wear components including seals, gaskets, and consumable parts',
            frequency: 'semi_annual',
            frequencyDays: 180,
            lastPerformed: now - (150 * DAY_MS),
            nextDue: now - (150 * DAY_MS) + (180 * DAY_MS),
            priority: 'high',
            estimatedDuration: 120,
            assignedTo: 'Robert Wilson',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },

        // Equipment 12 - 1 schedule
        {
            equipmentId: 12,
            title: 'Annual Performance Audit',
            description: 'Comprehensive performance audit including efficiency testing and benchmark comparison',
            frequency: 'annual',
            frequencyDays: 365,
            lastPerformed: now - (100 * DAY_MS),
            nextDue: now - (100 * DAY_MS) + (365 * DAY_MS),
            priority: 'critical',
            estimatedDuration: 240,
            assignedTo: 'John Smith',
            isActive: 1,
            createdAt: now,
            updatedAt: now,
        },
    ];

    await db.insert(maintenanceSchedules).values(sampleSchedules);
    
    console.log('✅ Maintenance schedules seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});