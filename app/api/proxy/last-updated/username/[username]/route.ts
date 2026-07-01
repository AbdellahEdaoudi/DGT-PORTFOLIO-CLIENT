import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.get(`${backendUrl}/last-updated/username/${username}`);
    
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    if (err.response) {
      return NextResponse.json(err.response.data, { status: err.response.status });
    }
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
