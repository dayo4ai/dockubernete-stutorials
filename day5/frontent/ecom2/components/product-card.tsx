"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: product })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden group cursor-pointer h-full">
        <div className="relative overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddToCart}
              className="transform translate-y-2 group-hover:translate-y-0 transition-transform"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </motion.div>
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 ${isLiked ? "text-red-500" : "text-gray-400"}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <Badge className="absolute top-2 left-2" variant="secondary">
            {product.category}
          </Badge>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.rating})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
            <Badge variant={product.stock > 0 ? "default" : "destructive"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
