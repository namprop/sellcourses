import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/app/lib/mongoose";
import User from "@/app/models/User";
import Course from "@/app/models/Course";

type Params = { params: Promise<{ id: string }> };
type TokenPayload = { id?: string };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để mua khóa học" },
        { status: 401 }
      );
    }

    let userId = "";
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as TokenPayload;
      userId = payload.id || "";
    } catch {
      return NextResponse.json({ error: "Token không hợp lệ" }, { status: 401 });
    }

    const { id: courseId } = await params;
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existed = (user.purchasedCourses || []).some(
      (id: { toString: () => string }) => id.toString() === courseId
    );

    if (existed) {
      return NextResponse.json({ message: "Khóa học đã được mua trước đó" }, { status: 200 });
    }

    user.purchasedCourses = [...(user.purchasedCourses || []), course._id];
    await user.save();

    return NextResponse.json({ message: "Mua khóa học thành công" }, { status: 200 });
  } catch (error) {
    console.error("POST /api/course/[id]/purchase error:", error);
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
  }
}

