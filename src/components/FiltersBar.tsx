"use client"
import { useState, useMemo } from "react"
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline"

export type FilterType = "text" | "dropdown" | "multiselect" | "daterange" | "number"

export interface FilterConfig {
  key: string
  label: string
  type: FilterType
  options?: string[] // For dropdown/multiselect, if not provided will use distinct values from data
}

interface FiltersBarProps {
  filters: FilterConfig[]
  data: any[]
  onFiltersChange: (filters: Record<string, any>) => void
  className?: string
}

export default function FiltersBar({ filters, data, onFiltersChange, className = "" }: FiltersBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [isExpanded, setIsExpanded] = useState(false)

  // Generate options for dropdowns from data if not provided
  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {}

    filters.forEach((filter) => {
      if (filter.type === "dropdown" || filter.type === "multiselect") {
        if (filter.options) {
          options[filter.key] = filter.options
        } else {
          // Extract distinct values from data
          const distinctValues = [
            ...new Set(
              data
                .map((row) => row[filter.key])
                .filter((value) => value != null && value !== "")
                .map((value) => String(value)),
            ),
          ].sort()
          options[filter.key] = distinctValues
        }
      }
    })

    return options
  }, [filters, data])

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters }

    if (value === "" || value === null || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }

    setActiveFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(activeFilters).length > 0

  const renderFilterInput = (filter: FilterConfig) => {
    const value = activeFilters[filter.key] || ""

    switch (filter.type) {
      case "text":
      case "number":
        return (
          <input
            type={filter.type === "number" ? "number" : "text"}
            placeholder={`Filter by ${filter.label.toLowerCase()}...`}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        )

      case "dropdown":
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All {filter.label}</option>
            {filterOptions[filter.key]?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "multiselect":
        const selectedValues = Array.isArray(value) ? value : value ? value.split(";") : []
        return (
          <div className="relative">
            <select
              multiple
              value={selectedValues}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value)
                handleFilterChange(filter.key, selected.length > 0 ? selected.join(";") : "")
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[38px]"
              size={Math.min(5, filterOptions[filter.key]?.length || 1)}
            >
              {filterOptions[filter.key]?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {selectedValues.length > 0 && (
              <div className="mt-1 text-xs text-gray-600">{selectedValues.length} selected</div>
            )}
          </div>
        )

      case "daterange":
        const dateRange = value || { from: "", to: "" }
        return (
          <div className="flex space-x-2">
            <input
              type="date"
              placeholder="From"
              value={dateRange.from || ""}
              onChange={(e) => handleFilterChange(filter.key, { ...dateRange, from: e.target.value })}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <input
              type="date"
              placeholder="To"
              value={dateRange.to || ""}
              onChange={(e) => handleFilterChange(filter.key, { ...dateRange, to: e.target.value })}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        )

      default:
        return null
    }
  }

  if (filters.length === 0) return null

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {Object.keys(activeFilters).length} active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{filter.label}</label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
