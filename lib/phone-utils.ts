/**
 * Phone number utilities for Antigua Barbers
 * Handles country code normalization for tel: and WhatsApp links
 */

export function formatPhoneForTel(phone: string | null): string | null {
  if (!phone) return null;
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // If it's already 11 digits and starts with 1, return as-is
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  }
  
  // If it's 10 digits, add country code +1
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }
  
  // If it's 7 digits, assume it's missing area code (268 for Antigua)
  if (digitsOnly.length === 7) {
    return `+1268${digitsOnly}`;
  }
  
  // Return original if we can't normalize it
  return phone;
}

export function formatPhoneForWhatsApp(phone: string | null): string {
  if (!phone) return '12680000000'; // Fallback
  
  const formatted = formatPhoneForTel(phone);
  if (!formatted) return '12680000000';
  
  // Remove the + for WhatsApp
  return formatted.replace('+', '');
}

export function formatPhoneForDisplay(phone: string | null): string | null {
  if (!phone) return null;
  
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for display
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    const areaCode = digitsOnly.slice(1, 4);
    const exchange = digitsOnly.slice(4, 7);
    const number = digitsOnly.slice(7);
    return `+1 (${areaCode}) ${exchange}-${number}`;
  }
  
  if (digitsOnly.length === 10) {
    const areaCode = digitsOnly.slice(0, 3);
    const exchange = digitsOnly.slice(3, 6);
    const number = digitsOnly.slice(6);
    return `+1 (${areaCode}) ${exchange}-${number}`;
  }
  
  return phone;
}
