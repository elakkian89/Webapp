"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, RefreshCw, Plus } from "lucide-react"

interface UtilizationData {
  employeeUtilizationId: number
  empId: string
  empName: string
  monthYear: string
  utilization: number
  actualUtilization: number
  projectType: string
  demandCategory: string
  projectName: string
  department: string
}

interface EmployeeUtilizationTableProps {
  data: UtilizationData[]
  onAddRow?: (data: any) => void
}

export default function EmployeeUtilizationTable({ data, onAddRow }: EmployeeUtilizationTableProps) {
  const [financialYear, setFinancialYear] = useState("2024-25")
  const [currency] = useState("INR")

  // Group data by employee
  const groupedData = data.reduce(
    (acc, item) => {
      const key = `${item.empId}-${item.empName}`
      if (!acc[key]) {
        acc[key] = {
          empId: item.empId,
          empName: item.empName,
          months: {},
        }
      }
      acc[key].months[item.monthYear] = item
      return acc
    },
    {} as Record<string, any>,
  )

  // Get unique months from data
  const months = Array.from(new Set(data.map((item) => item.monthYear))).sort()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleExport = () => {
    console.log("[v0] Export CSV clicked")
  }

  const handleRefresh = () => {
    console.log("[v0] Refresh data clicked")
  }

  const handleAddRow = () => {
    console.log("[v0] Add row clicked")
    if (onAddRow) {
      onAddRow({})
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Financial Year:</span>
            <Select value={financialYear} onValueChange={setFinancialYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2025-26">2025-26</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Currency:</span>
            <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">{currency}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button size="sm" onClick={handleAddRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Filters:</span>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select an option</SelectItem>
            <SelectItem value="fte">FTE</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select an option</SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
            <SelectItem value="pipeline">Pipeline</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select an option</SelectItem>
            <SelectItem value="bi">Business Intelligence</SelectItem>
            <SelectItem value="dev">Development</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select an option</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="development">Development</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Complex Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              {/* First header row - Main columns */}
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                  EmployeeUtilizationId
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                  EmpID
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                  EmpName
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                  MonthYear
                </th>
                {months.map((month) => (
                  <th
                    key={month}
                    className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                    colSpan={6}
                  >
                    {formatDate(month)}
                  </th>
                ))}
              </tr>
              {/* Second header row - Sub columns */}
              <tr className="bg-gray-100 border-b">
                <th className="border-r"></th>
                <th className="border-r"></th>
                <th className="border-r"></th>
                <th className="border-r"></th>
                {months.map((month) => (
                  <React.Fragment key={month}>
                    <th className="px-2 py-1 text-xs font-medium text-gray-600 border-r">Utilization</th>
                    <th className="px-2 py-1 text-xs font-medium text-gray-600 border-r">Actual_Utilization</th>
                    <th className="px-2 py-1 text-xs font-medium text-gray-600 border-r">ProjectType</th>
                    <th className="px-2 py-1 text-xs font-medium text-gray-600 border-r">DemandCategory</th>
                    <th className="px-2 py-1 text-xs font-medium text-gray-600 border-r">ProjectName</th>
                    <th className="px-2 py-1 text-xs font-medium text-gray-600 border-r">Department</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            {/* Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.values(groupedData).map((employee: any, index) => (
                <tr key={employee.empId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-3 py-2 text-sm text-gray-900 border-r">
                    {Object.values(employee.months)[0]?.employeeUtilizationId || ""}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900 border-r">{employee.empId}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 border-r">{employee.empName}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 border-r"></td>
                  {months.map((month) => {
                    const monthData = employee.months[month]
                    return (
                      <React.Fragment key={month}>
                        <td className="px-2 py-2 text-sm text-gray-900 border-r text-center">
                          {monthData?.utilization || ""}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900 border-r text-center">
                          {monthData?.actualUtilization || ""}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900 border-r text-center">
                          {monthData?.projectType || ""}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900 border-r text-center">
                          {monthData?.demandCategory || ""}
                        </td>
                        <td
                          className="px-2 py-2 text-sm text-gray-900 border-r text-center max-w-xs truncate"
                          title={monthData?.projectName}
                        >
                          {monthData?.projectName || ""}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900 border-r text-center">
                          {monthData?.department || ""}
                        </td>
                      </React.Fragment>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
