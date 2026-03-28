// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { connect } from "@/app/lib/mongoose";
// import User from "@/app/models/User";

// export const POST = async (request: NextRequest) => {
//   try {
//     await connect();
//     const { name, email, password } = await request.json();

//     if (!name || !email || !password) {
//       return NextResponse.json({ error: "Vui lòng cung cấp tên, email và mật khẩu." }, { status: 400 });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ error: "Email đã được sử dụng." }, { status: 409 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     return NextResponse.json({ message: "Đăng ký thành công", user: { id: newUser._id, name: newUser.name, email: newUser.email } }, { status: 201 });
//   } catch (error) {
//     console.error("API auth/register error:", error);
//     return NextResponse.json({ error: "Đã có lỗi máy chủ." }, { status: 500 });
//   }
// };


import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongoose";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const { name, email, password, confirmPassword } = await req.json();

    //  VALIDATION
    const errors: { [key: string]: string } = {};

    // EMAIL
    if (!email) {
      errors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email không hợp lệ";
    }

    // PASSWORD
    if (!password) {
      errors.password = "Password không được để trống";
    } else if (password.length < 6) {
      errors.password = "Password phải có ít nhất 6 ký tự";
    }

    // CONFIRM PASSWORD
    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng nhập lại password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Password không khớp";
    }

    // Nếu có lỗi → return
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    //  CHECK EMAIL EXISTS
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { errors: { email: "Email đã tồn tại" } },
        { status: 400 }
      );
    }

    //  HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    //  CREATE USER
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Register success", user: newUser },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Register failed" },
      { status: 500 }
    );
  }
};