import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "TOONIFY - Token-Oriented Notation Converter",
    description: "Convert JSON, YAML, HTML, and React code into Token-Oriented Notation optimized for LLM reasoning",
    keywords: ["TOON", "LLM", "converter", "JSON", "YAML", "React", "HTML", "tokens"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body>{children}</body>
        </html>
    );
}
