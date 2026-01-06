import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WellnessChatbot from "@/components/WellnessChatbot";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Mental Health App",
    description: "Early Mental Health Prediction using Deep Learning",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body className={inter.className}>
                <LanguageProvider>
                    <Navbar />
                    {children}
                    <WellnessChatbot />
                </LanguageProvider>
            </body>
        </html>
    );
}
