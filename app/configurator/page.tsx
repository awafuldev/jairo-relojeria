import type { Metadata } from 'next'
import Configurator from './Configurator'

export const metadata: Metadata = {
  title: 'Configurador de Relojes — Jairo Relojería',
  description: 'Personaliza y ensamble cada componente de tu reloj mecánico en tiempo real.',
}

export default function ConfiguratorPage() {
  return <Configurator />
}
