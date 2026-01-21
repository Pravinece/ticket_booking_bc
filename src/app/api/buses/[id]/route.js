import { pool } from '@/app/lib/db'
import { NextResponse } from "next/server";
import { verifyToken, authResponse } from "@/app/lib/auth";

export async function GET(req, { params }) {
    const user = await verifyToken(req);
    if (!user) {
        return authResponse();
    }
    const id = params?.id
    let { searchParams } = new URL(req.url)
    let date = searchParams.get("date")

    if (!id || !date) {
        return NextResponse.json(
            { message: "bus id and date are required" },
            { status: 400 }
        );
    }

    try {
        let bus = await pool.query("SELECT * FROM buses WHERE id = $1", [id])
        if (bus.rows.length <= 0) {
            return NextResponse.json({
                message: "No Bus found",

            })
        }
        let query = "SELECT * FROM seats WHERE bus_id = $1 AND DATE(booked_date) = $2";
        const values = [id, date];

        const seats = await pool.query(query, values);

        if (seats?.rows?.length > 0) {
            return NextResponse.json({
                seats: seats.rows
            })
        }
        else {
            return NextResponse.json({
                seats: [],
                message: "No rows found"
            })
        }
    } catch (error) {
        return NextResponse.json({
            message: error,
        }, { status: 500 });
    }
}

export async function POST(req) {
    const user = await verifyToken(req);
    if (!user) {
        return authResponse();
    }

    try {
        const { bus_number, bus_name, source, destination, capacity, fare } = await req.json();

        if (!bus_number?.trim() || !bus_name?.trim() || !source?.trim() || !destination?.trim() || !capacity || !fare) {
            return NextResponse.json({
                message: "All fields are required",
            }, { status: 400 })
        }

        const existing = await pool.query(
            `SELECT * FROM buses WHERE bus_number = $1`, [bus_number]
        );

        if (existing.rows.length > 0) {
            return NextResponse.json({
                message: "Bus number already exists",
            }, { status: 409 })
        }

        const bus = await pool.query(
            `INSERT INTO buses (bus_number, bus_name, source, destination, capacity, fare) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [bus_number, bus_name, source, destination, capacity, fare]
        );

        return NextResponse.json({
            message: "Bus created successfully",
            bus: bus.rows[0]
        }, { status: 201 });
    } catch (error) {
        console.log('Bus API Error:', error);
        return NextResponse.json({
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 });
    }
}