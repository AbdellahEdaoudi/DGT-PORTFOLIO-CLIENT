// app/api/proxy/custom-domain/set/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../../../lib/nextAuth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const token = jwt.sign(
    { email: session.user.email },
    process.env.NEXTAUTH_SECRET as string,
    { expiresIn: '15m' }
  );

  try {
    const data = await req.json();
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.post(`${backendUrl}/api/custom-domain/set`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error setting custom domain:", error.response?.data || error.message);
    // Return the actual backend error response
    return NextResponse.json(
      error.response?.data || { status: false, message: "Failed to set custom domain" },
      { status: error.response?.status || 500 }
    );
  }
}
