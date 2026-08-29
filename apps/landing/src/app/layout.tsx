import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Willow Pages",
  description: "Build your alter-brain, for you and your team.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
