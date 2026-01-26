import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/nextAuth";
import axios from "axios";
import jwt from "jsonwebtoken";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const token = jwt.sign(
      { email: session.user.email },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "15m" }
    );
    const backendUrl = process.env.BACKEND_URL;
    const formData = await req.formData();

    console.log("🔹 Sending update to backend:", `${backendUrl}/update/user-info`);
    const response = await axios.put(`${backendUrl}/users/update/user-info`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Error updating user:", error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    return NextResponse.json(
      {
        message: "Failed to update user",
        error: error.response?.data || error.message,
      },
      { status: statusCode }
    );
  }
}
