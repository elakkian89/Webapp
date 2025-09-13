import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

// GET all clients
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM clients ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

// POST new client
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, status } = await request.json()

    const result = await pool.query(
      "INSERT INTO clients (name, email, phone, company, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, phone, company, status || "Active"],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
