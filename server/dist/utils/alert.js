"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerVehicleAlerts = void 0;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const triggerVehicleAlerts = async () => {
    console.log('Running vehicle validity alert job...');
    try {
        const currentDate = new Date();
        const alertDate = new Date();
        alertDate.setMonth(alertDate.getMonth() + 1);
        const vehicles = await prisma.vehicle.findMany({
            where: {
                OR: [
                    { insuranceValidUpto: { lte: alertDate, gte: currentDate } },
                    { puccValidUpto: { lte: alertDate, gte: currentDate } },
                ],
            },
            include: {
                owner: true,
                driver: true,
            },
        });
        for (const vehicle of vehicles) {
            const vehicleRegdNo = vehicle.regdNo;
            const expiringDocuments = [];
            if (vehicle.insuranceValidUpto && vehicle.insuranceValidUpto <= alertDate) {
                expiringDocuments.push({
                    type: 'Insurance',
                    date: vehicle.insuranceValidUpto.toDateString(),
                });
            }
            if (vehicle.puccValidUpto && vehicle.puccValidUpto <= alertDate) {
                expiringDocuments.push({
                    type: 'PUCC',
                    date: vehicle.puccValidUpto.toDateString(),
                });
            }
            if (expiringDocuments.length === 0)
                continue;
            let messageContent = `Dear Concerned,\n\nYour vehicle with registration number ${vehicleRegdNo} has the following document(s) expiring soon:\n\n`;
            expiringDocuments.forEach((doc) => {
                messageContent += `- ${doc.type} validity expiring on ${doc.date}\n`;
            });
            messageContent += `\nPlease take the necessary action to renew these documents.\n\nThank you,\nFleet Manager`;
            // Log the notification in the database for the owner
            await prisma.notificationLog.create({
                data: {
                    vehicleId: vehicle.id,
                    ownerId: vehicle.owner.id,
                    message: messageContent,
                },
            });
            // Log the notification in the database for the driver (if applicable)
            if (vehicle.driver && vehicle.driver.email) {
                await prisma.notificationLog.create({
                    data: {
                        vehicleId: vehicle.id,
                        ownerId: vehicle.owner.id,
                        driverId: vehicle.driver.id,
                        message: messageContent,
                    },
                });
            }
        }
        console.log('Vehicle validity alert job completed.');
    }
    catch (error) {
        console.error('Error running vehicle validity alert job:', error);
    }
};
exports.triggerVehicleAlerts = triggerVehicleAlerts;
