import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import axios from "axios";
import { authOptions } from "../../../../lib/nextAuth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const token = jwt.sign(
      { email: session.user.email },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "15m" }
    );

    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.post(`${backendUrl}/contacts`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error proxying contact request:", error.message);

    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || "Backend error" },
        { status: error.response.status }
      );
    }

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
