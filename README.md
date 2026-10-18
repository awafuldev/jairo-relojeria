# CHRONO — Haute Horlogerie Watch Configurator & Catalog Platform

Plataforma web de configuración visual de relojes mecánicos personalizados de alta gama con catálogo y motor de reglas de compatibilidad física administrable sin tocar código.

Diseñado bajo la filosofía editorial y estética suiza minimalista (**Half Helix / Swiss Watchmaking**): lienzo blanco, tipografía limpia, paleta monocromática de escala de grises (`#ffffff`, `#000000`, `#262626`, `#484a4c`, `#686c6d`, `#a5a7a8`, `#dbdbdb`, `#ededed`) y el producto como protagonista indiscutible.

---

## 🚀 Servidor en Ejecución

- **Configurador Público**: [http://localhost:3001/configurator](http://localhost:3001/configurator)
- **Página Principal (Hero & Proceso)**: [http://localhost:3001](http://localhost:3001)
- **Catálogo Editorial**: [http://localhost:3001/catalog](http://localhost:3001/catalog)
- **Panel de Administración**: [http://localhost:3001/admin](http://localhost:3001/admin)
- **Login Admin**: [http://localhost:3001/admin/login](http://localhost:3001/admin/login)

### Credenciales de Administrador:
- **Email**: `admin@chrono.com`
- **Contraseña**: `admin123`

---

## 🏛️ Arquitectura del Sistema

El sistema está construido desacoplando totalmente los datos del frontend:

```
chrono/
├── app/
│   ├── (public)
│   │   ├── page.tsx                     # Landing editorial y showcase
│   │   ├── catalog/page.tsx             # Catálogo público de piezas
│   │   └── configurator/
│   │       ├── page.tsx                 # Contenedor del configurador
│   │       ├── Configurator.tsx         # Orquestador del configurador
│   │       ├── WatchViewer.tsx          # Visor visual en capas en tiempo real
│   │       ├── PieceGrid.tsx            # Selector editorial de piezas compatibles
│   │       ├── StepNav.tsx              # Navegación por pasos (desktop y móvil)
│   │       ├── InvalidationWarning.tsx  # Banner de invalidación en cascada
│   │       ├── ConfiguratorSummary.tsx  # Resumen final, precio y guardado
│   │       └── [token]/page.tsx         # Visualizador de diseño guardado por enlace
│   ├── admin/
│   │   ├── layout.tsx                   # Layout con sidebar administrativo
│   │   ├── page.tsx                     # Dashboard con métricas en vivo
│   │   ├── pieces/                      # Gestión de piezas (lista y filtros)
│   │   │   ├── page.tsx
│   │   │   ├── PieceForm.tsx            # Editor completo con ajuste visual de capas
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── categories/page.tsx          # Gestión de categorías y orden de pasos
│   │   ├── compatibility/page.tsx       # Matriz visual de reglas de compatibilidad
│   │   ├── orders/page.tsx              # Pedidos y configuraciones guardadas
│   │   ├── settings/page.tsx            # Ajustes de tienda
│   │   └── login/page.tsx               # Login seguro para administrador
│   └── api/
│       ├── categories/                  # Endpoints públicos
│       ├── compatibility/               # Endpoints de compatibilidad
│       ├── configurations/              # Guardado de configuraciones
│       └── admin/                       # Endpoints protegidos para el admin
├── lib/
│   ├── prisma.ts                        # Cliente Prisma singleton
│   ├── auth.ts                          # Autenticación con cookies HMAC seguras
│   ├── store.ts                         # Estado global del configurador (Zustand)
│   └── compatibility.ts                 # Motor de reglas y evaluación de compatibilidad
├── prisma/
│   ├── schema.prisma                    # Esquema de base de datos relacional
│   ├── seed.ts                          # Seed con 37 piezas y 20 reglas físicas
│   └── dev.db                           # Base de datos SQLite local
└── public/
    └── images/layers/                   # Capas SVG vectoriales de alta resolución
```

---

## ⚙️ Motor de Compatibilidad ("Complejo por dentro, Simple por fuera")

El motor (`lib/compatibility.ts`) opera evaluando en el cliente las reglas definidas en la base de datos:
1. **Reglas de Lista Blanca (Whitelist)**: Define con qué piezas específicas de otra categoría es compatible una pieza.
2. **Reglas de Atributos**: Compara atributos técnicos (ej. diámetro de caja vs. tamaño de dial, ancho de asas vs. ancho de correa).
3. **Lenguaje Simple**: El cliente nunca ve códigos técnicos; ve:
   - `✓ Compatible`
   - `No compatible con tu caja actual`
4. **Invalidación en Cascada**: Si el usuario regresa y cambia una pieza anterior que vuelve incompatible una posterior, el sistema alerta al usuario y retira la pieza incompatible de forma transparente.

---

## 🎨 Sistema de Capas Visuales del Reloj

El reloj se construye en vivo mediante capas con transparencia apiladas por `layerZIndex`:
- **Z-0**: Fondo de caja (`caseback`)
- **Z-2**: Correa / Brazalete (`bracelet`)
- **Z-3**: Caja (`case`)
- **Z-4**: Dial (`dial`)
- **Z-6**: Manecillas (`hands`)
- **Z-7**: Cristal y reflejo de zafiro (`crystal`)
- **Z-8**: Corona (`crown`)

El administrador puede calibrar para cada pieza:
- **Escala**: de 0.5x a 2.0x
- **Posición X**: desplazamiento horizontal en px
- **Posición Y**: desplazamiento vertical en px
- **Rotación**: rotación en grados
- **Z-Index**: orden de superposición
- **Previsualización en vivo**: caja de previsualización en el formulario de la pieza
