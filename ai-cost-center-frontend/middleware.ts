export { auth as middleware } from '@/utils/auth-config'

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/data|_next/image|favicon.ico|login).*)'],
}
