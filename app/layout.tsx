import type { Metadata } from 'next'
import { Jost, Poppins, Cabin } from 'next/font/google'
import './globals.css'

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
})

const cabin = Cabin({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cabin',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jairo Relojería — Alta Relojería & Configuración Bespoke',
  description: 'Taller especializado en modificación, restauración y ensamble de relojes de alta precisión. Configura tu reloj pieza por pieza.',
  openGraph: {
    title: 'Jairo Relojería — Relojería Personalizada',
    description: 'Ensamble bespoke de relojes mecánicos. Componentes de alta precisión seleccionados individualmente.',
    siteName: 'Jairo Relojería',
  },
}

import { I18nProvider } from '@/lib/i18n/context'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${jost.variable} ${poppins.variable} ${cabin.variable}`}>
      <body className="bg-[#ffffff] text-[#0a0d0f] antialiased selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
        <I18nProvider>
          {children}
          <FloatingWhatsApp />
        </I18nProvider>
      </body>
    </html>
  )
}
