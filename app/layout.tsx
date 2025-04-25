import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCProvider } from "@/trpc/client";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
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
    url: "https://youtube-ten-amber.vercel.app",
    siteName: "Youtube",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://github.com/psykat1116/Youtube/blob/master/public/Opengraph.png?raw=true",
        width: 1200,
        height: 630,
        alt: "Youtube",
        type: "image/png",
      },
    ],
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
        <body className={`${poppins.className} antialiased`}>
          <TRPCProvider>
            <Toaster />
            {children}
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
