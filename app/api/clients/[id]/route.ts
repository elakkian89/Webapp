import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

// GET single client
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query("SELECT * FROM clients WHERE id = $1", [params.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching client:", error)
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 })
  }
}

// PUT update client
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, email, phone, company, status } = await request.json()

    const result = await pool.query(
      "UPDATE clients SET name = $1, email = $2, phone = $3, company = $4, status = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      [name, email, phone, company, status, params.id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

// DELETE client
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query("DELETE FROM clients WHERE id = $1 RETURNING *", [params.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Client deleted successfully" })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
