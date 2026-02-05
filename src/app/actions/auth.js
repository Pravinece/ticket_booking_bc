'use server'
import pool from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginUser(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email?.trim() || !password?.trim()) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await pool.query(
      `SELECT * FROM users WHERE email = $1`, [email]
    );

    if (user.rows.length === 0 || user.rows[0].password !== password) {
      return { error: "Invalid email or password" };
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

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    return { success: true, user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role } };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
}

export async function registerUser(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!name?.trim() || !email?.trim() || !password?.trim() || password?.length < 8) {
    return { error: "Provide valid details" };
  }

  try {
    const existing = await pool.query(
      `SELECT * FROM users WHERE email = $1`, [email]
    );

    if (existing.rows.length > 0) {
      return { error: "User already exists with this email" };
    }

    const user = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, password]
    );

    return { success: true, user: user.rows[0] };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
}

export async function getCurrentUser() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const user = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
    
    return user.rows[0] || null;
  } catch (error) {
    return null;
  }
}

export async function logoutUser() {
  cookies().delete('token');
  redirect('/3s');
}