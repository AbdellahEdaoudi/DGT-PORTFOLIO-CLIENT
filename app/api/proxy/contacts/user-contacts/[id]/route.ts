import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import axios from "axios";
import { authOptions } from "../../../../auth/nextAuth";

function makeToken(email: string) {
  return jwt.sign({ email }, process.env.NEXTAUTH_SECRET as string, { expiresIn: "15m" });
}

// DELETE /api/proxy/contacts/user-contacts/:id
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  if (!id) return NextResponse.json({ message: "Missing ID" }, { status: 400 });

  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.delete(`${backendUrl}/contacts/user-contacts/${id}`, {
      headers: { Authorization: `Bearer ${makeToken(session.user.email)}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Delete contact proxy error:", error?.response?.data || error?.message);
    if (error.response) return NextResponse.json({ message: error.response.data?.message || "Backend error" }, { status: error.response.status });
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
