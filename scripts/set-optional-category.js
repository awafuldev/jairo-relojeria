const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.category.update({ where: { slug: 'chapter-ring' }, data: { isRequired: false } })
  .then(r => {
    console.log('chapter-ring is now isRequired =', r.isRequired);
    return p.$disconnect();
  })
  .catch(err => {
    console.error(err);
    return p.$disconnect();
  });
