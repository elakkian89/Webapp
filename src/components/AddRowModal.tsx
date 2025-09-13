"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface AddRowModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  title: string
  fields: {
    name: string
    label: string
    options: string[]
    required?: boolean
  }[]
  financialYear?: string
}

export default function AddRowModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  financialYear = "2024-25",
}: AddRowModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = fields.filter((field) => field.required)
    const missingFields = requiredFields.filter((field) => !formData[field.name])

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.map((f) => f.label).join(", ")}`)
      return
    }

    onSubmit(formData)
    setFormData({})
    onClose()
  }

  const handleCancel = () => {
    setFormData({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Fill out the form below to add a new row to the table
          </DialogDescription>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Financial Year Display */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">Financial Year: {financialYear}</Label>
          </div>

          {/* Form Fields */}
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-sm font-medium">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              <Select
                value={formData[field.name] || ""}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, [field.name]: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Row</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
