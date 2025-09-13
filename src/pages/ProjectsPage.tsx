"use client"

import { useState } from "react"
import DataTable, { type Column } from "../components/DataTable"
import FiltersBar from "../components/FiltersBar"
import { projects as initialProjects } from "../data/projects"

const projectColumns: Column[] = [
  { label: "ID", key: "projectMasterId", type: "number", align: "right" },
  { label: "Client ID", key: "clientMasterId", type: "number", align: "right" },
  { label: "Project Name", key: "projectName", type: "text" },
  { label: "Project Type", key: "projectType", type: "text" },
  { label: "Start Date", key: "projectStartDate", type: "date" },
  { label: "End Date", key: "projectEndDate", type: "date" },
  { label: "Delivery Manager", key: "deliveryManager", type: "text" },
  { label: "Currency", key: "projectCurrency", type: "text" },
  { label: "Status", key: "projectStatus", type: "text" },
  { label: "Project Value", key: "projectValue", type: "currency", total: "sum", align: "right" },
  { label: "Actual End", key: "projectActualEndDate", type: "date" },
]

const projectFilters = [
  { key: "projectName", label: "Project Name", type: "text" as const },
  { key: "projectType", label: "Project Type", type: "dropdown" as const },
  { key: "projectStatus", label: "Status", type: "dropdown" as const },
  { key: "deliveryManager", label: "Delivery Manager", type: "dropdown" as const },
  { key: "projectCurrency", label: "Currency", type: "dropdown" as const },
  { key: "projectStartDate", label: "Project Period", type: "daterange" as const },
  { key: "projectValue", label: "Project Value", type: "numberrange" as const },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects)
  const [filters, setFilters] = useState<Record<string, any>>({})

  const handleAddRow = (formData: any) => {
    const newProject = {
      ...formData,
      projectMasterId: Math.max(...projects.map((p) => p.projectMasterId)) + 1,
    }
    setProjects((prev) => [...prev, newProject])
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Project Master</h1>
        <p className="text-gray-600">Manage your project portfolio and delivery information</p>
      </div>

      <FiltersBar filters={projectFilters} data={projects} onFiltersChange={setFilters} />

      <DataTable
        columns={projectColumns}
        data={projects}
        filters={filters}
        searchable
        sortable
        stickyHeader
        zebraRows
        showTotalsRow
        pageSize={25}
        showAddRow
        onAddRow={handleAddRow}
        addRowTitle="Add New Project"
      />
    </div>
  )
}
