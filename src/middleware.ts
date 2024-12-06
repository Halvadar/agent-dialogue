import { NextRequest, NextResponse } from "next/server";
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
} from "next-firebase-auth-edge";
const PUBLIC_PATHS = ["/auth/signup", "/auth/login"];

export async function middleware(request: NextRequest) {
  try {
    return await authMiddleware(request, {
      loginPath: "/api/login",
      logoutPath: "/api/logout",
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
      cookieName: process.env.NEXT_PUBLIC_FIREBASE_COOKIE_NAME as string,
      cookieSignatureKeys: [
        process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT as string,
        process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS as string,
      ],
      cookieSerializeOptions: {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 12 * 60 * 60 * 24,
      },
      serviceAccount: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(
          /\\n/g,
          "\n"
        ),
      },
      handleValidToken: async ({}, headers) => {
        if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
          return redirectToHome(request, {
            path: "/dashboard",
          });
        }

        return NextResponse.next({
          request: {
            headers,
          },
        });
      },
      handleInvalidToken: async (reason) => {
        console.info("Missing or malformed credentials", { reason });

        return redirectToLogin(request, {
          path: "auth/login",
          publicPaths: PUBLIC_PATHS,
        });
      },
      handleError: async (error) => {
        console.error("Unhandled authentication error", { error });

        return redirectToLogin(request, {
          path: "auth/login",
          publicPaths: PUBLIC_PATHS,
        });
      },
    });
  } catch (error) {
    console.error("Middleware initialization error:", error);
    return redirectToLogin(request, {
      path: "auth/login",
      publicPaths: PUBLIC_PATHS,
    });
  }
}

export const config = {
  matcher: [
    "/api/login",
    "/api/logout",
    "/",
    "/((?!_next|favicon.ico|api|.*\\.).*)",
  ],
};
