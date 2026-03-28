import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logout success" });

  res.cookies.set("token", "", {
    httpOnly: true,
    secure: false, // production 
    sameSite: "lax",
    path: "/",     // PHẢI GIỐNG LOGIN
    expires: new Date(0), // xoá cookie
  });

  return res;
}