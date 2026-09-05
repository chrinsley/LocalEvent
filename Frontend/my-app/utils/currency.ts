export function formatPrice(price?: string | null) {
  if (!price) return 'Free'

  return price.replace(/\$/g, 'Rs ')
}