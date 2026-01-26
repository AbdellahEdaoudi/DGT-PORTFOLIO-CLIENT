import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../../../auth/nextAuth";

export async function DELETE(req: Request, props: { params: Promise<{ educationId: string }> }) {
  try {
    const params = await props.params;
    const { educationId } = params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = jwt.sign(
      { email: session.user.email },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "15m" }
    );

    const backendUrl = process.env.BACKEND_URL;

    const response = await axios.delete(`${backendUrl}/users/update/education/${educationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error deleting education:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Failed to delete education", error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
