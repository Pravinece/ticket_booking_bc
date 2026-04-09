'use server'
import "@/app/lib/db";
import User from "@/app/lib/models/User";
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
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return { error: "Invalid email or password" };
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 60 * 60 * 1000
    });

    return { success: true, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
}

export async function registerUser(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const role = formData.get('role');

  if (!name?.trim() || !email?.trim() || !password?.trim() || password?.length < 8 || !role?.trim()) {
    return { error: "Provide valid details" };
  }

  try {
    const existing = await User.findOne({ email });

    if (existing) {
      return { error: "User already exists with this email" };
    }

    const user = await User.create({ name, email, password, role });
    return { success: true, user: user.toObject() };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const user = await User.findById(decoded.id).select('name email role');
    
    if (!user) return null;
    return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
  } catch (error) {
    return null;
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/3s');
}