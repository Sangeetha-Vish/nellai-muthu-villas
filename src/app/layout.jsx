import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { FloatingCart } from "@/components/FloatingCart";

const playfair = Playfair_Display({
    variable: "--font-serif",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const lato = Lato({
    variable: "--font-sans",
    subsets: ["latin"],
    weight: ["300", "400", "700"],
});

export const metadata = {
    title: "Nellai Muthu Vilas - Traditional Digital Sweet Shop",
    description: "Experience the heritage and tradition of Nellai Muthu Vilas sweets.",
};

export default function RootLayout({
    children,
}) {
    return (
        <html lang="en">
            <body
                className={`${playfair.variable} ${lato.variable} antialiased`}
            >
                <Providers>
                    {children}
                    <Footer />
                    <FloatingCart />
                </Providers>
            </body>
        </html>
    );
}
