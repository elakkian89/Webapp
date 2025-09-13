export function formatDate(value: any): string {
  if (!value) return "-"

  // If it's already in YYYY-MM-DD format, return as is
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  // Convert DD-MM-YYYY to YYYY-MM-DD
  if (typeof value === "string" && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-")
    return `${year}-${month}-${day}`
  }

  // Handle Date objects
  if (value instanceof Date) {
    return value.toISOString().split("T")[0]
  }

  return String(value)
}

export function formatCurrencyINR(value: any): string {
  if (value == null || isNaN(Number(value))) return "-"

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value))
}

export function formatCurrency(value: any): string {
  return formatCurrencyINR(value)
}

export function formatNumber(value: any): string {
  if (value == null || isNaN(Number(value))) return "-"

  return new Intl.NumberFormat("en-IN").format(Number(value))
}

export function formatPercent(value: any, fractionDigits = 0): string {
  if (value == null || isNaN(Number(value))) return "-"

  const numValue = Number(value)
  return `${(numValue * 100).toFixed(fractionDigits)}%`
}
