import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "@/trpc/client";

const roboto = Roboto({
  subsets: [
    "latin",
    "latin-ext",
    "greek",
    "greek-ext",
    "math",
    "symbols",
    "vietnamese",
    "cyrillic",
    "cyrillic-ext",
  ],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Youtube | Home of Videos and Music You Love",
  description:
    "Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.",
  keywords: [
    "music",
    "share",
    "world",
    "videos",
    "upload",
    "family",
    "friends",
    "youtube",
    "content",
    "entertainment",
    "youtube clone",
    "video sharing",
    "video content",
    "video hosting",
    "video platform",
    "video streaming",
    "streaming platform",
    "video clone github",
  ],
  authors: {
    name: "Saikat Samanta",
    url: "https://portfolio-one-gilt-34.vercel.app/",
  },
  creator: "Saikat Samanta",
  applicationName: "Youtube",
  openGraph: {
    title: "Youtube",
    description:
      "Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.",
    url: "",
    siteName: "Youtube",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body className={`${roboto.className} antialiased`}>
          <TRPCProvider>{children}</TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
