import WatchForm from '../WatchForm'

export default function NewWatchPage() {
  return (
    <div className="p-8 max-w-6xl font-poppins">
      <div className="mb-8">
        <span className="font-cabin text-[10px] uppercase tracking-[0.14em] text-[#1dd8e1] font-semibold block mb-1">
          Inventario de Tienda
        </span>
        <h1 className="editorial-title text-2xl sm:text-3xl text-[#0a0d0f] tracking-[0.08em]">
          Agregar Nuevo Reloj Seiko
        </h1>
        <p className="text-[13px] text-[#2e3438] mt-1">
          Completa los datos técnicos y sube las fotografías del nuevo modelo para publicarlo en la tienda.
        </p>
      </div>

      <WatchForm />
    </div>
  )
}
