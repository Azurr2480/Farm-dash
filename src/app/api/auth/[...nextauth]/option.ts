import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const options: NextAuthOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
          })
    ],
    callbacks: {
        async signIn({ user }) {
          const allowedEmails = ["azzuri24800@gmail.com"]; // Replace with your email
    
          if (!allowedEmails.includes(user.email ?? "")) {
            // Alert and redirect on the client side
            return "/access-denied"; 
          }
    
          return true; // Allow sign-in
        },
      },
}