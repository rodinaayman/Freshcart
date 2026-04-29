import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const data = await res.json()
        if (res.ok && data.token) {
          return {
            id: data.user?.id || "user",
            name: data.user?.name,
            email: data.user?.email,
            token: data.token
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.accessToken = user.token
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      return session
    }
  }
})

export const { GET, POST } = handlers