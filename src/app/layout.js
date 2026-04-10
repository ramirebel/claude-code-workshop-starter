import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { Providers } from "@/components/providers/Providers";
import { SiteHeader } from "@/components/layout/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ActiveTogether",
  description: "Find and join local sports events and outdoor activities.",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers initialUser={user}>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
