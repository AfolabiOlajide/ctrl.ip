import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import Web3Providers from "@/components/web3-provider";
import Nav from "@/components/nav";
import { NetworkProvider } from "@/lib/context/network-context";
import AppProvider from "@/lib/context/app-context";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: `${SITE_NAME}`,
    description: `${SITE_DESCRIPTION}`,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="max-w-7xl mx-auto border-x border-secondary/30 relative min-h-screen">
                        <div className="block w-px h-full border-l border-secondary/30 absolute top-0 left-6 z-10"></div>
                        <div className="block w-px h-full border-r border-secondary/30 absolute top-0 right-6 z-10"></div>
                        <Web3Providers>
                            <NetworkProvider>
                                <AppProvider>
                                    <Nav />
                                    {children}
                                </AppProvider>
                            </NetworkProvider>
                        </Web3Providers>
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
