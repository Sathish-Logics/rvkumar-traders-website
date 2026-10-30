// Exposes verified public contact configuration without inventing missing details.
export const publicContact = {
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE?.trim() ?? "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL?.trim() ?? "",
};

export function whatsappEnquiryUrl(message: string) {
  if (!publicContact.whatsapp) return null;
  return `https://wa.me/${publicContact.whatsapp}?text=${encodeURIComponent(message)}`;
}
