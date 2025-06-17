"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ApiService } from "@/lib/api-service"
import type { Product } from "@/lib/types"
import { Grid, List, SlidersHorizontal, Tag, Clock } from "lucide-react"

type SortOption = "name" | "price-low" | "price-high" | "rating" | "newest"
type ViewMode = "grid" | "list"

export default function DealsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>("price-low")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showFilters, setShowFilters] = useState(false)

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products", 50],
    queryFn: () => ApiService.getProducts(50),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => ApiService.getCategories(),
    retry: 1,
    staleTime: 10 * 60 * 1000,
  })

  // Filter products to show only "deals" (products with prices ending in .99 or below $100 for demo)
  const dealsProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const isOnSale = product.price < 100 || product.price.toString().endsWith(".99")
      return isOnSale
    })
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = dealsProducts.filter((product: Product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesRating = product.rating >= minRating

      return matchesSearch && matchesCategory && matchesPrice && matchesRating
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [dealsProducts, searchTerm, selectedCategories, priceRange, minRating, sortBy])

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setMinRating(0)
  }

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading amazing deals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Deals & Offers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Deals Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Tag className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Deals & Offers</h1>
            <p className="text-muted-foreground mt-1">
              Special discounts and limited-time offers • {filteredAndSortedProducts.length} deals available
            </p>
          </div>
        </div>

        {/* Deal Timer (Mock) */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Flash Sale Ends In:</span>
            </div>
            <div className="flex gap-2 text-lg font-bold">
              <span className="bg-white/20 px-2 py-1 rounded">12</span>:
              <span className="bg-white/20 px-2 py-1 rounded">34</span>:
              <span className="bg-white/20 px-2 py-1 rounded">56</span>
            </div>
          </div>
        </div>

        {/* Deal Categories */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="destructive" className="cursor-pointer">
            Up to 50% OFF
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Flash Sale
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Clearance
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Buy 2 Get 1
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Free Shipping
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
          <ProductFilters
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategories}
            onPriceRangeChange={setPriceRange}
            onRatingChange={setMinRating}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products Section */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <span className="text-sm text-muted-foreground">{filteredAndSortedProducts.length} deals found</span>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <Tag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No deals found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to find more deals.</p>
              <Button onClick={handleClearFilters}>Clear Filters</Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
            >
              {filteredAndSortedProducts.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
