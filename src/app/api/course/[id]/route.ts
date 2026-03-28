import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongoose";
import Course from "@/app/models/Course";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";

type Params = { params: Promise<{ id: string }> };
type TokenPayload = { id?: string };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connect();
    const { id } = await params;
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { ...course.toObject(), purchased: false },
        { status: 200 }
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
      return NextResponse.json(
        { ...course.toObject(), purchased: false },
        { status: 200 }
      );
    }

    const user = await User.findById(userId).select("purchasedCourses");
    const purchased = (user?.purchasedCourses || []).some(
      (courseId: { toString: () => string }) => courseId.toString() === id
    );

    return NextResponse.json(
      { ...course.toObject(), purchased },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/course/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connect();
    const { id } = await params;
    const data = await req.json();

    const course = await Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Update course success", course }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/course/[id] error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connect();
    const { id } = await params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Delete course success" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/course/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}

