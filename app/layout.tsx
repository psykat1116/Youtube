import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

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
    "youtube",
    "videos",
    "music",
    "upload",
    "share",
    "friends",
    "family",
    "world",
    "content",
    "entertainment",
    "streaming",
    "platform",
    "community",
    "channels",
    "subscriptions",
    "trending",
    "recommendations",
    "search",
    "playlists",
    "live",
    "events",
    "youtube clone",
    "video sharing",
    "video platform",
    "video hosting",
    "video streaming",
    "video content",
    "video clone github",
  ],
  authors: {
    name: "Saikat Samanta",
    url: "https://portfolio-one-gilt-34.vercel.app/",
  },
  creator: "Saikat Samanta",
  applicationName: "Youtube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
}
