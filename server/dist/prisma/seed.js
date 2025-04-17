"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function main() {
    await prisma.plan.createMany({
        data: [
            { id: 1, name: 'Bronze', price: 1 },
            { id: 2, name: 'Silver', price: 2 },
            { id: 3, name: 'Gold', price: 5 },
        ],
        skipDuplicates: true, // Avoid creating duplicates
    });
    console.log('Plans seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
