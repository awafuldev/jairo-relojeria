// Centralized WhatsApp integration for Jairo Relojería orders and inquiries

// Real number from @jairorelojeria Instagram: wa.link/d4myw9 → +57 310 540 1603 (Colombia)
export const DEFAULT_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '573105401603'

export function formatWhatsAppPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function getWhatsAppUrl(message: string, phone: string = DEFAULT_WHATSAPP_NUMBER): string {
  const cleanPhone = formatWhatsAppPhone(phone)
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}
