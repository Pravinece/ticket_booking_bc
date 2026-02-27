import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req){
    try {
        const {email, password} = await req.json();

        if(!email?.trim() || !password?.trim()){
            return NextResponse.json({
                message: "Email and password are required",
            }, { status: 400 })
        }

        const user = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [email] 
        )

        if(user.rows.length === 0){
            return NextResponse.json({
                message: "Invalid email or password",
            }, { status: 401 })
        }

        if(user.rows[0].password !== password){
            return NextResponse.json({
                message: "Invalid email or password",
            }, { status: 401 })
        }

        const token = jwt.sign(
            { 
                id: user.rows[0].id, 
                email: user.rows[0].email,
                role: user.rows[0].role
            },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "24h" }
        );

        return NextResponse.json({
            message: "Login successful",
            token,
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                email: user.rows[0].email,
                role: user.rows[0].role
            }
        })
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 })
    }
}