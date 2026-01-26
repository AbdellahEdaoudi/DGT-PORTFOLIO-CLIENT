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
    const { searchParams } = new URL(req.url);
    const next_cursor = searchParams.get('next_cursor');
    const folder = searchParams.get('folder');

    // Construct URL with query parameters
    let url = `${backendUrl}/admin/cloudinary-images`;
    const params = new URLSearchParams();
    if (next_cursor) params.append('next_cursor', next_cursor);
    if (folder) params.append('folder', folder);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching Cloudinary images:", error.message);

    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || "Backend error" },
        { status: error.response.status }
      );
    }

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
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

    const body = await req.json();
    const backendUrl = process.env.BACKEND_URL;

    const response = await axios.delete(`${backendUrl}/admin/cloudinary-images`, {
      headers: { Authorization: `Bearer ${token}` },
      data: body
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error deleting Cloudinary image:", error.message);

    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || "Backend error" },
        { status: error.response.status }
      );
    }

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
