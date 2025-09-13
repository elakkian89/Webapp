export const formatDate = (value: any): string => {
  if (!value) return ""

  // Handle different input formats
  const dateStr = String(value)

  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr
  }

  // Handle DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("-")
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }

  // Handle MM/DD/YYYY format
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [month, day, year] = dateStr.split("/")
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }

  // Try to parse as Date object
  try {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0]
    }
  } catch (e) {
    // Fall through to return original value
  }

  return String(value)
}

export const formatCurrencyINR = (value: any): string => {
  if (value === null || value === undefined || value === "") return ""

  const numValue = typeof value === "string" ? Number.parseFloat(value) : Number(value)
  if (isNaN(numValue)) return String(value)

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

export const formatNumber = (value: any): string => {
  if (value === null || value === undefined || value === "") return ""

  const numValue = typeof value === "string" ? Number.parseFloat(value) : Number(value)
  if (isNaN(numValue)) return String(value)

  return new Intl.NumberFormat("en-IN").format(numValue)
}

export const formatPercent = (value: any, fractionDigits = 0): string => {
  if (value === null || value === undefined || value === "") return ""

  const numValue = typeof value === "string" ? Number.parseFloat(value) : Number(value)
  if (isNaN(numValue)) return String(value)

  // Convert decimal to percentage (0.25 -> 25%)
  const percentValue = numValue * 100
  return `${percentValue.toFixed(fractionDigits)}%`
}

// Keep existing functions for backward compatibility
export { formatCurrencyINR as formatCurrency }
