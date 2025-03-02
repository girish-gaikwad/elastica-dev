import connectToDB from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("User not found");
        if (!(await bcrypt.compare(credentials.password, user.passwordHash))) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectToDB();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        return "/signup"; // Redirect new users to signup page
      }
      return true; // Allow login if user exists
    },
    async session({ session, token }) {
      await connectToDB();
      const dbUser = await User.findOne({ email: session.user.email });

      if (!dbUser) return null; // Ensure user exists in DB

      session.user.id = dbUser._id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect error pages to login
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
