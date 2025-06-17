"use client"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { ApiService } from "@/lib/api-service"
import { ChevronDown, Tag, Clock, Star } from "lucide-react"

export function ProductMenu() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => ApiService.getCategories(),
    retry: 1,
    staleTime: 10 * 60 * 1000,
  })

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            Products
            <ChevronDown className="w-4 h-4" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
              {/* Quick Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium leading-none">Browse</h4>
                <div className="space-y-2">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                        <Tag className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">All Products</div>
                        <div className="text-xs text-muted-foreground">Browse our complete catalog</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link
                      href="/products/deals"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                        <Tag className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Deals & Offers</div>
                        <div className="text-xs text-muted-foreground">Special discounts</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link
                      href="/products/new"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">New Arrivals</div>
                        <div className="text-xs text-muted-foreground">Latest products</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link
                      href="/products/bestsellers"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Best Sellers</div>
                        <div className="text-xs text-muted-foreground">Most popular items</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium leading-none">Categories</h4>
                <div className="space-y-2">
                  {categories.slice(0, 6).map((category) => (
                    <NavigationMenuLink key={category.id} asChild>
                      <Link
                        href={`/products/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <span className="text-sm">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.product_count}
                        </Badge>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
