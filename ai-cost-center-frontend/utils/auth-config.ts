import NextAuth from 'next-auth'
import Credentials from '@auth/core/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        if (email === 'demo@finops.ai' && password === 'demo1234') {
          return { id: '1', name: 'Demo User', email }
        }
        if (email && password && email.includes('@') && password.length >= 4) {
          return { id: '2', name: email.split('@')[0], email }
        }
        return null
      },
    }),
  ],
  pages: { signIn: '/login' },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
  trustHost: true,
})
