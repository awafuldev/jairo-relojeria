import type { Metadata } from 'next'
import AdminSidebar from './AdminSidebar'

export const metadata: Metadata = {
  title: 'Panel de Control — Jairo Relojería',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FAFAF9]">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
