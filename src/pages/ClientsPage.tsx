"use client"

import { useState } from "react"
import DataTable, { type Column } from "../components/DataTable"
import FiltersBar from "../components/FiltersBar"
import { clients as initialClients } from "../data/clients"

const clientColumns: Column[] = [
  { label: "ID", key: "clientMasterId", type: "number", align: "right" },
  { label: "Client Name", key: "clientName", type: "text" },
  { label: "Client Type", key: "clientType", type: "text" },
  { label: "Technology", key: "technology", type: "text" },
  { label: "Client Group", key: "clientGroup", type: "text" },
  { label: "Region", key: "region", type: "text" },
  { label: "State", key: "state", type: "text" },
  { label: "City", key: "city", type: "text" },
  { label: "Address", key: "address", type: "text" },
  { label: "Time Zone", key: "timeZone", type: "text" },
  { label: "Engagement Start", key: "engagementStart", type: "date" },
  { label: "Engagement End", key: "engagementEnd", type: "date" },
]

const clientFilters = [
  { key: "clientName", label: "Client Name", type: "text" as const },
  { key: "clientType", label: "Client Type", type: "dropdown" as const },
  { key: "status", label: "Status", type: "dropdown" as const },
  { key: "technology", label: "Technology", type: "multiselect" as const },
  { key: "clientGroup", label: "Client Group", type: "text" as const },
  { key: "region", label: "Region", type: "dropdown" as const },
  { key: "state", label: "State", type: "text" as const },
  { key: "city", label: "City", type: "text" as const },
  { key: "address", label: "Address", type: "text" as const },
  { key: "timeZone", label: "Timezone", type: "text" as const },
  { key: "engagementStart", label: "Engagement Start", type: "daterange" as const },
  { key: "engagementEnd", label: "Engagement End", type: "daterange" as const },
]

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients)
  const [filters, setFilters] = useState<Record<string, any>>({})

  const handleAddRow = (formData: any) => {
    const newClient = {
      ...formData,
      clientMasterId: Math.max(...clients.map((c) => c.clientMasterId)) + 1,
    }
    setClients((prev) => [...prev, newClient])
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Client Master</h1>
        <p className="text-gray-600">Manage your client information and relationships</p>
      </div>

      <FiltersBar filters={clientFilters} data={clients} onFiltersChange={setFilters} />

      <DataTable
        columns={clientColumns}
        data={clients}
        filters={filters}
        searchable
        sortable
        stickyHeader
        zebraRows
        pageSize={25}
        showAddRow
        onAddRow={handleAddRow}
        addRowTitle="Add New Client"
      />
    </div>
  )
}
