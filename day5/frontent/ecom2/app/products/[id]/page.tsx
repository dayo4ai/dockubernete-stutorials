"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ApiService } from "@/lib/api-service"
import { useCart } from "@/lib/cart-context"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { ProductCard } from "@/components/product-card"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { dispatch } = useCart()

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => ApiService.getProduct(params.id),
    retry: 1,
  })

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["related-products", product?.category],
    queryFn: () => ApiService.getProducts(4),
    enabled: !!product,
    retry: 1,
  })

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        dispatch({ type: "ADD_ITEM", payload: product })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  // Mock additional images for demo
  const productImages = [
    product.image_url,
    `https://picsum.photos/seed/${product.id}-2/400/300`,
    `https://picsum.photos/seed/${product.id}-3/400/300`,
    `https://picsum.photos/seed/${product.id}-4/400/300`,
  ]

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
            <BreadcrumbLink href={`/products/category/${product.category.toLowerCase()}`}>
              {product.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <Image
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? "border-primary" : "border-muted"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating}) • 127 reviews</span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              <span className="text-lg text-muted-foreground line-through">$${(product.price * 1.2).toFixed(2)}</span>
              <Badge variant="destructive">20% OFF</Badge>
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-r-none"
                >
                  -
                </Button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="rounded-l-none">
                  +
                </Button>
              </div>
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>

            <div className="flex gap-4 mb-6">
              <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-green-600" />
                <span>Free shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>2 year warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4 text-orange-600" />
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Details Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="font-medium">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Premium quality materials</li>
                    <li>Durable construction</li>
                    <li>Easy to use and maintain</li>
                    <li>Backed by manufacturer warranty</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Category:</span>
                      <span className="text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">SKU:</span>
                      <span className="text-muted-foreground">{product.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Weight:</span>
                      <span className="text-muted-foreground">1.2 kg</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Dimensions:</span>
                      <span className="text-muted-foreground">25 x 15 x 10 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Material:</span>
                      <span className="text-muted-foreground">Premium Grade</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Warranty:</span>
                      <span className="text-muted-foreground">2 Years</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">John Doe</span>
                        <span className="text-sm text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great product! Exactly what I was looking for. Fast shipping and excellent quality.
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Delivery Options:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Standard Delivery (3-5 business days) - Free</li>
                      <li>• Express Delivery (1-2 business days) - $9.99</li>
                      <li>• Same Day Delivery (selected areas) - $19.99</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Return Policy:</h4>
                    <p className="text-sm text-muted-foreground">
                      30-day return policy. Items must be in original condition with tags attached.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}
