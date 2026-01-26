import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../../../auth/nextAuth"; // Adjusted path manually based on depth

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = jwt.sign(
      { email: session.user.email },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "15m" }
    );

    const backendUrl = process.env.BACKEND_URL;
    const body = await req.json();

    const response = await axios.put(`${backendUrl}/users/update/project/item`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error updating project item:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Failed to update project item", error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
