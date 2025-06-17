"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CartSidebar } from "./cart-sidebar"
import { Store, User } from "lucide-react"
import { ProductMenu } from "./product-menu"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Store className="w-6 h-6" />
          ShopHub
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <ProductMenu />
          <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/cart" className="text-sm font-medium hover:text-primary transition-colors">
            Cart
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <CartSidebar />
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
