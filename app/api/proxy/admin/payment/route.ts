import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../auth/nextAuth";

// POST - Manually create a payment for a user
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session?.user?.email !== process.env.EMAIL) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const token = jwt.sign(
    { email: session.user.email },
    process.env.NEXTAUTH_SECRET as string,
    { expiresIn: "15m" }
  );

  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.post(`${backendUrl}/admin/payment`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("❌ POST Checkout Error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
