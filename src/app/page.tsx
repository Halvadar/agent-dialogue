import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Home() {
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
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-xl mb-4">Super secure home page</h1>
      <p>
        Only <strong>{tokens?.decodedToken.email}</strong> holds the magic key
        to this kingdom!
      </p>
    </main>
  );
}
