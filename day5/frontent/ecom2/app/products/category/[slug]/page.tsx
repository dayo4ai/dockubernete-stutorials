"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Grid, List, SlidersHorizontal, Package } from "lucide-react"

type SortOption = "name" | "price-low" | "price-high" | "rating" | "newest"
type ViewMode = "grid" | "list"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

// Helper function to convert slug to category name
const slugToCategory = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Helper function to convert category name to slug
const categoryToSlug = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = slugToCategory(params.slug)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([categoryName])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Update selected categories when category changes
  useEffect(() => {
    setSelectedCategories([categoryName])
  }, [categoryName])

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

  // Find current category info
  const currentCategory = categories.find(
    (cat) => categoryToSlug(cat.name) === params.slug || cat.name.toLowerCase() === categoryName.toLowerCase(),
  )

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product: Product) => {
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
  }, [products, searchTerm, selectedCategories, priceRange, minRating, sortBy])

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([categoryName]) // Keep the current category selected
    setPriceRange([0, 1000])
    setMinRating(0)
  }

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading {categoryName} products...</p>
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
            <BreadcrumbPage>{categoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Category Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{categoryName}</h1>
            {currentCategory && (
              <p className="text-muted-foreground mt-1">
                {currentCategory.description} • {filteredAndSortedProducts.length} products available
              </p>
            )}
          </div>
        </div>

        {/* Related Categories */}
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((cat) => cat.name !== categoryName)
            .slice(0, 5)
            .map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => (window.location.href = `/products/category/${categoryToSlug(category.name)}`)}
              >
                {category.name}
              </Badge>
            ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar - Desktop */}
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

              <span className="text-sm text-muted-foreground">
                {filteredAndSortedProducts.length} {categoryName.toLowerCase()} products found
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
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

          {/* Category Stats */}
          {currentCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            >
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{filteredAndSortedProducts.length}</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${Math.min(...filteredAndSortedProducts.map((p) => p.price)).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Starting from</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredAndSortedProducts.length > 0
                    ? (
                        filteredAndSortedProducts.reduce((sum, p) => sum + p.rating, 0) /
                        filteredAndSortedProducts.length
                      ).toFixed(1)
                    : "0"}
                  ★
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredAndSortedProducts.filter((p) => p.stock > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">In Stock</div>
              </div>
            </motion.div>
          )}

          {/* Products Grid/List */}
          {filteredAndSortedProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No {categoryName.toLowerCase()} products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
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

          {/* Load More Button */}
          {filteredAndSortedProducts.length > 0 && filteredAndSortedProducts.length >= 12 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
