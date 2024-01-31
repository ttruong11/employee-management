import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { yourUserValidationFunction } from "../../../lib/authService";
import { useRouter } from "next/router"; // Import the useRouter hook
const jwt = require('jsonwebtoken');

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
        
        const user = await yourUserValidationFunction(credentials.username, credentials.password);
        
        if (user) {
          console.log("User is authenticated...");
          // Return a response indicating successful login
          return Promise.resolve({ id: user.id, name: user.username });
        } else {
          return Promise.resolve(null);
        }
      }
    })
  ],
  session: {
    jwt: true, // Enable JSON Web Tokens for session
  },
  
  database: process.env.DATABASE_URL,

  // Additional NextAuth configuration...
});
