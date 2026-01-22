import pool from "@/app/lib/db";
import { NextResponse } from "next/server";
import { verifyToken, authResponse } from "@/app/lib/auth";

export async function GET(req, { params }) {
    const user = await verifyToken(req);
    if (!user) {
        return authResponse();
    }

    try {
        const { id } = params;
        const ticket = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
        
        if (ticket.rows.length === 0) {
            return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
        }

        const seats = await pool.query('SELECT * FROM seats WHERE booking_id = $1', [id]);
        
        return NextResponse.json({ 
            ticket: ticket.rows[0], 
            seats: seats.rows 
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}