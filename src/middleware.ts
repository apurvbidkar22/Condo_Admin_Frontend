import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hasPermissionForAction } from './helpers/AuthHelper';
import { USER_ACTION } from './components/common/Constants';
export { default } from "next-auth/middleware"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname
  const permissions = token?.user.permissions

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  if (isAuthenticated && !token?.user?.isPasswordReset && path !== "/auth/reset-password") {
    return NextResponse.redirect(new URL('/auth/reset-password', request.url))
  }

  //Manage users
  if (isAuthenticated && path.startsWith('/manage-users') && !hasPermissionForAction("user_management", permissions)) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  if (isAuthenticated && path.startsWith('/manage-users/edit-user') && !hasPermissionForAction("user_management", permissions, USER_ACTION.IS_WRITE)) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  if (isAuthenticated && path.startsWith('/manage-users/create-user') && !hasPermissionForAction("user_management", permissions, USER_ACTION.IS_WRITE)) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  if (isAuthenticated && path.startsWith('/manage-users/manage-permission') && !hasPermissionForAction("user_management", permissions, USER_ACTION.IS_READ)) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  //Manage Buildings
  if (isAuthenticated && path.startsWith('/manage-buildings') && !hasPermissionForAction("manage_buildings", permissions, USER_ACTION.IS_READ)) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  if (isAuthenticated && path.startsWith('/manage-media') && !hasPermissionForAction("manage_building_media", permissions, USER_ACTION.IS_READ)) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  if (isAuthenticated && path.startsWith('/manage-data') && !hasPermissionForAction("manage_building_data", permissions, USER_ACTION.IS_READ)) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }



}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/signin|auth/forgot-password|auth/reset-password|assets/).*)',
  ],
}