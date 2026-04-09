import { NextResponse } from "next/server";
import "@/app/lib/db";
import User from "@/app/lib/models/User";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password?.trim() || password.length < 8) {
      return NextResponse.json({ message: "Provide valid details (password min 8 chars)" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 409 });
    }

    const user = await User.create({ name, email, password, role: "admin" });

    return NextResponse.json({
      message: "Admin user created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}