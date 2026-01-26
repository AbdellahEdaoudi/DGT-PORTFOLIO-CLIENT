// app/api/subscriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { authOptions } from "../auth/nextAuth";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { message: "BACKEND_URL not set in environment" },
        { status: 500 }
      );
    }

    const res = await axios.post(`${backendUrl}/api/subscriptions`, body, {
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    console.error("Proxy error:", err.response?.data || err.message);
    const message =
      err.response?.data || "Proxy error: unable to reach backend";

    return NextResponse.json({ message }, { status: err.response?.status || 500 });
  }
}
