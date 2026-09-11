export function formatPrice(price?: string | null) {
  if (!price) return 'Free'

  const formattedPrice = price.trim().replace(/^Rs\s*/i, '').replace(/^\$\s*/, '')

  return `Rs ${formattedPrice}`
}