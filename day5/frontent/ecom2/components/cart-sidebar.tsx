"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function CartSidebar() {
  const { state, dispatch } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="w-4 h-4" />
          {state.itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {state.itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({state.itemCount} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            <AnimatePresence>
              {state.items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-muted-foreground"
                >
                  <ShoppingCart className="w-16 h-16 mb-4" />
                  <p>Your cart is empty</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-3 p-3 border rounded-lg"
                    >
                      <Image
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />

                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                        <p className="text-sm font-semibold">${item.product.price.toFixed(2)}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {state.items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">${state.total.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
