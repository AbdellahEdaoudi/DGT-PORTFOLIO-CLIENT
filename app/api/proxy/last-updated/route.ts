import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../auth/nextAuth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.NEXTAUTH_SECRET) {
    console.error("NEXTAUTH_SECRET is missing");
    return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
  }

  const token = jwt.sign(
    { email: session.user.email },
    process.env.NEXTAUTH_SECRET as string,
    { expiresIn: "15m" }
  );

  try {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      console.error("BACKEND_URL is missing");
      return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
    }
    const response = await axios.get(`${backendUrl}/last-updated`, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    });
    return NextResponse.json(response.data, { status: response.status });

  } catch (error: any) {
    console.error("🔥 PROXY ERROR:", {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      backendUrl: process.env.BACKEND_URL,
      tokenExists: !!process.env.NEXTAUTH_SECRET,
      sessionEmail: session?.user?.email,
    });

    return NextResponse.json({ error: "Proxy failed", detail: error?.message }, { status: 500 });
  }
}
