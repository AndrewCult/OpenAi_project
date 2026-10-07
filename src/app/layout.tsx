import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CustomerStatsProvider } from "@/context/CustomerStatsContext";

export const metadata: Metadata = {
  title: {
    default: "Recipe Chatbot · SummerCamp Bistrò",
    template: "%s",
  },
  description:
    "A deliberately unhelpful AI restaurant: ask for a recipe, get put on hold, never get the recipe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col">
        <CustomerStatsProvider>
          <Header />
          <div className=" flex items-center justify-center !p-4">
            {children}
          </div>
          <Footer />
        </CustomerStatsProvider>
      </body>
    </html>
  );
}
