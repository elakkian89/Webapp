"use client"

import { useState } from "react"
import DataTable, { type Column } from "../components/DataTable"
import FiltersBar from "../components/FiltersBar"
import { employees as initialEmployees } from "../data/employees"

const employeeColumns: Column[] = [
  { label: "ID", key: "empMasterId", type: "number", align: "right" },
  { label: "Emp ID", key: "empId", type: "text" },
  { label: "Emp Name", key: "empName", type: "text" },
  { label: "Designation", key: "designation", type: "text" },
  { label: "Location", key: "location", type: "text" },
  { label: "Division", key: "division", type: "text" },
  { label: "Delivery Location", key: "deliveryLocation", type: "text" },
]

const employeeFilters = [
  { key: "empName", label: "Employee Name", type: "text" as const },
  { key: "empId", label: "Employee ID", type: "text" as const },
  { key: "designation", label: "Designation", type: "dropdown" as const },
  { key: "location", label: "Location", type: "dropdown" as const },
  { key: "division", label: "Division", type: "dropdown" as const },
  { key: "deliveryLocation", label: "Delivery Location", type: "dropdown" as const },
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [filters, setFilters] = useState<Record<string, any>>({})

  const handleAddRow = (formData: any) => {
    const newEmployee = {
      ...formData,
      empMasterId: Math.max(...employees.map((e) => e.empMasterId)) + 1,
    }
    setEmployees((prev) => [...prev, newEmployee])
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Employee Master</h1>
        <p className="text-gray-600">Manage your employee information and organizational structure</p>
      </div>

      <FiltersBar filters={employeeFilters} data={employees} onFiltersChange={setFilters} />

      <DataTable
        columns={employeeColumns}
        data={employees}
        filters={filters}
        searchable
        sortable
        stickyHeader
        zebraRows
        pageSize={25}
        showAddRow
        onAddRow={handleAddRow}
        addRowTitle="Add New Employee"
      />
    </div>
  )
}
