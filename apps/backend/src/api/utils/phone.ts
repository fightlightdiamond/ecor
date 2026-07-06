/**
 * Normalize a Vietnamese phone number for comparison: keep digits only and
 * compare on the last 9 digits so "0901234567", "+84 901 234 567" and
 * "84901234567" all match.
 */
export function normalizePhone(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "")
  return digits.slice(-9)
}

export function phonesMatch(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false
  const na = normalizePhone(a)
  const nb = normalizePhone(b)
  return na.length >= 9 && na === nb
}
