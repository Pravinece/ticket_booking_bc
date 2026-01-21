import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import pool from "./db";

export async function verifyToken(req) {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    
    const token = authHeader.substring(7);
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        
        // Validate user exists in database
        const userResult = await pool.query(
            `SELECT id, name, email FROM users WHERE id = $1 AND email = $2`,
            [decoded.id, decoded.email]
        );
        
        if (userResult.rows.length === 0) {
            return null; // User doesn't exist or token data is fake
        }
        
        return userResult.rows[0]; // Return actual user data from DB
    } catch (error) {
        return null;
    }
}

export function authResponse() {
    return NextResponse.json({
        message: "Authentication required"
    }, { status: 401 });
}