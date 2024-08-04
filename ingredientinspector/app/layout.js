import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ingredient Inspector",
  description: "Ingredient Inspector is your go-to tool for analyzing and understanding food ingredients. Our website helps you make informed decisions by providing detailed information about the ingredients in your favorite products. Discover allergen warnings, nutritional facts, and potential health impacts to ensure what you eat aligns with your dietary needs and preferences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
