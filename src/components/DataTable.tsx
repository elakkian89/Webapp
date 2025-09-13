"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { ChevronUpIcon, ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline"
import { formatDate, formatCurrencyINR, formatNumber, formatPercent } from "../lib/format"

export type ColType = "text" | "number" | "currency" | "date" | "percent"
export type TotalType = "none" | "sum" | "avg"

export interface Column {
  label: string
  key: string
  type: ColType
  total?: TotalType
  align?: "left" | "right"
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  searchable?: boolean
  sortable?: boolean
  showTotalsRow?: boolean
  pageSize?: number
  stickyHeader?: boolean
  zebraRows?: boolean
  showAddRow?: boolean
  onAddRow?: (data: any) => void
  addRowTitle?: string
}

export default function DataTable({
  columns,
  data,
  searchable = true,
  sortable = true,
  showTotalsRow = false,
  pageSize = 25,
  stickyHeader = true,
  zebraRows = true,
  showAddRow = false,
  onAddRow,
  addRowTitle = "Add New Row",
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data

    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key]
        if (value == null) return false
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      }),
    )
  }, [data, searchTerm, columns, searchable])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Calculate totals
  const totals = useMemo(() => {
    if (!showTotalsRow) return {}

    const result: Record<string, any> = {}

    columns.forEach((column) => {
      if (column.total === "sum") {
        result[column.key] = filteredData.reduce((sum, row) => {
          const value = row[column.key]
          return sum + (typeof value === "number" ? value : 0)
        }, 0)
      } else if (column.total === "avg") {
        const values = filteredData.map((row) => row[column.key]).filter((v) => typeof v === "number")
        result[column.key] = values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0
      }
    })

    return result
  }, [filteredData, columns, showTotalsRow])

  const handleSort = (key: string) => {
    if (!sortable) return

    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null
      }
      return { key, direction: "asc" }
    })
  }

  const formatCellValue = (value: any, column: Column) => {
    if (value == null) return "-"

    switch (column.type) {
      case "date":
        return formatDate(value)
      case "currency":
        return formatCurrencyINR(value)
      case "number":
        return formatNumber(value)
      case "percent":
        return formatPercent(value)
      default:
        return String(value)
    }
  }

  const handleAddRowSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onAddRow) {
      onAddRow(formData)
      setFormData({})
      setShowAddModal(false)
    }
  }

  const handleFormChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {(searchable || showAddRow) && (
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
          {searchable && (
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search across all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          )}
          {showAddRow && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Row
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`bg-gray-50/50 ${stickyHeader ? "sticky top-0 z-10" : ""}`}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-5 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    column.align === "right" ? "text-right" : "text-left"
                  } ${sortable ? "cursor-pointer hover:bg-gray-100/50 transition-colors" : ""}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortable &&
                      sortConfig?.key === column.key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 text-blue-600" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={`${zebraRows && index % 2 === 1 ? "bg-gray-50/30" : "bg-white"} hover:bg-blue-50/30 transition-colors`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-5 whitespace-nowrap text-sm text-gray-900 ${
                      column.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {formatCellValue(row[column.key], column)}
                  </td>
                ))}
              </tr>
            ))}
            {showTotalsRow && (
              <tr className="bg-gray-100/80 font-semibold border-t-2 border-gray-200 sticky bottom-0 backdrop-blur-sm">
                {columns.map((column, index) => (
                  <td
                    key={column.key}
                    className={`px-6 py-5 whitespace-nowrap text-sm text-gray-900 ${
                      column.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {index === 0 ? "TOTALS" : formatCellValue(totals[column.key], column)}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div className="text-sm text-gray-600 font-medium">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} results
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{addRowTitle}</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleAddRowSubmit} className="p-6 space-y-5">
              {columns.map((column) => (
                <div key={column.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{column.label} *</label>
                  {column.type === "date" ? (
                    <input
                      type="date"
                      required
                      value={formData[column.key] || ""}
                      onChange={(e) => handleFormChange(column.key, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  ) : column.type === "number" || column.type === "currency" || column.type === "percent" ? (
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData[column.key] || ""}
                      onChange={(e) => handleFormChange(column.key, Number.parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  ) : (
                    <input
                      type="text"
                      required
                      value={formData[column.key] || ""}
                      onChange={(e) => handleFormChange(column.key, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
                >
                  Add Row
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
