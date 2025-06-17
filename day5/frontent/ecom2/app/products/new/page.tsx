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
import { Grid, List, SlidersHorizontal, Sparkles } from "lucide-react"

type SortOption = "newest" | "name" | "price-low" | "price-high" | "rating"
type ViewMode = "grid" | "list"

export default function NewArrivalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>("newest")
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

  // Filter products to show only "new arrivals" (products created in last 30 days for demo)
  const newProducts = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return products.filter((product: Product) => {
      const productDate = new Date(product.created_at)
      return productDate >= thirtyDaysAgo
    })
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = newProducts.filter((product: Product) => {
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
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [newProducts, searchTerm, selectedCategories, priceRange, minRating, sortBy])

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
          <p className="text-muted-foreground">Loading new arrivals...</p>
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
            <BreadcrumbPage>New Arrivals</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* New Arrivals Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Sparkles className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">New Arrivals</h1>
            <p className="text-muted-foreground mt-1">
              Fresh products just added to our collection • {filteredAndSortedProducts.length} new items
            </p>
          </div>
        </div>

        {/* New Arrival Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="bg-green-600">
            Just Added
          </Badge>
          <Badge variant="outline">This Week</Badge>
          <Badge variant="outline">Trending</Badge>
          <Badge variant="outline">Limited Edition</Badge>
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
              <span className="text-sm text-muted-foreground">{filteredAndSortedProducts.length} new products</span>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
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
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No new arrivals found</h3>
              <p className="text-muted-foreground mb-4">Check back soon for new products or adjust your filters.</p>
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
