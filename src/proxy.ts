import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret"
);

export async function proxy(req: NextRequest) {

  // console.log(" PROXY RUNNING");

  const token = req.cookies.get("token")?.value;

  // console.log("TOKEN:", token);

  //  chưa login
  if (!token) {
    // console.log("NO TOKEN");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, SECRET);
    // console.log("TOKEN VALID");
    return NextResponse.next();
  } catch {
    // console.log("TOKEN INVALID");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/courses/:path*"],
};