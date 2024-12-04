"server only";

import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getDecodedTokenServerside = async () => {
  const tokens = await getTokens(cookies(), {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
    cookieName: process.env.NEXT_PUBLIC_FIREBASE_COOKIE_NAME as string,
    cookieSignatureKeys: [
      process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT as string,
      process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS as string,
    ],
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(
        /\\n/g,
        "\n"
      )!,
    },
  });
  if (!tokens) {
    redirect("/auth/login");
  }

  const { decodedToken } = tokens;

  return decodedToken;
};
