import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../../lib/nextAuth";
import axios from "axios";
import jwt from "jsonwebtoken";

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

    console.log("🔹 Sending Socials update to backend:", `${backendUrl}/update/socials`);

    const response = await axios.put(`${backendUrl}/users/update/socials`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Error updating socials:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Failed to update socials", error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
