const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()
p.category.findMany({ select: { name: true, slug: true, isRequired: true } })
  .then(r => {
    console.log(JSON.stringify(r, null, 2))
    return p.$disconnect()
  })
  .catch(e => { console.error(e); process.exit(1) })
