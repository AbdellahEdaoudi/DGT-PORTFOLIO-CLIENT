import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = 'nodejs';
export async function GET(req: Request, { params }: { params: { username: string } }) {

  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.get(`${backendUrl}/users/metauser/${params.username}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "error" }, { status: 500 });
  }
}
