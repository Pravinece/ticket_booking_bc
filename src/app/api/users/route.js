import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(req) {
    try {
        const {name, email, password} = await req.json();

        if(!name?.trim() || !email?.trim() || !password?.trim() || password?.length < 8){
            return NextResponse.json({
                message: "Provide Valid Details",
            }, { status: 400 })
        }

        let existing = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [email]
        )

        if(existing.rows.length > 0){
            return NextResponse.json({
                message: "User already exists with this email",
            }, { status: 409 })
        }

        let user = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, password]
        )

        return NextResponse.json({
            message: "User Created Successfully",
            user: user.rows[0]
        }, { status: 201 })

    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 })
    }
}
