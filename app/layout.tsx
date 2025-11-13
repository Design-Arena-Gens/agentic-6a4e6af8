import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astra Chat",
  description: "Conversational assistant powered by Astra AI"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950">
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
          {children}
        </div>
      </body>
    </html>
  );
}
