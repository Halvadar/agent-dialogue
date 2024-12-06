import type { Metadata } from "next";
import localFont from "next/font/local";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";

import AppTheme from "@/components/templates/shared-theme/AppTheme";
import { AuthContextProvider } from "./context/AuthContext";
import { CssBaseline } from "@mui/material";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${roboto.variable}`}
      >
        <AppRouterCacheProvider>
          <AppTheme>
            <CssBaseline enableColorScheme />
            <AuthContextProvider>{children}</AuthContextProvider>
          </AppTheme>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
