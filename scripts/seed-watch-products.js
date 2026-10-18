const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Ensuring WatchProduct table exists in SQLite...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "WatchProduct" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "reference" TEXT,
      "description" TEXT,
      "price" REAL NOT NULL,
      "stock" INTEGER NOT NULL DEFAULT 1,
      "isAvailable" BOOLEAN NOT NULL DEFAULT 1,
      "isFeatured" BOOLEAN NOT NULL DEFAULT 0,
      "caliber" TEXT,
      "caseSize" TEXT,
      "waterResist" TEXT,
      "glass" TEXT,
      "bracelet" TEXT,
      "mainImage" TEXT NOT NULL,
      "gallery" TEXT NOT NULL DEFAULT '[]',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "WatchProduct_slug_key" ON "WatchProduct"("slug");
  `);

  console.log('WatchProduct table verified.');

  const watches = [
    {
      id: 'watch-seiko-sub-black',
      slug: 'seiko-mod-submariner-black-date',
      name: 'Seiko Mod Submariner Date Black',
      reference: 'JR-SUB-40BK',
      description: 'Reloj de buceo personalizado con bisel cerámico unidireccional de 120 clics, esfera negra mate con índices aplicados Super-LumiNova BGW9 y datario con lente cíclope magnificadora.',
      price: 395.0,
      stock: 3,
      isAvailable: 1,
      isFeatured: 1,
      caliber: 'Seiko NH35A Automático (24 joyas, 21.600 vph, remonte manual y parada de segundero)',
      caseSize: '40mm (Grosor 13mm, Asas 20mm)',
      waterResist: '100M / 10 ATM (Corona y fondo roscados con junta doble)',
      glass: 'Cristal de zafiro plano con tratamiento antirreflejos interior',
      bracelet: 'Brazalete Oyster en acero inoxidable 316L con cierre GlideLock',
      mainImage: '/images/products/case-sub-40-steel.png',
      gallery: JSON.stringify([
        '/images/products/case-sub-40-steel.png',
        '/images/products/dial-sub-black.png',
        '/images/products/movement-nh35.png'
      ])
    },
    {
      id: 'watch-seiko-gmt-batman',
      slug: 'seiko-mod-gmt-batman-nh34',
      name: 'Seiko Mod GMT Dual Time "Batman"',
      reference: 'JR-GMT-40BM',
      description: 'Complicación de segundo huso horario independiente impulsada por el calibre Seiko NH34. Bisel cerámico graduado 24 horas bicolor negro y azul con aguja GMT de ajuste rápido.',
      price: 440.0,
      stock: 2,
      isAvailable: 1,
      isFeatured: 1,
      caliber: 'Seiko NH34 GMT Automático (4 agujas independientes, fechador, reserva de 41 horas)',
      caseSize: '40mm (Grosor 13.5mm, Asas 20mm)',
      waterResist: '100M / 10 ATM con prueba hidrostática individual',
      glass: 'Zafiro con lupa cíclope sobre fecha a las 3',
      bracelet: 'Brazalete Jubilee de 5 eslabones en acero 316L satinado y pulido',
      mainImage: '/images/products/movement-nh34-gmt.png',
      gallery: JSON.stringify([
        '/images/products/movement-nh34-gmt.png',
        '/images/products/case-sub-40-steel.png'
      ])
    },
    {
      id: 'watch-seiko-datejust-silver',
      slug: 'seiko-mod-datejust-36-fluted',
      name: 'Seiko Mod Datejust 36mm Fluted',
      reference: 'JR-DJ-36SV',
      description: 'Elegancia clásica con proporciones atemporales. Caja de 36mm con bisel estriado pulido a espejo, esfera con acabado sol y brazalete Jubilee con eslabones centrales brillantes.',
      price: 380.0,
      stock: 4,
      isAvailable: 1,
      isFeatured: 1,
      caliber: 'Seiko NH35A Automático con regulación en cronocomparador',
      caseSize: '36mm (Grosor 12mm, Asas 20mm)',
      waterResist: '50M / 5 ATM',
      glass: 'Cristal de zafiro resistente a rayaduras con cíclope de fecha',
      bracelet: 'Brazalete Jubilee 5 eslabones en acero inoxidable 316L',
      mainImage: '/images/products/case-datejust-36-rg.png',
      gallery: JSON.stringify([
        '/images/products/case-datejust-36-rg.png',
        '/images/products/movement-nh35.png'
      ])
    },
    {
      id: 'watch-seiko-explorer-39',
      slug: 'seiko-mod-explorer-39-black',
      name: 'Seiko Mod Explorer 39mm Tool Watch',
      reference: 'JR-EXP-39BK',
      description: 'Diseño sobrio y máxima legibilidad instrumental. Esfera negra profunda con números icónicos 3-6-9 aplicados, agujas Mercedes y caja cepillada resistente a impactos.',
      price: 360.0,
      stock: 2,
      isAvailable: 1,
      isFeatured: 1,
      caliber: 'Seiko NH38 Automático (Calibre No-Date con corona de 2 posiciones sin posición fantasma)',
      caseSize: '39mm (Grosor 12.5mm, Asas 20mm)',
      waterResist: '100M / 10 ATM',
      glass: 'Zafiro plano con bisel interior escalonado',
      bracelet: 'Brazalete Oyster cepillado mate con cierre desplegable de seguridad',
      mainImage: '/images/products/case-explorer-39.png',
      gallery: JSON.stringify([
        '/images/products/case-explorer-39.png',
        '/images/products/movement-nh38-skeleton.png'
      ])
    },
    {
      id: 'watch-seiko-skx007-custom',
      slug: 'seiko-mod-skx007-custom-diver',
      name: 'Seiko Mod SKX Custom Diver 42mm',
      reference: 'JR-SKX-42DV',
      description: 'Homenaje al diver más legendario de Seiko con corona ergonómica a las 4. Actualizado con bisel insert de cerámica pulida, insert luminiscente y calibre automático de remonte manual.',
      price: 410.0,
      stock: 2,
      isAvailable: 1,
      isFeatured: 0,
      caliber: 'Seiko NH36A Automático (Doble calendario Día/Fecha en español e inglés)',
      caseSize: '42mm (Grosor 13.5mm, Asas 22mm)',
      waterResist: '200M / 20 ATM Diver Test',
      glass: 'Cristal de zafiro Double Domed (doble cúpula) con reflejo azul',
      bracelet: 'Correa de caucho vulcanizado FKM de alta durabilidad',
      mainImage: '/images/products/case-skx-42.png',
      gallery: JSON.stringify([
        '/images/products/case-skx-42.png'
      ])
    },
    {
      id: 'watch-seiko-tactical-pvd',
      slug: 'seiko-mod-submariner-stealth-pvd',
      name: 'Seiko Mod Stealth Tactical PVD 40mm',
      reference: 'JR-SUB-40PVD',
      description: 'Estética monocromática táctica. Caja y brazalete íntegramente tratados con revestimiento PVD negro mate de alta resistencia al desgaste y esfera mate con luminiscencia nocturna.',
      price: 420.0,
      stock: 1,
      isAvailable: 1,
      isFeatured: 0,
      caliber: 'Seiko NH35A Automático',
      caseSize: '40mm (Grosor 13mm, Asas 20mm)',
      waterResist: '100M / 10 ATM',
      glass: 'Zafiro plano con tratamiento AR interior',
      bracelet: 'Brazalete Oyster en acero con tratamiento PVD negro integral',
      mainImage: '/images/products/case-sub-40-pvd.png',
      gallery: JSON.stringify([
        '/images/products/case-sub-40-pvd.png'
      ])
    }
  ];

  for (const w of watches) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "WatchProduct" (
        "id", "slug", "name", "reference", "description", "price",
        "stock", "isAvailable", "isFeatured", "caliber", "caseSize",
        "waterResist", "glass", "bracelet", "mainImage", "gallery"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      )
      ON CONFLICT("slug") DO UPDATE SET
        "name" = excluded."name",
        "reference" = excluded."reference",
        "description" = excluded."description",
        "price" = excluded."price",
        "stock" = excluded."stock",
        "isAvailable" = excluded."isAvailable",
        "isFeatured" = excluded."isFeatured",
        "caliber" = excluded."caliber",
        "caseSize" = excluded."caseSize",
        "waterResist" = excluded."waterResist",
        "glass" = excluded."glass",
        "bracelet" = excluded."bracelet",
        "mainImage" = excluded."mainImage",
        "gallery" = excluded."gallery",
        "updatedAt" = CURRENT_TIMESTAMP;
    `,
      w.id, w.slug, w.name, w.reference, w.description, w.price,
      w.stock, w.isAvailable, w.isFeatured, w.caliber, w.caseSize,
      w.waterResist, w.glass, w.bracelet, w.mainImage, w.gallery
    );
  }

  const result = await prisma.$queryRawUnsafe(`SELECT count(*) as count FROM "WatchProduct"`);
  console.log('Seeded Seiko watches in WatchProduct. Total watches:', result[0].count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
