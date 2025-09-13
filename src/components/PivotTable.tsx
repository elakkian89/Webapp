"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Download, RefreshCw, Plus, Filter } from "lucide-react"
import { formatCurrency, formatPercent } from "../lib/format"
import AddRowModal from "./AddRowModal"

export interface PivotConfig {
  rowGroupBy: string[]
  columnGroupBy: string
  valueField: string
  valueType: "currency" | "number" | "percent"
  aggregation: "sum" | "avg" | "count"
}

export interface PivotTableProps {
  data: any[]
  config: PivotConfig
  title: string
  description: string
  onAddRow?: (newRowData: any) => void // Updated to accept new row data
  onExport?: () => void
  onRefresh?: () => void
  financialYear?: string
  currency?: string
}

export default function PivotTable({
  data,
  config,
  title,
  description,
  onAddRow,
  onExport,
  onRefresh,
  financialYear = "2024-25",
  currency = "INR",
}: PivotTableProps) {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {}
    const allFields = [...config.rowGroupBy, config.columnGroupBy]

    allFields.forEach((field) => {
      options[field] = [...new Set(data.map((item) => item[field]).filter(Boolean))]
    })

    return options
  }, [data, config])

  const pivotData = useMemo(() => {
    const filteredData = data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesFilters = Object.entries(filters).every(([field, value]) => value === "" || item[field] === value)

      return matchesSearch && matchesFilters
    })

    const grouped: Record<string, any[]> = {}

    filteredData.forEach((item) => {
      const rowKey = config.rowGroupBy.map((field) => item[field]).join(" | ")
      if (!grouped[rowKey]) {
        grouped[rowKey] = []
      }
      grouped[rowKey].push(item)
    })

    const columnValues = [...new Set(filteredData.map((item) => item[config.columnGroupBy]))].sort()

    const pivotRows = Object.entries(grouped).map(([rowKey, items]) => {
      const row: any = { rowKey }

      const rowValues = rowKey.split(" | ")
      config.rowGroupBy.forEach((field, index) => {
        row[field] = rowValues[index]
      })

      columnValues.forEach((colValue) => {
        const colItems = items.filter((item) => item[config.columnGroupBy] === colValue)
        if (colItems.length > 0) {
          let value = 0
          if (config.aggregation === "sum") {
            value = colItems.reduce((sum, item) => sum + (item[config.valueField] || 0), 0)
          } else if (config.aggregation === "avg") {
            value = colItems.reduce((sum, item) => sum + (item[config.valueField] || 0), 0) / colItems.length
          } else if (config.aggregation === "count") {
            value = colItems.length
          }
          row[colValue] = value
        } else {
          row[colValue] = 0
        }
      })

      return row
    })

    const totals: any = { rowKey: "TOTALS" }
    columnValues.forEach((colValue) => {
      if (config.aggregation === "sum" || config.aggregation === "count") {
        totals[colValue] = pivotRows.reduce((sum, row) => sum + (row[colValue] || 0), 0)
      } else if (config.aggregation === "avg") {
        const validRows = pivotRows.filter((row) => row[colValue] > 0)
        totals[colValue] =
          validRows.length > 0 ? validRows.reduce((sum, row) => sum + row[colValue], 0) / validRows.length : 0
      }
    })

    return { rows: pivotRows, totals, columnValues }
  }, [data, config, filters, searchTerm])

  const formatValue = (value: number) => {
    if (config.valueType === "currency") {
      return formatCurrency(value)
    } else if (config.valueType === "percent") {
      return formatPercent(value)
    }
    return value.toLocaleString()
  }

  const modalFields = useMemo(() => {
    const fields = []
    const uniqueValues: Record<string, string[]> = {}

    config.rowGroupBy.forEach((field) => {
      uniqueValues[field] = [...new Set(data.map((item) => item[field]).filter(Boolean))]
      fields.push({
        name: field,
        label: field.charAt(0).toUpperCase() + field.slice(1),
        options: uniqueValues[field],
        required: true,
      })
    })

    const commonFields = ["client", "salesRep", "practice"]
    commonFields.forEach((field) => {
      if (data.some((item) => item[field]) && !config.rowGroupBy.includes(field)) {
        uniqueValues[field] = [...new Set(data.map((item) => item[field]).filter(Boolean))]
        fields.push({
          name: field,
          label: field === "salesRep" ? "Sales Rep" : field.charAt(0).toUpperCase() + field.slice(1),
          options: uniqueValues[field],
          required: true,
        })
      }
    })

    return fields
  }, [data, config])

  const handleAddRowClick = () => {
    setIsAddModalOpen(true)
  }

  const handleModalSubmit = (formData: any) => {
    console.log("[v0] New row data:", formData)
    if (onAddRow) {
      onAddRow(formData) // Pass the form data to the parent component
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Financial Year:</span>
            <Select defaultValue={financialYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2022-23">2022-23</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Currency:</span>
            <Select defaultValue={currency}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          {onAddRow && (
            <Button size="sm" onClick={handleAddRowClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-1"
          />

          {Object.entries(filterOptions)
            .slice(0, 3)
            .map(([field, options]) => (
              <Select
                key={field}
                value={filters[field] || "all"}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, [field]: value === "all" ? "" : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {field}</SelectItem>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {config.rowGroupBy.map((field) => (
                  <th key={field} className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-r">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </th>
                ))}
                {pivotData.columnValues.map((colValue) => (
                  <th
                    key={colValue}
                    className="px-4 py-3 text-right text-sm font-medium text-gray-900 border-r min-w-32"
                  >
                    {colValue}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pivotData.rows.map((row, index) => (
                <tr key={row.rowKey} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {config.rowGroupBy.map((field) => (
                    <td key={field} className="px-4 py-3 text-sm text-gray-900 border-r font-medium">
                      {row[field]}
                    </td>
                  ))}
                  {pivotData.columnValues.map((colValue) => (
                    <td key={colValue} className="px-4 py-3 text-sm text-gray-900 border-r text-right">
                      {formatValue(row[colValue] || 0)}
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="bg-gray-100 font-semibold border-t-2">
                <td className="px-4 py-3 text-sm text-gray-900 border-r" colSpan={config.rowGroupBy.length}>
                  TOTALS
                </td>
                {pivotData.columnValues.map((colValue) => (
                  <td key={colValue} className="px-4 py-3 text-sm text-gray-900 border-r text-right">
                    {formatValue(pivotData.totals[colValue] || 0)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <AddRowModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleModalSubmit}
        title={`Add New ${title.replace(" Management", "")} Row`}
        fields={modalFields}
        financialYear={financialYear}
      />
    </div>
  )
}
