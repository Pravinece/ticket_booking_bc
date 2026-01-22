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
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                bus_id INT NOT NULL,
                journey_date DATE NOT NULL,
                total_seats INT NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                payment_status VARCHAR(20) DEFAULT 'pending',
                stripe_payment_intent_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (bus_id) REFERENCES buses(id)
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS seats (
                id SERIAL PRIMARY KEY,
                bus_id INT NOT NULL,
                seat_number INT NOT NULL,
                status VARCHAR(20) DEFAULT 'available',
                passenger_name VARCHAR(100),
                passenger_phone VARCHAR(20),
                booked_date DATE,
                booked_by INT,
                booking_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (bus_id) REFERENCES buses(id),
                FOREIGN KEY (booked_by) REFERENCES users(id),
                FOREIGN KEY (booking_id) REFERENCES bookings(id)
            );
        `);

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