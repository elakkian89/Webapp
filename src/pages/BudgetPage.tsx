"use client"

import { useState } from "react"
import PivotTable, { type PivotConfig } from "../components/PivotTable"
import { budget } from "../data/budget"

const budgetPivotConfig: PivotConfig = {
  rowGroupBy: ["category", "clientName"],
  columnGroupBy: "monthYear",
  valueField: "budgetedRevenue",
  valueType: "currency",
  aggregation: "sum",
}

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState(budget)

  const handleAddRow = (newRowData: any) => {
    console.log("[v0] Add row clicked for budget")
    const newRow = {
      id: Date.now(),
      category: newRowData.category || "",
      clientName: newRowData.clientName || newRowData.client || "",
      client: newRowData.client || "",
      salesRep: newRowData.salesRep || "",
      practice: newRowData.practice || "",
      monthYear: "2024-04",
      budgetedRevenue: 0,
      ...newRowData,
    }
    setBudgetData((prev) => [...prev, newRow])
  }

  const handleExport = () => {
    console.log("[v0] Export CSV clicked for budget")
    // TODO: Implement CSV export
  }

  const handleRefresh = () => {
    console.log("[v0] Refresh data clicked for budget")
    // TODO: Implement data refresh
  }

  return (
    <PivotTable
      data={budgetData}
      config={budgetPivotConfig}
      title="Budget Planning"
      description="Plan and track your budget allocations in pivot view"
      onAddRow={handleAddRow}
      onExport={handleExport}
      onRefresh={handleRefresh}
    />
  )
}
