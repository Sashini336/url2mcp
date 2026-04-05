import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.githubId = (profile as { id?: number }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { githubId?: number | string }).githubId = token.githubId as number | string;
      }
      return session;
    },
  },
});
