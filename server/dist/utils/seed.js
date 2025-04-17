"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function main() {
    console.log('Resetting database and seeding initial data...');
    // Reset auto-increment IDs for all tables
    await prisma.$executeRaw `TRUNCATE TABLE "Plan" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw `TRUNCATE TABLE "Owner" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw `TRUNCATE TABLE "Driver" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw `TRUNCATE TABLE "Vehicle" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw `TRUNCATE TABLE "NotificationLog" RESTART IDENTITY CASCADE`;
    // Seed Plans
    const bronzePlan = await prisma.plan.create({
        data: { name: 'Bronze', price: 10.0 },
    });
    const silverPlan = await prisma.plan.create({
        data: { name: 'Silver', price: 20.0 },
    });
    const goldPlan = await prisma.plan.create({
        data: { name: 'Gold', price: 30.0 },
    });
    // Seed Owners
    const owner1 = await prisma.owner.create({
        data: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            adhaar: '123456789012',
            planId: bronzePlan.id,
        },
    });
    // Seed Drivers
    const driver1 = await prisma.driver.create({
        data: {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            password: 'password123',
            licenseNo: 'DL123456',
            licenseValidUpto: new Date('2025-12-31'),
            vehicleClass: 'LMV',
            adhaar: '987654321098',
            ownerId: owner1.id,
        },
    });
    // Seed Vehicles
    const vehicle1 = await prisma.vehicle.create({
        data: {
            chassisNo: 'CH123456',
            engineNo: 'EN123456',
            regdNo: 'MH12AB1234',
            fuelType: 'Petrol',
            insuranceCompany: 'ABC Insurance',
            insurancePolicyNo: 'INS123456',
            insuranceValidUpto: new Date('2024-12-31'),
            puccNo: 'PUC123456',
            puccValidUpto: new Date('2024-06-30'),
            ownerId: owner1.id,
        },
    });
    // Seed Notifications
    await prisma.notificationLog.create({
        data: {
            vehicleId: vehicle1.id,
            ownerId: owner1.id,
            driverId: driver1.id,
            message: 'Your vehicle insurance is about to expire.',
        },
    });
    console.log('Database seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
