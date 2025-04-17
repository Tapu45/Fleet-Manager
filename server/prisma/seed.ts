import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.createMany({
    data: [
        { id: 1, name: 'Bronze', price: 1 },
        { id: 2, name: 'Silver', price: 2 },
        { id: 3, name: 'Gold', price: 5},
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