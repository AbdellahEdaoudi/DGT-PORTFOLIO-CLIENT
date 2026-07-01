import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../../auth/nextAuth";

// DELETE payment by ID
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session?.user?.email !== process.env.EMAIL) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const token = jwt.sign(
    { email: session.user.email },
    process.env.NEXTAUTH_SECRET as string,
    { expiresIn: "15m" }
  );

  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.delete(`${backendUrl}/admin/payment/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error deleting payment:", error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// PUT (Update) payment by ID
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session?.user?.email !== process.env.EMAIL) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const token = jwt.sign(
    { email: session.user.email },
    process.env.NEXTAUTH_SECRET as string,
    { expiresIn: "15m" }
  );

  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.put(`${backendUrl}/admin/payment/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error updating payment:", error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
