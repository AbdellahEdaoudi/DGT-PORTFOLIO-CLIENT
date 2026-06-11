import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import axios from "axios";
import { authOptions } from "../../../auth/nextAuth";

function makeToken(email: string) {
  return jwt.sign({ email }, process.env.NEXTAUTH_SECRET as string, { expiresIn: "15m" });
}

// GET /api/proxy/contacts/user-contacts
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.get(`${backendUrl}/contacts/user-contacts`, {
      headers: { Authorization: `Bearer ${makeToken(session.user.email)}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    if (error.response) return NextResponse.json({ message: error.response.data?.message || "Backend error" }, { status: error.response.status });
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
