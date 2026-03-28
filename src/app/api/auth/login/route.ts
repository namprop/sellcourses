
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongoose";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const { email, password } = await req.json();

    // VALIDATION (GIỮ NGUYÊN)
    const errors: { [key: string]: string } = {};

    if (!email) {
      errors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!password) {
      errors.password = "Password không được để trống";
    } else if (password.length < 6) {
      errors.password = "Password phải có ít nhất 6 ký tự";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    //  CHECK USER
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { errors: { email: "Thông tin tài khoản không chính xác" } },
        { status: 404 }
      );
    }

    //  CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { errors: { password: "Thông tin tài khoản không chính xác" } },
        { status: 400 }
      );
    }

    // JWT (THÊM MỚI)
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    //  RESPONSE + COOKIE
    const response = NextResponse.json(
      {
        message: "Login success",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // production → true
      sameSite: "lax",
      path: "/",
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
};