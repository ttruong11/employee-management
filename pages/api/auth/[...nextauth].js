import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { yourUserValidationFunction } from "../../../lib/authService";
const jwt = require('jsonwebtoken');
require('dotenv').config();


export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        console.log(process.env.DATABASE_URL)
        try {
          const user = await yourUserValidationFunction(credentials.username, credentials.password);
          if (user) {
            console.log("User authenticated: ", user);
            return { id: user.id, name: user.username };
          } else {
            console.log("Authentication failed: ", credentials);
            return null;
          }
        } catch (error) {
          console.error("Error in authorize function: ", error);
          return null;
        }
      }
    })
  ],
  session: {
    jwt: true,
    maxAge: 3600, 
    // Add session callback for logging
    async session({ session, token, user }) {
      console.log("Session callback: ", { session, token, user });
      session.accessToken = token; 
      return session; 
    }
  },
  jwt: {
    // Add jwt callback for logging
    async encode({ token, secret }) {
      console.log("JWT Encode: ", { token, secret });
      return jwt.sign(token, secret, { algorithm: 'HS256' });
    },
    async decode({ token, secret }) {
      console.log("JWT Decode: ", { token, secret });
      return jwt.verify(token, secret, { algorithms: ['HS256'] });
    }
  },
  database: process.env.DATABASE_URL,
  // Other NextAuth configurations...
});
