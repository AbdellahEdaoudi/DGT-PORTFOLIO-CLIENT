import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = 'nodejs';
export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.get(`${backendUrl}/users/username/${params.username}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    if (err.response && err.response.status === 404) {  
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: err.message || "error" }, { status: 500 });
  }
}
