import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../../../../lib/nextAuth";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🔹 إنشاء توكن JWT بنفس أسلوب المثال الأول
    const token = jwt.sign(
      { email: session.user.email },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "15m" }
    );

    const backendUrl = process.env.BACKEND_URL;
    const body = await req.json();
    const { displayLanguage } = body;

    console.log("🔹 Sending displayLanguage update to backend:", `${backendUrl}/users/update/display-language`);

    const response = await axios.put(
      `${backendUrl}/users/update/display-language`,
      { displayLanguage },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });

  } catch (error: any) {
    console.error("❌ Error updating display language:", error.response?.data || error.message);
    return NextResponse.json(
      {
        message: "Failed to update display language",
        error: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
