import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// Only offer the sign-in methods that are configured, so a missing key
// hides that button instead of breaking sign-in.
const providers = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }));
}
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(GithubProvider({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }));
}

export const authOptions = {
  providers,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/user-auth" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false; // sessions are owned by email address
      await dbConnect();
      await User.updateOne(
        { email: user.email },
        {
          $set: { profilePicture: user.image },
          $setOnInsert: { name: user.name || user.email.split("@")[0], email: user.email },
        },
        { upsert: true }
      );
      return true;
    },
  },
};
