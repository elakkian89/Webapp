"use client"

import { useState } from "react"
import EmployeeUtilizationTable from "../components/EmployeeUtilizationTable"
import { utilization } from "../data/utilization"

export default function UtilizationPage() {
  const [utilizationData, setUtilizationData] = useState(utilization)

  const handleAddRow = (newRowData: any) => {
    console.log("[v0] Add row clicked for utilization")
    const newRow = {
      employeeUtilizationId: Date.now(),
      empId: newRowData.empId || "",
      empName: newRowData.empName || "",
      monthYear: newRowData.monthYear || "2025-04-01",
      utilization: newRowData.utilization || 0,
      actualUtilization: newRowData.actualUtilization || 0,
      projectType: newRowData.projectType || "",
      demandCategory: newRowData.demandCategory || "",
      projectName: newRowData.projectName || "",
      department: newRowData.department || "",
      ...newRowData,
    }
    setUtilizationData((prev) => [...prev, newRow])
  }

  return <EmployeeUtilizationTable data={utilizationData} onAddRow={handleAddRow} />
}
