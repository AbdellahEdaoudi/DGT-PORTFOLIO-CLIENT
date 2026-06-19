import {type AuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import LinkedinProvider from "next-auth/providers/linkedin"
import GithubProvider from "next-auth/providers/github"
import axios from "axios";
import jwt from "jsonwebtoken";
export const authOptions : AuthOptions={
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        // LinkedinProvider({
        //     clientId:process.env.LINKEDIN_CLIENT_ID as string,
        //     clientSecret:process.env.LINKEDIN_CLIENT_SECRET as string,
        //     authorization: {
        //         params: {
        //           scope: 'r_liteprofile r_emailaddress w_member_social',
        //         },
        //       },
        // }),
        // GithubProvider({
        //     clientId:process.env.GITHUB_CLIENT_ID as string,
        //     clientSecret:process.env.GITHUB_CLIENT_SECRET as string,
        // }),    
      ],
    session :{
        strategy :"jwt",
        maxAge : 7 *24 *60 * 60 , // 7 day
    },
    jwt :{
        //jwt
    },
    callbacks:{
      async signIn({ user }) {
    try {
      const token = jwt.sign(
        { email: user.email,fullname: user.name },
        process.env.NEXTAUTH_SECRET!,
        { expiresIn: "15m" }
      );
      const backendUrl = process.env.BACKEND_URL;
      const response = await axios.post(`${backendUrl}/users`,{}, {
        headers: { Authorization: `Bearer ${token}` },
      });

    if (response.status === 201) {
    console.log("New user created successfully");
    } else if (response.status === 200) {
    console.log("User already exists");
    }
    return true;
    } catch (error: any) {
      console.error("Error creating user:", error?.response?.data || error.message);
      return false;
    }
  },
    },
    secret:process.env.NEXTAUTH_SECRET,
    // pages :{
    //     signIn: "/Login"
    // }
    
};
