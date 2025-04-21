"use client";

import { useState } from "react";
import superjson from "superjson";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

import type { AppRouter } from "./routers/_app";
import { makeQueryClient } from "./query-client";
import { WEBSITE_URL } from "@/constant";

let clientQueryClientSingleton: QueryClient;
export const trpc = createTRPCReact<AppRouter>();

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  return (clientQueryClientSingleton ??= makeQueryClient());
}

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";

    // !/ Vercel provides the URL in the environment variable
    // ? If use another hosting provider, you can set the URL in the environment variable

    if (process.env.VERCEL_URL) return WEBSITE_URL;
    return "http://localhost:3000";
  })();

  return `${base}/api/trpc`;
}

export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
          async headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
