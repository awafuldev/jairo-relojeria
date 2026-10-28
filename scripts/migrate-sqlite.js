const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Checking and applying SQLite migrations...')

  // Check columns on Configuration
  const tableInfo = await prisma.$queryRawUnsafe("PRAGMA table_info('Configuration')")
  const columnNames = tableInfo.map(c => c.name)
  console.log('Current Configuration columns:', columnNames)

  const columnsToAdd = [
    { name: 'clientName', type: 'TEXT' },
    { name: 'clientEmail', type: 'TEXT' },
    { name: 'clientPhone', type: 'TEXT' },
    { name: 'clientNotes', type: 'TEXT' },
    { name: 'adminNotes', type: 'TEXT' },
  ]

  for (const col of columnsToAdd) {
    if (!columnNames.includes(col.name)) {
      console.log(`Adding column ${col.name}...`)
      await prisma.$executeRawUnsafe(`ALTER TABLE "Configuration" ADD COLUMN "${col.name}" ${col.type}`)
    } else {
      console.log(`Column ${col.name} already exists.`)
    }
  }

  // Create ConfigurationStatusLog table if not exists
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ConfigurationStatusLog" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "configurationId" TEXT NOT NULL,
      "fromStatus" TEXT,
      "toStatus" TEXT NOT NULL,
      "note" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ConfigurationStatusLog_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `)
  console.log('ConfigurationStatusLog table verified.')

  const count = await prisma.configuration.count()
  console.log(`Total existing configurations preserved: ${count}`)
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
