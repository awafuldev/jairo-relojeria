import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Watch Configurator Database (12 Categories, 60+ Pieces, Realistic Rules)...')

  // Clean existing tables in reverse dependency order
  await prisma.configurationItem.deleteMany()
  await prisma.configuration.deleteMany()
  await prisma.compatibilityRule.deleteMany()
  await prisma.pieceAttribute.deleteMany()
  await prisma.pieceImage.deleteMany()
  await prisma.piece.deleteMany()
  await prisma.attributeDefinition.deleteMany()
  await prisma.category.deleteMany()
  await prisma.adminUser.deleteMany()

  // 1. Admin User
  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.adminUser.create({
    data: {
      email: 'admin@chrono.com',
      password: passwordHash,
      name: 'Master Horologist Admin',
    },
  })

  // 2. Technical Attribute Definitions for Compatibility Engine
  const defInputs = [
    { name: 'diameter', label: 'Diámetro de Caja', type: 'number', unit: 'mm' },
    { name: 'lug_width', label: 'Ancho de Asas (Lug Width)', type: 'number', unit: 'mm' },
    { name: 'movement_type', label: 'Tipo de Calibre', type: 'string' },
    { name: 'dial_size', label: 'Tamaño del Dial', type: 'number', unit: 'mm' },
    { name: 'bezel_type', label: 'Tipo de Bisel', type: 'string' },
    { name: 'gmt_supported', label: 'Soporte GMT', type: 'boolean' },
    { name: 'open_heart', label: 'Ventana Open Heart', type: 'boolean' },
  ]
  const a: Record<string, any> = {}
  for (const def of defInputs) {
    a[def.name] = await prisma.attributeDefinition.create({ data: def })
  }

  // 3. The 12 Dynamic Categories (in strict physical assembly step order)
  const catInputs = [
    { name: 'Movement', slug: 'movement', step: 1, layerZIndex: 1, isRequired: true, icon: '⚙️', description: 'El corazón mecánico de tu reloj. Calibres automáticos de manufactura japonesa.' },
    { name: 'Case', slug: 'case', step: 2, layerZIndex: 3, isRequired: true, icon: '⬡', description: 'El chasis arquitectónico. Acero 316L forjado con acabados satinados y pulidos.' },
    { name: 'Dial', slug: 'dial', step: 3, layerZIndex: 5, isRequired: true, icon: '◎', description: 'La esfera frontal. Colores rayos de sol, acabados mate y esferas exóticas.' },
    { name: 'Bezel', slug: 'bezel', step: 4, layerZIndex: 4, isRequired: true, icon: '○', description: 'El bisel exterior. Cerámica brillante con marcas de inmersión o acero estriado.' },
    { name: 'Hands', slug: 'hands', step: 5, layerZIndex: 7, isRequired: true, icon: '⏱', description: 'Manecillas de horas y minutos con tratamiento luminiscente Swiss Super-LumiNova.' },
    { name: 'Second Hand', slug: 'second-hand', step: 6, layerZIndex: 8, isRequired: true, icon: '↗', description: 'El segundero central de barrido continuo. El toque de contraste y dinamismo.' },
    { name: 'Crown', slug: 'crown', step: 7, layerZIndex: 9, isRequired: true, icon: '●', description: 'La corona de cuerda y ajuste horario. Sellado estanco a rosca.' },
    { name: 'Crystal', slug: 'crystal', step: 8, layerZIndex: 10, isRequired: true, icon: '◇', description: 'Cristal de zafiro sintético ultrarresistente con tratamiento antirreflejos.' },
    { name: 'Chapter Ring', slug: 'chapter-ring', step: 9, layerZIndex: 6, isRequired: true, icon: '◌', description: 'El anillo perimetral de minutos que une la esfera con la caja interior.' },
    { name: 'Strap / Bracelet', slug: 'strap', step: 10, layerZIndex: 2, isRequired: true, icon: '≡', description: 'Brazaletes macizos de acero, caucho vulcanizado FKM y cuero italiano.' },
    { name: 'Case Back', slug: 'caseback', step: 11, layerZIndex: 0, isRequired: true, icon: '⊘', description: 'Tapa trasera de fondo ciego o cristal de zafiro transparente de exhibición.' },
    { name: 'Engraving', slug: 'engraving', step: 12, layerZIndex: 11, isRequired: false, icon: '✍', description: 'Personalización láser de alta precisión con tu texto o iniciales en el reloj.' },
  ]
  const c: Record<string, any> = {}
  for (const cat of catInputs) {
    c[cat.slug] = await prisma.category.create({ data: cat })
  }

  const p: Record<string, any> = {}

  // Helper to create piece
  async function addPiece(data: {
    sku: string
    name: string
    categorySlug: string
    price: number
    description: string
    material?: string
    color?: string
    layerFile: string
    layerZIndex?: number
    layerScale?: number
    layerX?: number
    layerY?: number
    layerRotation?: number
    layerOpacity?: number
    stock?: number
    attrs?: Array<{ defId: string; val: string }>
  }) {
    const cat = c[data.categorySlug]
    const baseName = data.layerFile.replace(/\.(svg|png|jpg)$/, '')
    const layerPath = `/images/layers/${baseName}.png`
    const prodPath = `/images/products/${baseName}.png`

    const piece = await prisma.piece.create({
      data: {
        sku: data.sku,
        name: data.name,
        categoryId: cat.id,
        price: data.price,
        description: data.description,
        material: data.material || 'Acero 316L',
        color: data.color || 'Plata',
        stock: data.stock !== undefined ? data.stock : 25,
        compositionImage: layerPath,
        productImage: prodPath,
        thumbnail: prodPath,
        layerImage: layerPath,
        layerZIndex: data.layerZIndex !== undefined ? data.layerZIndex : cat.layerZIndex,
        layerScale: data.layerScale || 1.0,
        layerX: data.layerX || 0,
        layerY: data.layerY || 0,
        layerRotation: data.layerRotation || 0,
        layerOpacity: data.layerOpacity !== undefined ? data.layerOpacity : 1.0,
        images: {
          create: [{ url: prodPath, isPrimary: true, alt: data.name }]
        },
        attributes: data.attrs ? {
          create: data.attrs.map(att => ({
            attributeDefinitionId: att.defId,
            value: att.val,
          }))
        } : undefined
      }
    })
    p[data.sku] = piece
    return piece
  }

  // ── 01. MOVEMENTS (3) ──────────────────────────────────────────────────
  await addPiece({
    sku: 'MOV-NH35', name: 'Seiko NH35A Automático', categorySlug: 'movement', price: 0,
    description: 'Calibre automático icónico de 24 rubíes. Reserva de marcha de 41 horas y parada de segundero (hacking).',
    layerFile: 'movement-nh35.png',
    attrs: [{ defId: a.movement_type.id, val: 'NH35' }, { defId: a.gmt_supported.id, val: 'false' }, { defId: a.open_heart.id, val: 'false' }]
  })
  await addPiece({
    sku: 'MOV-NH34', name: 'Seiko NH34 GMT Automático', categorySlug: 'movement', price: 65,
    description: 'Calibre con 4 manecillas para doble huso horario GMT independiente. 21,600 bph.',
    layerFile: 'movement-nh34-gmt.png',
    attrs: [{ defId: a.movement_type.id, val: 'NH34' }, { defId: a.gmt_supported.id, val: 'true' }, { defId: a.open_heart.id, val: 'false' }]
  })
  await addPiece({
    sku: 'MOV-NH38', name: 'Seiko NH38 Open Heart', categorySlug: 'movement', price: 50,
    description: 'Calibre especial sin fechador diseñado para esferas esqueletizadas o con ventana a las 9.',
    layerFile: 'movement-nh38-skeleton.png',
    attrs: [{ defId: a.movement_type.id, val: 'NH38' }, { defId: a.gmt_supported.id, val: 'false' }, { defId: a.open_heart.id, val: 'true' }]
  })

  // ── 02. CASES (6) ──────────────────────────────────────────────────────
  await addPiece({
    sku: 'CASE-SUB-STEEL', name: 'Submariner 40mm Acero Satinado', categorySlug: 'case', price: 180,
    description: 'Caja sumergible icónica de 40mm con protector de corona y asas de 20mm en acero 316L.',
    layerFile: 'case-sub-40-steel.png',
    attrs: [{ defId: a.diameter.id, val: '40' }, { defId: a.lug_width.id, val: '20' }, { defId: a.bezel_type.id, val: 'diver' }]
  })
  await addPiece({
    sku: 'CASE-SUB-PVD', name: 'Submariner 40mm Black PVD Tactical', categorySlug: 'case', price: 210,
    description: 'Tratamiento PVD negro mate de grado militar resistente a rozaduras y reflejos.',
    color: 'Negro Mate', layerFile: 'case-sub-40-pvd.png',
    attrs: [{ defId: a.diameter.id, val: '40' }, { defId: a.lug_width.id, val: '20' }, { defId: a.bezel_type.id, val: 'diver' }]
  })
  await addPiece({
    sku: 'CASE-EXP-39', name: 'Explorer 39mm Tool Watch', categorySlug: 'case', price: 165,
    description: 'Proporciones clásicas y perfil estilizado para máxima comodidad y versatilidad.',
    layerFile: 'case-explorer-39.png',
    attrs: [{ defId: a.diameter.id, val: '39' }, { defId: a.lug_width.id, val: '20' }, { defId: a.bezel_type.id, val: 'smooth' }]
  })
  await addPiece({
    sku: 'CASE-DJ-36', name: 'Datejust 36mm Oro Rosa Fluted', categorySlug: 'case', price: 240,
    description: 'Elegancia clásica refinada de 36mm con baño PVD en oro rosa 18k.',
    color: 'Oro Rosa', layerFile: 'case-datejust-36-rg.png',
    attrs: [{ defId: a.diameter.id, val: '36' }, { defId: a.lug_width.id, val: '20' }, { defId: a.bezel_type.id, val: 'fluted' }]
  })
  await addPiece({
    sku: 'CASE-SKX-42', name: 'SKX007 42mm Corona a las 4', categorySlug: 'case', price: 175,
    description: 'Caja de buceo profesional de 42mm con corona posicionada ergonómicamente a las 4.',
    layerFile: 'case-skx-42.png',
    attrs: [{ defId: a.diameter.id, val: '42' }, { defId: a.lug_width.id, val: '22' }, { defId: a.bezel_type.id, val: 'diver' }]
  })
  await addPiece({
    sku: 'CASE-DAY-39', name: 'Daytona 39mm Chrono Style', categorySlug: 'case', price: 195,
    description: 'Caja deportiva con protectores y pulsadores decorativos a rosca.',
    layerFile: 'case-daytona-39.png',
    attrs: [{ defId: a.diameter.id, val: '39' }, { defId: a.lug_width.id, val: '20' }, { defId: a.bezel_type.id, val: 'tachymeter' }]
  })

  // ── 03. DIALS (10) ─────────────────────────────────────────────────────
  await addPiece({
    sku: 'DIAL-SUB-BLK', name: 'Submariner Negro Mate con Ventana', categorySlug: 'dial', price: 45,
    description: 'Esfera negra con índices aplicados con oro blanco rellenos de Super-LumiNova BGW9.',
    color: 'Negro', layerFile: 'dial-sub-black.png',
    attrs: [{ defId: a.dial_size.id, val: '28.5' }]
  })
  await addPiece({
    sku: 'DIAL-MAR-BLU', name: 'Marine Azul Rayos de Sol', categorySlug: 'dial', price: 55,
    description: 'Azul cobalto que refleja destellos circulares bajo la luz directa.',
    color: 'Azul', layerFile: 'dial-marine-blue.png',
    attrs: [{ defId: a.dial_size.id, val: '28.5' }]
  })
  await addPiece({
    sku: 'DIAL-RAC-GRN', name: 'British Racing Green Sunburst', categorySlug: 'dial', price: 60,
    description: 'Verde esmeralda profundo de inspiración automovilística clásica.',
    color: 'Verde', layerFile: 'dial-racing-green.png',
    attrs: [{ defId: a.dial_size.id, val: '28.5' }]
  })
  await addPiece({
    sku: 'DIAL-MOP-WHT', name: 'Nácar Blanco Natural (Mother of Pearl)', categorySlug: 'dial', price: 95,
    description: 'Lámina genuina de nácar natural con iridiscencias únicas irrepetibles.',
    color: 'Blanco Nácar', layerFile: 'dial-mop-white.png',
    attrs: [{ defId: a.dial_size.id, val: '28.5' }]
  })
  await addPiece({
    sku: 'DIAL-OPH-SKL', name: 'Open Heart Esqueletizado', categorySlug: 'dial', price: 70,
    description: 'Ventana circular a las 9 que permite admirar el volante oscilando en vivo.',
    color: 'Gris Carbón', layerFile: 'dial-open-heart.png',
    attrs: [{ defId: a.dial_size.id, val: '28.5' }, { defId: a.open_heart.id, val: 'true' }]
  })
  await addPiece({
    sku: 'DIAL-VIN-CRM', name: 'Vintage Patina Cream', categorySlug: 'dial', price: 50,
    description: 'Tono crema cálido con índices de tritio envejecido tono café con leche.',
    color: 'Crema', layerFile: 'dial-vintage-cream.png',
    attrs: [{ defId: a.dial_size.id, val: '28.5' }]
  })
  await addPiece({
    sku: 'DIAL-MAT-WHT', name: 'Polar White Puro Lacado', categorySlug: 'dial', price: 45,
    description: 'Blanco puro lacado con índices ennegrecidos para máxima legibilidad táctica.',
    color: 'Blanco Polar', layerFile: 'dial-matte-white.png',
    attrs: [{ defId: a.dial_size.id, val: '28.5' }]
  })
  await addPiece({
    sku: 'DIAL-CHAMP', name: 'Champagne Royal 18K', categorySlug: 'dial', price: 65,
    description: 'Tono dorado champaña sutil con cepillado vertical de alta relojería.',
    color: 'Champaña', layerFile: 'dial-champagne.png',
    attrs: [{ defId: a.dial_size.id, val: '28.5' }]
  })
  await addPiece({
    sku: 'DIAL-METEOR', name: 'Meteorito Muonionalusta Genuino', categorySlug: 'dial', price: 180,
    description: 'Patrón de líneas cristalinas Widmanstätten naturales de origen extraterrestre.',
    color: 'Plata Meteorito', layerFile: 'dial-meteorite.png',
    attrs: [{ defId: a.dial_size.id, val: '28.5' }]
  })
  await addPiece({
    sku: 'DIAL-CARBON', name: 'Carbono Forjado Aeroespacial', categorySlug: 'dial', price: 110,
    description: 'Fibras de carbono moldeadas a alta presión con toques verde menta luminosos.',
    color: 'Carbono Negro', layerFile: 'dial-forged-carbon.png',
    attrs: [{ defId: a.dial_size.id, val: '28.5' }]
  })

  // ── 04. BEZELS (5) ─────────────────────────────────────────────────────
  await addPiece({
    sku: 'BEZ-CER-BLK', name: 'Bisel Cerámica Negra Pulida Sub', categorySlug: 'bezel', price: 40,
    description: 'Inserto cerámico pulido con números platino grabados con láser.',
    color: 'Negro', layerFile: 'bezel-ceramic-black.png'
  })
  await addPiece({
    sku: 'BEZ-PEPSI', name: 'Bisel Cerámico Pepsi 24H (Rojo / Azul)', categorySlug: 'bezel', price: 55,
    description: 'Bicolor rojo para horas diurnas y azul para nocturnas. Escala de 24 horas.',
    color: 'Rojo/Azul', layerFile: 'bezel-pepsi.png'
  })
  await addPiece({
    sku: 'BEZ-BATMAN', name: 'Bisel Cerámico Batman 24H (Negro / Azul)', categorySlug: 'bezel', price: 55,
    description: 'Bicolor cerámico negro medianoche y azul cerúleo con escala 24H.',
    color: 'Negro/Azul', layerFile: 'bezel-batman.png'
  })
  await addPiece({
    sku: 'BEZ-SMOOTH', name: 'Bisel Liso Acero Pulido Espejo', categorySlug: 'bezel', price: 25,
    description: 'Diseño limpio y minimalista que acentúa la deportividad moderna.',
    layerFile: 'bezel-smooth-steel.png'
  })
  await addPiece({
    sku: 'BEZ-FLUTED', name: 'Bisel Estriado (Fluted Bezel) Oro Blanco', categorySlug: 'bezel', price: 60,
    description: 'Facetas anguladas que capturan y refractan la luz en cualquier posición.',
    layerFile: 'bezel-fluted-steel.png'
  })

  // ── 05. HANDS (6) ──────────────────────────────────────────────────────
  await addPiece({
    sku: 'HND-MRC-SLV', name: 'Mercedes Rodio Pulido Super-LumiNova', categorySlug: 'hands', price: 25,
    description: 'El juego de agujas deportivas más reconocido del mundo con estrella de 3 puntas.',
    layerFile: 'hands-mercedes-silver.png'
  })
  await addPiece({
    sku: 'HND-MRC-GLD', name: 'Mercedes Oro 18K Amarillo', categorySlug: 'hands', price: 30,
    description: 'Baño de oro cálido para contrastar sobre esferas oscuras o crema.',
    color: 'Oro', layerFile: 'hands-mercedes-gold.png'
  })
  await addPiece({
    sku: 'HND-SWD-SLV', name: 'Sword Militaire en Acero Satinado', categorySlug: 'hands', price: 28,
    description: 'Forma de espada ancha y afilada con generoso lumen nocturno.',
    layerFile: 'hands-sword-silver.png'
  })
  await addPiece({
    sku: 'HND-SNW-SLV', name: 'Snowflake Tudor Style Rhodium', categorySlug: 'hands', price: 32,
    description: 'Agujas angulares con diamante/copo de nieve distintivo de los buceadores de época.',
    layerFile: 'hands-snowflake-silver.png'
  })
  await addPiece({
    sku: 'HND-BTN-BLK', name: 'Baton Minimalista Negro Mate', categorySlug: 'hands', price: 20,
    description: 'Líneas rectas estilo Bauhaus para configuraciones monocromáticas puras.',
    color: 'Negro', layerFile: 'hands-baton-black.png'
  })
  await addPiece({
    sku: 'HND-CTH-VNT', name: 'Cathedral Vintage Rose Gold', categorySlug: 'hands', price: 35,
    description: 'Calados inspirados en vitrales góticos con pátina cálida.',
    color: 'Oro Rosa', layerFile: 'hands-cathedral-vintage.png'
  })

  // ── 06. SECOND HAND (5) ────────────────────────────────────────────────
  await addPiece({
    sku: 'SEC-LIGHT-ORG', name: 'Segundero Rayo Naranja (Lightning Bolt)', categorySlug: 'second-hand', price: 18,
    description: 'Forma de relámpago naranja fluorescente que añade un marcado acento experimental.',
    color: 'Naranja', layerFile: 'second-lightning-orange.png'
  })
  await addPiece({
    sku: 'SEC-RED-TIP', name: 'Aguja Aguja con Punta Roja Sub', categorySlug: 'second-hand', price: 12,
    description: 'Aguja plateada ultra fina con punta roja carmesí para cronometría exacta.',
    color: 'Rojo/Plata', layerFile: 'second-red-tip.png'
  })
  await addPiece({
    sku: 'SEC-ARROW-BLU', name: 'Flecha Azul Royal GMT Style', categorySlug: 'second-hand', price: 16,
    description: 'Aguja con punta triangular azul cobalto de alta visibilidad.',
    color: 'Azul', layerFile: 'second-arrow-blue.png'
  })
  await addPiece({
    sku: 'SEC-LOL-GRN', name: 'Lollipop Verde Lima Vintage', categorySlug: 'second-hand', price: 15,
    description: 'Círculo de lumen equilibrado en el tercio superior.',
    color: 'Verde Lima', layerFile: 'second-lollipop-green.png'
  })
  await addPiece({
    sku: 'SEC-RHOD-NEEDLE', name: 'Aguja Fina de Rodio Clásica', categorySlug: 'second-hand', price: 10,
    description: 'Acabado en rodio pulido de espejo para máxima sutileza.',
    layerFile: 'second-classic-rhodium.png'
  })

  // ── 07. CROWNS (4) ─────────────────────────────────────────────────────
  await addPiece({
    sku: 'CRW-BIG-7MM', name: 'Big Crown 7.0mm Roscada Acero', categorySlug: 'crown', price: 20,
    description: 'Inspirada en los relojes de buceo de los años 50. Fácil accionamiento con guantes.',
    layerFile: 'crown-big-7mm.png'
  })
  await addPiece({
    sku: 'CRW-SIGN-65', name: 'Corona Moleteada con "S" Grabada 6.5mm', categorySlug: 'crown', price: 25,
    description: 'Grabado artesanal en el relieve con doble junta de estanqueidad.',
    layerFile: 'crown-signed-65mm.png'
  })
  await addPiece({
    sku: 'CRW-ONION-FLT', name: 'Corona Cebolla Acanalada Fluted (Pilot)', categorySlug: 'crown', price: 28,
    description: 'Forma abombada clásica de los relojes de aviador B-Uhr de la década de 1940.',
    layerFile: 'crown-onion-fluted.png'
  })
  await addPiece({
    sku: 'CRW-PVD-BLK', name: 'Corona Tactical PVD Negro Mate', categorySlug: 'crown', price: 22,
    description: 'Recubrimiento de titanio carbonitrurado antiadherente.',
    color: 'Negro', layerFile: 'crown-pvd-black.png'
  })

  // ── 08. CRYSTALS (3) ───────────────────────────────────────────────────
  await addPiece({
    sku: 'CRY-FLAT-AR', name: 'Zafiro Plano con Tratamiento Antirreflejos Azul', categorySlug: 'crystal', price: 40,
    description: 'Reflejos azulados bajo ángulos indirectos. Máxima dureza 9 en escala Mohs.',
    layerFile: 'crystal-flat-ar-blue.png'
  })
  await addPiece({
    sku: 'CRY-DOMED-VNT', name: 'Zafiro Doble Cúpula (Double Domed Vintage)', categorySlug: 'crystal', price: 55,
    description: 'Sin distorsión visual bajo el agua y hermosa curvatura abombada de época.',
    layerFile: 'crystal-double-domed.png'
  })
  await addPiece({
    sku: 'CRY-TOP-HAT', name: 'Zafiro Top Hat Box Perfil Alto', categorySlug: 'crystal', price: 65,
    description: 'Paredes verticales de 2mm que sobresalen del bisel emulando los cristales plexiglás.',
    layerFile: 'crystal-top-hat-box.png'
  })

  // ── 09. CHAPTER RINGS (5) ──────────────────────────────────────────────
  await addPiece({
    sku: 'CHP-SLV-MIN', name: 'Anillo de Minutos Acero Cepillado', categorySlug: 'chapter-ring', price: 18,
    description: 'Cepillado circular concéntrico con marcadores de 60 segundos impresos en negro.',
    layerFile: 'chapter-brushed-silver.png'
  })
  await addPiece({
    sku: 'CHP-BLK-MAT', name: 'Anillo Negro Mate con Marcas Blancas', categorySlug: 'chapter-ring', price: 18,
    description: 'Contraste nítido para ampliar la profundidad visual de la esfera.',
    color: 'Negro', layerFile: 'chapter-matte-black.png'
  })
  await addPiece({
    sku: 'CHP-GLD-POL', name: 'Anillo Oro Pulido Espejo', categorySlug: 'chapter-ring', price: 24,
    description: 'Acento dorado que enmarca las esferas oscuras o champagne.',
    color: 'Oro', layerFile: 'chapter-polished-gold.png'
  })
  await addPiece({
    sku: 'CHP-LUM-DIV', name: 'Anillo Diver con Puntos Lumed BGW9', categorySlug: 'chapter-ring', price: 28,
    description: 'Puntos luminiscentes que brillan en azul turquesa en la oscuridad.',
    color: 'Lumen Verde/Azul', layerFile: 'chapter-lumed-diver.png'
  })
  await addPiece({
    sku: 'CHP-ARB-VNT', name: 'Anillo Crema con Numerales Arábigos', categorySlug: 'chapter-ring', price: 22,
    description: 'Numerales de minutos 05-60 en tipografía Art Déco.',
    color: 'Crema', layerFile: 'chapter-arabic-track.png'
  })

  // ── 10. STRAPS / BRACELETS (10) ────────────────────────────────────────
  await addPiece({
    sku: 'STP-OYS-STL', name: 'Brazalete Oyster Acero 3 Eslabones 20mm', categorySlug: 'strap', price: 85,
    description: 'Eslabones macizos atornillados con cierre Glidelock de microajuste rápido.',
    layerFile: 'strap-oyster-steel.png',
    attrs: [{ defId: a.lug_width.id, val: '20' }]
  })
  await addPiece({
    sku: 'STP-JUB-STL', name: 'Brazalete Jubilee 5 Eslabones Acero 20mm', categorySlug: 'strap', price: 95,
    description: 'Eslabones centrales pulidos y laterales satinados para una caída fluida en la muñeca.',
    layerFile: 'strap-jubilee-steel.png',
    attrs: [{ defId: a.lug_width.id, val: '20' }]
  })
  await addPiece({
    sku: 'STP-PRE-GLD', name: 'Brazalete President Eslabones Curvos Oro 20mm', categorySlug: 'strap', price: 125,
    description: 'Eslabones semicirculares con cierre invisible Crownclasp en tono dorado.',
    color: 'Oro', layerFile: 'strap-president-gold.png',
    attrs: [{ defId: a.lug_width.id, val: '20' }]
  })
  await addPiece({
    sku: 'STP-LTH-TAN', name: 'Cuero Italiano Toscana Tan 20mm', categorySlug: 'strap', price: 50,
    description: 'Curtido vegetal de curtidería florentina con pespunte en hilo crudo hecho a mano.',
    material: 'Cuero Genuino', color: 'Marrón Claro', layerFile: 'strap-leather-tan.png',
    attrs: [{ defId: a.lug_width.id, val: '20' }]
  })
  await addPiece({
    sku: 'STP-LTH-BLK', name: 'Cuero Cordovan Negro Vestir 20mm', categorySlug: 'strap', price: 55,
    description: 'Piel lisa de brillo satinado elegante para eventos de gala.',
    material: 'Cuero Cordovan', color: 'Negro', layerFile: 'strap-leather-black.png',
    attrs: [{ defId: a.lug_width.id, val: '20' }]
  })
  await addPiece({
    sku: 'STP-FKM-WAF', name: 'Caucho FKM Waffle Diver Negro 20mm', categorySlug: 'strap', price: 42,
    description: 'Caucho fluoroelastómero FKM impermeable resistente a rayos UV y agua salina.',
    material: 'Caucho FKM', color: 'Negro', layerFile: 'strap-rubber-waffle.png',
    attrs: [{ defId: a.lug_width.id, val: '20' }]
  })
  await addPiece({
    sku: 'STP-TRP-NVY', name: 'Caucho Tropical Navy Blue 20mm', categorySlug: 'strap', price: 45,
    description: 'Patrón de diamantes texturizados con ventilación activa para buceo veraniego.',
    material: 'Caucho FKM', color: 'Azul Marino', layerFile: 'strap-rubber-navy.png',
    attrs: [{ defId: a.lug_width.id, val: '20' }]
  })
  await addPiece({
    sku: 'STP-MLN-MSH', name: 'Malla Milanesa de Acero Shark Mesh 20mm', categorySlug: 'strap', price: 65,
    description: 'Tejido de acero flexible que se amolda con precisión a la anatomía de tu muñeca.',
    layerFile: 'strap-milanese-mesh.png',
    attrs: [{ defId: a.lug_width.id, val: '20' }]
  })
  await addPiece({
    sku: 'STP-NTO-OLV', name: 'NATO Militar Verde Oliva 20mm', categorySlug: 'strap', price: 25,
    description: 'Nylon balístico de alta densidad con herrajes de acero quirúrgico cepillado.',
    material: 'Nylon Balístico', color: 'Verde Militar', layerFile: 'strap-nato-olive.png',
    attrs: [{ defId: a.lug_width.id, val: '20' }]
  })
  await addPiece({
    sku: 'STP-CNV-SND', name: 'Lona Canvas Reforzada Arena 20mm', categorySlug: 'strap', price: 35,
    description: 'Textura militar de expedición sahariana con forro interior de cuero anti-sudor.',
    material: 'Canvas Algodón', color: 'Arena / Beige', layerFile: 'strap-canvas-sand.png',
    attrs: [{ defId: a.lug_width.id, val: '20' }]
  })

  // ── 11. CASE BACKS (3) ─────────────────────────────────────────────────
  await addPiece({
    sku: 'CBK-EXH-SAP', name: 'Fondo Visto Cristal Zafiro (Exhibition Display)', categorySlug: 'caseback', price: 35,
    description: 'Tapa roscada con ventana de zafiro para disfrutar del movimiento mecánico en marcha.',
    layerFile: 'caseback-sapphire-display.png'
  })
  await addPiece({
    sku: 'CBK-SLD-STL', name: 'Fondo Ciego Acero Satinado con Grabado Perimetral', categorySlug: 'caseback', price: 0,
    description: 'Máxima resistencia a la presión de 200 metros con espacio central para grabado.',
    layerFile: 'caseback-solid-steel.png'
  })
  await addPiece({
    sku: 'CBK-WAV-JPN', name: 'Fondo Grabado Relieve "Gran Ola de Kanagawa"', categorySlug: 'caseback', price: 40,
    description: 'Tributo de grabado en tres dimensiones al arte tradicional marítimo japonés.',
    layerFile: 'caseback-wave-engraved.png'
  })

  // ── 12. ENGRAVINGS (Configurable options) ────────────────────────────────
  await addPiece({
    sku: 'ENG-CUSTOM-TEXT', name: 'Grabado Láser Personalizado', categorySlug: 'engraving', price: 30,
    description: 'Personaliza tu reloj con tu nombre, fecha conmemorativa o mensaje personal en el rotor o tapa.',
    layerFile: 'engraving-custom.png',
    stock: 999
  })
  await addPiece({
    sku: 'ENG-NONE', name: 'Sin Grabado (Estándar de Manufactura)', categorySlug: 'engraving', price: 0,
    description: 'Mantén el reloj con los acabados limpios originales de manufactura.',
    layerFile: 'engraving-custom.png',
    layerOpacity: 0.0,
    stock: 999
  })

  // ── 13. DATA-DRIVEN COMPATIBILITY RULES ────────────────────────────────
  console.log('Linking physical compatibility rules between cases, movements, dials, and bezels...')

  // Rule 1: Datejust 36mm Case (CASE-DJ-36) is a dress watch:
  // ONLY compatible with dress bezels (Smooth & Fluted), NOT with diver bezels
  await prisma.compatibilityRule.create({
    data: {
      pieceId: p['CASE-DJ-36'].id,
      targetCategoryId: c['bezel'].id,
      ruleType: 'whitelist',
      targetPieceIds: JSON.stringify([p['BEZ-FLUTED'].id, p['BEZ-SMOOTH'].id]),
      description: 'La caja Datejust de 36mm sólo admite biseles lisos o estriados'
    }
  })

  // Rule 2: Submariner Cases (CASE-SUB-STEEL & CASE-SUB-PVD) only compatible with Diver/GMT Bezels
  await prisma.compatibilityRule.create({
    data: {
      pieceId: p['CASE-SUB-STEEL'].id,
      targetCategoryId: c['bezel'].id,
      ruleType: 'whitelist',
      targetPieceIds: JSON.stringify([p['BEZ-CER-BLK'].id, p['BEZ-PEPSI'].id, p['BEZ-BATMAN'].id, p['BEZ-SMOOTH'].id]),
      description: 'Compatible con biseles deportivos Submariner y GMT'
    }
  })

  await prisma.compatibilityRule.create({
    data: {
      pieceId: p['CASE-SUB-PVD'].id,
      targetCategoryId: c['bezel'].id,
      ruleType: 'whitelist',
      targetPieceIds: JSON.stringify([p['BEZ-CER-BLK'].id, p['BEZ-BATMAN'].id, p['BEZ-SMOOTH'].id]),
      description: 'Compatible con biseles de cerámica oscura y Batman'
    }
  })

  // Rule 3: Explorer 39mm (CASE-EXP-39) has integrated fixed smooth bezel
  await prisma.compatibilityRule.create({
    data: {
      pieceId: p['CASE-EXP-39'].id,
      targetCategoryId: c['bezel'].id,
      ruleType: 'whitelist',
      targetPieceIds: JSON.stringify([p['BEZ-SMOOTH'].id]),
      description: 'La caja Explorer cuenta con perfil liso'
    }
  })

  // Rule 4: Daytona 39mm (CASE-DAY-39) only works with Smooth or Fluted
  await prisma.compatibilityRule.create({
    data: {
      pieceId: p['CASE-DAY-39'].id,
      targetCategoryId: c['bezel'].id,
      ruleType: 'whitelist',
      targetPieceIds: JSON.stringify([p['BEZ-SMOOTH'].id, p['BEZ-CER-BLK'].id]),
      description: 'Compatible con biseles de perfil delgado o cerámico'
    }
  })

  // Rule 5: Open Heart Dial (DIAL-OPH-SKL) requires Open Heart Movement (MOV-NH38)
  await prisma.compatibilityRule.create({
    data: {
      pieceId: p['DIAL-OPH-SKL'].id,
      targetCategoryId: c['movement'].id,
      ruleType: 'whitelist',
      targetPieceIds: JSON.stringify([p['MOV-NH38'].id]),
      description: 'La esfera Open Heart requiere el calibre NH38 sin fechador'
    }
  })

  // Rule 6: GMT Bezels (Pepsi & Batman) pair best with GMT Movement (NH34) or NH35
  await prisma.compatibilityRule.create({
    data: {
      pieceId: p['BEZ-PEPSI'].id,
      targetCategoryId: c['movement'].id,
      ruleType: 'whitelist',
      targetPieceIds: JSON.stringify([p['MOV-NH34'].id, p['MOV-NH35'].id]),
      description: 'Compatible con calibre NH34 GMT y NH35'
    }
  })

  // Rule 7: SKX007 42mm (CASE-SKX-42) with 22mm lug width:
  // Only compatible with Diver bezels and Diver crowns
  await prisma.compatibilityRule.create({
    data: {
      pieceId: p['CASE-SKX-42'].id,
      targetCategoryId: c['bezel'].id,
      ruleType: 'whitelist',
      targetPieceIds: JSON.stringify([p['BEZ-CER-BLK'].id, p['BEZ-PEPSI'].id, p['BEZ-BATMAN'].id]),
      description: 'La caja SKX Diver requiere biseles de buceo giratorios'
    }
  })

  // Rule 8: Second Hand GMT Arrow (SEC-ARROW-BLU) compatible with GMT and Sub dials
  await prisma.compatibilityRule.create({
    data: {
      pieceId: p['SEC-ARROW-BLU'].id,
      targetCategoryId: c['movement'].id,
      ruleType: 'whitelist',
      targetPieceIds: JSON.stringify([p['MOV-NH34'].id, p['MOV-NH35'].id]),
      description: 'Compatible con calibres deportivos'
    }
  })

  // Rule 9: Datejust Case (CASE-DJ-36) with Jubilee & President bracelets
  await prisma.compatibilityRule.create({
    data: {
      pieceId: p['CASE-DJ-36'].id,
      targetCategoryId: c['strap'].id,
      ruleType: 'whitelist',
      targetPieceIds: JSON.stringify([
        p['STP-JUB-STL'].id,
        p['STP-PRE-GLD'].id,
        p['STP-LTH-TAN'].id,
        p['STP-LTH-BLK'].id,
        p['STP-MLN-MSH'].id
      ]),
      description: 'Compatible con brazaletes de vestir Jubilee, President, cuero y malla milanesa'
    }
  })

  // Total count verification
  const totalCategories = await prisma.category.count()
  const totalPieces = await prisma.piece.count()
  const totalRules = await prisma.compatibilityRule.count()

  console.log(`\n🎉 SEED COMPLETE!`)
  console.log(`   - Categories: ${totalCategories} (all 12 active steps)`)
  console.log(`   - Total Pieces: ${totalPieces} (>60 pieces with SVG layers)`)
  console.log(`   - Compatibility Rules: ${totalRules}`)
  console.log(`   - Admin: admin@chrono.com / admin123\n`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
