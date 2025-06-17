"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import type { Category } from "@/lib/types"

interface ProductFiltersProps {
  categories: Category[]
  onSearchChange: (search: string) => void
  onCategoryChange: (categories: string[]) => void
  onPriceRangeChange: (range: [number, number]) => void
  onRatingChange: (rating: number) => void
  onClearFilters: () => void
}

export function ProductFilters({
  categories,
  onSearchChange,
  onCategoryChange,
  onPriceRangeChange,
  onRatingChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [minRating, setMinRating] = useState(0)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  const handleCategoryToggle = (categoryName: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryName]
      : selectedCategories.filter((c) => c !== categoryName)

    setSelectedCategories(newCategories)
    onCategoryChange(newCategories)
  }

  const handlePriceRangeChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]]
    setPriceRange(range)
    onPriceRangeChange(range)
  }

  const handleRatingChange = (value: number[]) => {
    setMinRating(value[0])
    onRatingChange(value[0])
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setMinRating(0)
    onClearFilters()
  }

  return (
    <Card className="sticky top-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <X className="w-4 h-4" />
          Clear
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <Label>Categories</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={(checked) => handleCategoryToggle(category.name, checked as boolean)}
                />
                <Label htmlFor={category.id} className="text-sm font-normal">
                  {category.name} ({category.product_count})
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <Label>Minimum Rating</Label>
          <div className="px-2">
            <Slider
              value={[minRating]}
              onValueChange={handleRatingChange}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground mt-2">{minRating}+ stars</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
