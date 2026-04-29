import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const extractIdFromToken = (token: string) => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
    return JSON.parse(payload).id;
  } catch (e) {
    return null;
  }
};

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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
            id: extractIdFromToken(data.token) ?? "user",
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
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      if (session.user) session.user.id = token.id;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  debug: false, 
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };