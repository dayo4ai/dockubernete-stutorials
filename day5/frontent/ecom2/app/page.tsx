"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ApiService } from "@/lib/api-service"
import type { Product } from "@/lib/types"
import { ArrowRight, Sparkles, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { ApiStatusIndicator } from "@/components/api-status-indicator"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [minRating, setMinRating] = useState(0)

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => ApiService.getProducts(12),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => ApiService.getCategories(),
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesRating = product.rating >= minRating

      return matchesSearch && matchesCategory && matchesPrice && matchesRating
    })
  }, [products, searchTerm, selectedCategories, priceRange, minRating])

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
          <p className="text-muted-foreground">Loading amazing products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced API Status Indicator */}
      <ApiStatusIndicator />

      {/* Error Handling */}
      {(productsError || categoriesError) && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Some features may be limited. Using cached data to ensure the best experience.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 mb-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
        >
          <Sparkles className="w-4 h-4" />
          Welcome to ShopHub
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
          Discover Amazing Products
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          Shop the latest trends and find exactly what you're looking for with our curated collection of premium
          products.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Link href="#products">
            <Button size="lg" className="group">
              Shop Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Products Section */}
      <div id="products" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategories}
            onPriceRangeChange={setPriceRange}
            onRatingChange={setMinRating}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products ({filteredProducts.length})</h2>
          </div>

          {filteredProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              <Button onClick={handleClearFilters} className="mt-4">
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
