import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/nextAuth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ valid: false, msg: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json({ valid: false, msg: "BACKEND_URL not set" }, { status: 500 });
    }

    const res = await axios.post(`${backendUrl}/api/promo/validate`, body, {
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    console.error("error:", err.response?.data || err.message);

    const status = err.response?.status || 500;
    const msg =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Failed to validate promo code";

    return NextResponse.json({ valid: false, msg }, { status });
  }
}
