import NextAuth from "next-auth"
import { authOptions } from "../../../../lib/nextAuth"
export const runtime = 'nodejs';
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }