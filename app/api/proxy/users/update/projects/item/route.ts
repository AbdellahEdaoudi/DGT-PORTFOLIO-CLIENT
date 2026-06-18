import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../../../auth/nextAuth";

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

    // Forward as multipart/form-data to support image uploads
    const formData = await req.formData();

    // Use native fetch instead of axios because Axios in Node.js struggles 
    // with native Web FormData boundaries and field serialization.
    const response = await fetch(`${backendUrl}/users/update/project/item`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT set Content-Type here; fetch will automatically set it with the correct boundary
      },
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error updating project item:", error.message);
    return NextResponse.json(
      { message: "Failed to update project item", error: error.message },
      { status: 500 }
    );
  }
}

