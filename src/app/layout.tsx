import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Rotisería Ventas | Control de Ventas",
  description: "Sistema de control de ventas para rotisería",
};

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={` ${poppins.variable} `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
