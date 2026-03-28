import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/app/lib/mongoose";
import User from "@/app/models/User";

export const GET = async () => {
  // return NextResponse.json({ message: "Hello from the user API!" });

  try {
    await connect();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch all users" },
      {
        status: 500,
      },
    );
  }
};



