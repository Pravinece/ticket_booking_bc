import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS buses (
                id SERIAL PRIMARY KEY,
                bus_number VARCHAR(50) UNIQUE NOT NULL,
                bus_name VARCHAR(255) NOT NULL,
                source VARCHAR(255) NOT NULL,
                destination VARCHAR(255) NOT NULL,
                capacity INTEGER NOT NULL,
                fare DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS seats (
                id SERIAL PRIMARY KEY,
                bus_id INT NOT NULL,
                seat_number INT NOT NULL,
                status VARCHAR(20) DEFAULT 'available',
                booked_by INT,
                booked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(
            `ALTER TABLE seats
            ADD CONSTRAINT fk_bus
            FOREIGN KEY (bus_id) REFERENCES buses(id)`
        )
        await pool.query(
            `ALTER TABLE seats
            ADD CONSTRAINT fk_user
            FOREIGN KEY (booked_by) REFERENCES users(id)`
        )

        return NextResponse.json({
            message: "Database tables created successfully"
        });
    } catch (error) {
        return NextResponse.json({
            message: "Database initialization failed",
            error: error.message
        }, { status: 500 });
    }
}