"use client"
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { metaMask } from "wagmi/connectors";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Define the Wagmi Config
const config = createConfig({
  chains: [sepolia],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
  },
});


// ✅ Initialize QueryClient
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta
          name="description"
          content="A simple faucet for the Sepolia testnet."
        />
        <title>Katera Faucet</title>
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>

          {children}
          </WagmiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
