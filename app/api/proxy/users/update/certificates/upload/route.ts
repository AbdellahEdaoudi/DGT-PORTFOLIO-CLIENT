import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../../../../../lib/nextAuth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = jwt.sign(
      { email: session.user.email },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "15m" }
    );

    const backendUrl = process.env.BACKEND_URL;
    
    // Parse FormData from the request
    const formData = await req.formData();
    
    // Create a new FormData instance to send to the backend
    // Since we are in Node.js, we might need to handle this carefully if using axios
    // But commonly just passing the formData directly to axios works if headers are set
    // However, re-construction is often safer to ensure boundary is correct
    
    // In Node 18+ global FormData is available.
    // We can just construct a NEW FormData and copy fields.
    const newFormData = new FormData();
    for (const [key, value] of formData.entries()) {
        newFormData.append(key, value);
    }

    const response = await axios.post(`${backendUrl}/users/update/certificates/upload`, newFormData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        // Axios/FormData will set Content-Type with boundary automatically
         "Content-Type": "multipart/form-data" 
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error uploading certificate image:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Failed to upload certificate image", error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
