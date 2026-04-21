import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:9999";
    
    const response = await axios.get(`${backendUrl}/api/paypal/plans`, {
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("🔥 PROXY ERROR (PAYPAL PLANS):", error.message);
    return NextResponse.json(
      { error: "Proxy failed", detail: error.message },
      { status: 500 }
    );
  }
}
