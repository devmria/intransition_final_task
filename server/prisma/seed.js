"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    // Create predefined categories
    const categories = [
        'Equipment',
        'Furniture',
        'Books',
        'Documents',
    ];
    for (const categoryName of categories) {
        await prisma.category.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName }
        });
    }
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
