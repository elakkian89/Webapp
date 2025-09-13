"use client"

import { useState } from "react"
import DataTable, { type Column } from "../components/DataTable"

// Sample reports data structure
const initialReports = [
  {
    reportId: 1,
    reportName: "Monthly Revenue Report",
    reportType: "Financial",
    createdDate: "2024-01-15",
    lastRun: "2024-01-20",
    status: "Active",
    frequency: "Monthly",
    description: "Monthly revenue analysis across all clients",
  },
  {
    reportId: 2,
    reportName: "Employee Utilization Summary",
    reportType: "HR",
    createdDate: "2024-01-10",
    lastRun: "2024-01-18",
    status: "Active",
    frequency: "Weekly",
    description: "Weekly employee utilization tracking",
  },
  {
    reportId: 3,
    reportName: "Project Status Dashboard",
    reportType: "Operations",
    createdDate: "2024-01-05",
    lastRun: "2024-01-19",
    status: "Active",
    frequency: "Daily",
    description: "Daily project status and milestone tracking",
  },
]

const reportColumns: Column[] = [
  { label: "ID", key: "reportId", type: "number", align: "right" },
  { label: "Report Name", key: "reportName", type: "text" },
  { label: "Type", key: "reportType", type: "text" },
  { label: "Created Date", key: "createdDate", type: "date" },
  { label: "Last Run", key: "lastRun", type: "date" },
  { label: "Status", key: "status", type: "text" },
  { label: "Frequency", key: "frequency", type: "text" },
  { label: "Description", key: "description", type: "text" },
]

export default function ReportsPage() {
  const [reports, setReports] = useState(initialReports)

  const handleAddRow = (formData: any) => {
    const newReport = {
      ...formData,
      reportId: Math.max(...reports.map((r) => r.reportId)) + 1,
    }
    setReports((prev) => [...prev, newReport])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate and view business reports</p>
      </div>

      <DataTable
        columns={reportColumns}
        data={reports}
        searchable
        sortable
        stickyHeader
        zebraRows
        pageSize={25}
        showAddRow
        onAddRow={handleAddRow}
        addRowTitle="Add New Report"
      />
    </div>
  )
}
