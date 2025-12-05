import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: Request,
  { params }: { params: { customDomain: string } }
) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.get(`${backendUrl}/users/customdomain/${params.customDomain}`);
    
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    if (err.response) {
      const msg = err.response.data?.message;
      
      if (msg === "User not found") {
        return NextResponse.json({ message: msg }, { status: 404 });
      }
      
      if (msg === "No subscription found for this user") {
        return NextResponse.json({ message: msg }, { status: 404 });
      }
      
      if (msg === "Your subscription is not active. Please renew or subscribe.") {
        return NextResponse.json({ message: msg }, { status: 403 });
      }
    }
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
