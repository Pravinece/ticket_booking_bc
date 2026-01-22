import pool from "@/app/lib/db";
import { NextResponse } from "next/server";
import { verifyToken, authResponse } from "@/app/lib/auth";

export async function GET(req) {
    const user = await verifyToken(req);
    if (!user) {
        return authResponse();
    }

    try {
        const result = await pool.query('SELECT * FROM bookings WHERE user_id = $1', [user.id]);
        
        return NextResponse.json({
            message: result.rows.length > 0 ? "Data found" : "Data not found", 
            data: result.rows
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}