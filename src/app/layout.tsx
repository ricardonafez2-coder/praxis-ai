import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://praxis-ia.netlify.app"),
  title: "Praxis AI - Pacientes Virtuales",
  description:
    "Plataforma de simulación clínica con pacientes virtuales impulsados por IA. Practica entrevistas psicológicas y médicas con agentes conversacionales realistas.",
  icons: {
    icon: "/logo-praxis.jpg",
    apple: "/logo-praxis.jpg",
  },
  openGraph: {
    title: "Praxis AI - Pacientes Virtuales",
    description:
      "Simulación clínica con IA para psicología, medicina, odontología y fisioterapia.",
    images: ["/logo-praxis.jpg"],
  },
  twitter: {
    card: "summary",
    title: "Praxis AI - Pacientes Virtuales",
    description:
      "Simulación clínica con IA para psicología, medicina, odontología y fisioterapia.",
    images: ["/logo-praxis.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
