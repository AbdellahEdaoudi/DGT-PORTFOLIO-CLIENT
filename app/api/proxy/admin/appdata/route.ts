import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../auth/nextAuth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session?.user?.email !== process.env.EMAIL) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = jwt.sign(
      { email: session.user.email },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "15m" }
    );

    const backendUrl = process.env.BACKEND_URL;

    const response = await axios.get(`${backendUrl}/admin/appdata`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching appdata:", error.message);

    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || "Backend error" },
        { status: error.response.status }
      );
    }

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
