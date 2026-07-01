// app/api/payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/nextAuth";
import axios from "axios";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ code: "UNAUTHORIZED", message: "You must be logged in." }, { status: 401 });
  }

  try {
    const token = jwt.sign(
      { email: session.user.email },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "15m" }
    );

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      console.error("BACKEND_URL is not configured");
      return NextResponse.json({ code: "SERVER_ERROR", message: "Server configuration error." }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));

    const res = await axios.post(`${backendUrl}/api/payment`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(res.data, { status: res.status });

  } catch (err: any) {
    const code = err.response?.data?.code || "SERVER_ERROR";
    const message = err.response?.data?.message || err.message;
    const status = err.response?.status || 500;

    console.error(`Proxy error [${status}] [${code}]:`, message);

    if (!err.response) {
      return NextResponse.json({ code: "SERVER_UNREACHABLE", message: "Cannot connect to the server." }, { status: 503 });
    }

    return NextResponse.json({ code, message }, { status });
  }
}
