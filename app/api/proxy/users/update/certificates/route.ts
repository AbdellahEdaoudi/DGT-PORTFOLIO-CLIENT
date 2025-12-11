import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../../../../lib/nextAuth";

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
    const formData = await req.formData();

    console.log("🔹 Sending certificates update to backend");
    const response = await axios.put(`${backendUrl}/users/update/certificates`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error updating certificates:", error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    return NextResponse.json(
      { message: "Failed to update certificates", error: error.response?.data || error.message },
      { status: statusCode }
    );
  }
}
