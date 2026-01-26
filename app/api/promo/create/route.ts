import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { authOptions } from "../../auth/nextAuth";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.email !== process.env.EMAIL) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json({ message: "BACKEND_URL not set" }, { status: 500 });
    }

    const res = await axios.post(`${backendUrl}/api/promo/create`, body, {
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({
      message: err.response?.data?.error || err.message || "Unknown error",
      code: err.response?.data?.code || undefined,
    }, { status: err.response?.status || 500 });
  }
}
