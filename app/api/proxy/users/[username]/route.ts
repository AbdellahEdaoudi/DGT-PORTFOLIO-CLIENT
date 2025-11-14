import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/nextAuth";
import jwt from "jsonwebtoken";
import axios from "axios";


export async function GET(req: Request, { params }: { params: { username: string } }) {
  const session = await getServerSession(authOptions);
  // if (!session?.user?.email) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }
  // const token = jwt.sign(
  //   { email: session.user.email },
  //   process.env.NEXTAUTH_SECRET as string,
  //   { expiresIn: "15m" }
  // );
  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.get(`${backendUrl}/users/username/${params.username}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "error" }, { status: 500 });
  }
}
