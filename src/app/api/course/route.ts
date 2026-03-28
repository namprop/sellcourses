import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongoose";
import Course from "@/app/models/Course";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";

type TokenPayload = { id?: string };

export async function GET(req: NextRequest) {
  try {
    await connect();
    const courses = await Course.find().sort({ createdAt: -1 });

    const token = req.cookies.get("token")?.value;
    if (!token) {
      const noAuthCourses = courses.map((course) => ({
        ...course.toObject(),
        purchased: false,
      }));
      return NextResponse.json(noAuthCourses, { status: 200 });
    }

    let userId = "";
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as TokenPayload;
      userId = payload.id || "";
    } catch {
      const invalidTokenCourses = courses.map((course) => ({
        ...course.toObject(),
        purchased: false,
      }));
      return NextResponse.json(invalidTokenCourses, { status: 200 });
    }

    const user = await User.findById(userId).select("purchasedCourses");
    const purchasedSet = new Set(
      (user?.purchasedCourses || []).map((courseId: { toString: () => string }) =>
        courseId.toString()
      )
    );

    const responseCourses = courses.map((course) => ({
      ...course.toObject(),
      purchased: purchasedSet.has(course._id.toString()),
    }));

    return NextResponse.json(responseCourses, { status: 200 });
  } catch (error) {
    console.error("GET /api/course error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { title, teacher, price, image, description } = await req.json();

    const errors: Record<string, string> = {};
    if (!title) errors.title = "Title không được để trống";
    if (!teacher) errors.teacher = "Teacher không được để trống";
    if (!price) errors.price = "Price không được để trống";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const course = await Course.create({
      title,
      teacher,
      price,
      image,
      description,
    });

    return NextResponse.json({ message: "Create course success", course }, { status: 201 });
  } catch (error) {
    console.error("POST /api/course error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

