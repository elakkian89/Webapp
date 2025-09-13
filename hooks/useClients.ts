"use client"

import { useState, useEffect } from "react"

interface Client {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  status: string
  created_at: string
  updated_at: string
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/clients")
      if (!response.ok) throw new Error("Failed to fetch clients")
      const data = await response.json()
      setClients(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addClient = async (clientData: Omit<Client, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      })
      if (!response.ok) throw new Error("Failed to add client")
      const newClient = await response.json()
      setClients((prev) => [newClient, ...prev])
      return newClient
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add client")
      throw err
    }
  }

  const updateClient = async (id: number, clientData: Partial<Client>) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      })
      if (!response.ok) throw new Error("Failed to update client")
      const updatedClient = await response.json()
      setClients((prev) => prev.map((client) => (client.id === id ? updatedClient : client)))
      return updatedClient
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update client")
      throw err
    }
  }

  const deleteClient = async (id: number) => {
    try {
      const response = await fetch(`/api/clients/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete client")
      setClients((prev) => prev.filter((client) => client.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete client")
      throw err
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return {
    clients,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
  }
}
