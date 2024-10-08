import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";

import Header from "@/components/Header";
import { NextUIProvider } from "@nextui-org/react";
import RecipeFormProvider from "@/context/RecipeFormProvider";
import RecipeForm from "@/components/RecipeForm/RecipeForm";
import EditRecipeProvider from "@/context/EditRecipeProvider";
import EditRecipeForm from "@/components/RecipeForm/EditRecipeForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <RecipeFormProvider>
            <EditRecipeProvider>
              <Header />
              {children}
              <RecipeForm />
              <EditRecipeForm />
            </EditRecipeProvider>
          </RecipeFormProvider>
        </NextUIProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
