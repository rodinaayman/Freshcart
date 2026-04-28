import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const extractIdFromToken = (token: string) => {
  try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
      const jsonData = JSON.parse(payload);
      return jsonData.id;
  } catch (error) {
    console.error("Failed to extract ID from token", error);
    return null;
  }
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },
  
  providers: [
    CredentialsProvider({
      name: "FreshCart",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        
        const data = await res.json();

        if (res.ok && data.token) {
          const userId = extractIdFromToken(data.token);

          return {
            id: userId,
            name: data.user?.name,
            email: data.user?.email,
            token: data.token,
          };
        }
        return null;
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id; 
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      
      if (session.user) {
        session.user.id = token.id; 
      }
      
      return session;
    }
  },
  
  pages: {
    signIn: '/login',
  },
  
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production", 
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };