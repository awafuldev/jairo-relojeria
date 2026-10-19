export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import HomeClient from '@/components/HomeClient'

const FALLBACK_WATCHES = [
  {
    id: 'watch-seiko-sub-black',
    slug: 'seiko-mod-submariner-black-date',
    name: 'Seiko Mod Submariner Date Black',
    reference: 'JR-SUB-40BK',
    description: 'Reloj de buceo personalizado con bisel cerámico unidireccional de 120 clics, esfera negra mate con índices aplicados Super-LumiNova BGW9 y datario con lente cíclope magnificadora.',
    price: 395.0,
    stock: 3,
    isAvailable: true,
    isFeatured: true,
    caliber: 'Seiko NH35A Automático (24 joyas, 21.600 vph, remonte manual y parada de segundero)',
    caseSize: '40mm (Grosor 13mm, Asas 20mm)',
    waterResist: '100M / 10 ATM (Corona y fondo roscados con junta doble)',
    glass: 'Cristal de zafiro plano con tratamiento antirreflejos interior',
    bracelet: 'Brazalete Oyster en acero inoxidable 316L con cierre GlideLock',
    mainImage: '/images/products/case-sub-40-steel.png',
  },
  {
    id: 'watch-seiko-gmt-batman',
    slug: 'seiko-mod-gmt-batman-nh34',
    name: 'Seiko Mod GMT Dual Time "Batman"',
    reference: 'JR-GMT-40BM',
    description: 'Complicación de segundo huso horario independiente impulsada por el calibre Seiko NH34. Bisel cerámico graduado 24 horas bicolor negro y azul con aguja GMT de ajuste rápido.',
    price: 440.0,
    stock: 2,
    isAvailable: true,
    isFeatured: true,
    caliber: 'Seiko NH34 GMT Automático (4 agujas independientes, fechador, reserva de 41 horas)',
    caseSize: '40mm (Grosor 13.5mm, Asas 20mm)',
    waterResist: '100M / 10 ATM con prueba hidrostática individual',
    glass: 'Zafiro con lupa cíclope sobre fecha a las 3',
    bracelet: 'Brazalete Jubilee de 5 eslabones en acero 316L satinado y pulido',
    mainImage: '/images/products/movement-nh34-gmt.png',
  },
  {
    id: 'watch-seiko-datejust-silver',
    slug: 'seiko-mod-datejust-36-fluted',
    name: 'Seiko Mod Datejust 36mm Fluted',
    reference: 'JR-DJ-36SV',
    description: 'Elegancia clásica con proporciones atemporales. Caja de 36mm con bisel estriado pulido a espejo, esfera con acabado sol y brazalete Jubilee con eslabones centrales brillantes.',
    price: 380.0,
    stock: 4,
    isAvailable: true,
    isFeatured: true,
    caliber: 'Seiko NH35A Automático con regulación en cronocomparador',
    caseSize: '36mm (Grosor 12mm, Asas 20mm)',
    waterResist: '50M / 5 ATM',
    glass: 'Cristal de zafiro resistente a rayaduras con cíclope de fecha',
    bracelet: 'Brazalete Jubilee 5 eslabones en acero inoxidable 316L',
    mainImage: '/images/products/case-datejust-36-rg.png',
  },
  {
    id: 'watch-seiko-explorer-39',
    slug: 'seiko-mod-explorer-39-black',
    name: 'Seiko Mod Explorer 39mm Tool Watch',
    reference: 'JR-EXP-39BK',
    description: 'Diseño sobrio y máxima legibilidad instrumental. Esfera negra profunda con números icónicos 3-6-9 aplicados, agujas Mercedes y caja cepillada resistente a impactos.',
    price: 360.0,
    stock: 2,
    isAvailable: true,
    isFeatured: true,
    caliber: 'Seiko NH38 Automático (Calibre No-Date con corona de 2 posiciones sin posición fantasma)',
    caseSize: '39mm (Grosor 12.5mm, Asas 20mm)',
    waterResist: '100M / 10 ATM',
    glass: 'Zafiro plano con bisel interior escalonado',
    bracelet: 'Brazalete Oyster cepillado mate con cierre desplegable de seguridad',
    mainImage: '/images/products/case-explorer-39.png',
  }
]

export default async function HomePage() {
  try {
    const rawWatches = await prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM "WatchProduct"
      WHERE "isAvailable" = 1
      ORDER BY "isFeatured" DESC, "createdAt" DESC
    `)

    if (rawWatches && rawWatches.length > 0) {
      const seikoWatches = rawWatches.map(w => ({
        ...w,
        isAvailable: Boolean(w.isAvailable),
        isFeatured: Boolean(w.isFeatured),
      }))
      return <HomeClient watches={seikoWatches} />
    }
  } catch (error) {
    console.error('Database query fallback:', error)
  }

  return <HomeClient watches={FALLBACK_WATCHES} />
}
