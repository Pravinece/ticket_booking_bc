import pool from "@/app/lib/db";
import { NextResponse } from "next/server";
import { verifyToken, authResponse } from "@/app/lib/auth";

export async function GET(req) {
    const user = await verifyToken(req);
    if (!user) {
        return authResponse();
    }

    let { searchParams } = new URL(req.url)
    let source = searchParams.get("source")
    let destination = searchParams.get("destination")

    try {
        let query = "SELECT * FROM buses WHERE 1=1";
        const values = [];

        if (source) {
            values.push(source);
            query += ` AND source = $${values.length}`;
        }

        if (destination) {
            values.push(destination);
            query += ` AND destination = $${values.length}`;
        }

        const buses = await pool.query(query, values);

        return NextResponse.json({
            buses: buses.rows
        });
    } catch (error) {
        return NextResponse.json({
            message: "Failed to fetch buses",
            error: error.message
        }, { status: 500 });
    }
}

export async function POST(req) {
    const user = await verifyToken(req);
    if (!user) {
        return authResponse();
    }

    if (user.role !== 'admin') {
        return NextResponse.json({
            message: "Only admin users can create buses",
        }, { status: 403 })
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