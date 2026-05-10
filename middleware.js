import { NextResponse } from "next/server";

const LOGIN_PATH = "/management/login";
const DEFAULT_LANDING = "/management/product";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isLogin = pathname === LOGIN_PATH;

  if (!token && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (token && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = DEFAULT_LANDING;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/management/:path*"],
};
