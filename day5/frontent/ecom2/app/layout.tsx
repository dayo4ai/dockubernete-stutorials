import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { Navbar } from "@/components/navbar"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopHub - Modern E-commerce",
  description: "Discover amazing products with our modern e-commerce platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </CartProvider>
        </Providers>
      </body>
    </html>
  )
}
