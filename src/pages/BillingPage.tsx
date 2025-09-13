"use client"

import { useState } from "react"
import PivotTable, { type PivotConfig } from "../components/PivotTable"
import { billing } from "../data/billing"

const billingPivotConfig: PivotConfig = {
  rowGroupBy: ["category", "projectName"],
  columnGroupBy: "monthYear",
  valueField: "billedRevenue",
  valueType: "currency",
  aggregation: "sum",
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState(billing)

  const handleAddRow = (newRowData: any) => {
    console.log("[v0] Add row clicked for billing")
    const newRow = {
      id: Date.now(), // Simple ID generation
      category: newRowData.category || "",
      projectName: newRowData.projectName || "",
      client: newRowData.client || "",
      salesRep: newRowData.salesRep || "",
      practice: newRowData.practice || "",
      monthYear: "2024-04", // Default to current month
      billedRevenue: 0, // Default value
      ...newRowData,
    }
    setBillingData((prev) => [...prev, newRow])
  }

  const handleExport = () => {
    console.log("[v0] Export CSV clicked for billing")
    // TODO: Implement CSV export
  }

  const handleRefresh = () => {
    console.log("[v0] Refresh data clicked for billing")
    // TODO: Implement data refresh
  }

  return (
    <PivotTable
      data={billingData}
      config={billingPivotConfig}
      title="Billing Revenue"
      description="Track your billing and revenue data in pivot view"
      onAddRow={handleAddRow}
      onExport={handleExport}
      onRefresh={handleRefresh}
    />
  )
}
