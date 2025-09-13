import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

// GET all billing records
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT b.*, c.name as client_name 
      FROM billing b 
      LEFT JOIN clients c ON b.client_id = c.id 
      ORDER BY b.month_year DESC, b.created_at DESC
    `)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching billing records:", error)
    return NextResponse.json({ error: "Failed to fetch billing records" }, { status: 500 })
  }
}

// POST new billing record
export async function POST(request: NextRequest) {
  try {
    const { account_type, client_id, sales_rep, practice, month_year, amount } = await request.json()

    const result = await pool.query(
      "INSERT INTO billing (account_type, client_id, sales_rep, practice, month_year, amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [account_type, client_id, sales_rep, practice, month_year, amount || 0],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating billing record:", error)
    return NextResponse.json({ error: "Failed to create billing record" }, { status: 500 })
  }
}
