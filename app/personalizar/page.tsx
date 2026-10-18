import type { Metadata } from 'next'
import Configurator from '../configurator/Configurator'

export const metadata: Metadata = {
  title: 'Personalizar Reloj — Jairo Relojería',
  description: 'Crea tu reloj mecánico único seleccionando cada componente en nuestro configurador 1:1 en tiempo real.',
}

export default function PersonalizarPage() {
  return <Configurator />
}
