import type { Metadata } from "next";
import { Navbar } from "@/shared/components/navbar/navbar";
import { openRunde } from "@/shared/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Willow Pages",
  description: "Build your alter-brain, for you and your team.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${openRunde.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
