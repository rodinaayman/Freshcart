import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        if (res.ok && data.token) {
          return {
            id: data.user?.id || "user",
            name: data.user?.name,
            email: data.user?.email,
            token: data.token
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.accessToken = user.token;
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: { signIn: "/login" }
});

export { handler as GET, handler as POST };