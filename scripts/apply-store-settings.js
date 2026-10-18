const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Creating StoreSetting table if not exists...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "StoreSetting" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "key" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "StoreSetting_key_key" ON "StoreSetting"("key");
  `);
  console.log('StoreSetting table and index ensured successfully.');
  
  // Seed default settings if empty
  const count = await prisma.$queryRawUnsafe(`SELECT count(*) as count FROM "StoreSetting"`);
  console.log('Current store settings count:', count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
