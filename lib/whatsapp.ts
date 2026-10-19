// Centralized WhatsApp integration for Jairo Relojería orders and inquiries

export const DEFAULT_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '18290000000'

export function formatWhatsAppPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function getWhatsAppUrl(message: string, phone: string = DEFAULT_WHATSAPP_NUMBER): string {
  const cleanPhone = formatWhatsAppPhone(phone)
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}
