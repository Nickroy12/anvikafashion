"use client"

import { useState } from "react"
import { ShoppingBag, Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/useCartStore"

interface AddToCartSectionProps {
  product: {
    _id: string
    name: string
    price: number
    stock: number
    discount?: number
    imageUrls?: string[]
    imageUrl?: string
  }
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  
  const addItem = useCartStore((state) => state.addItem)

  const originalPrice = Number(product.price)
  const discount = product.discount ? Number(product.discount) : 0
  const finalPrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice
  const totalPrice = finalPrice * quantity

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = () => {
    const mainImage = product.imageUrls?.[0] || product.imageUrl || ''
    
    addItem({
      id: product._id,
      name: product.name,
      price: finalPrice,
      quantity,
      imageUrl: mainImage,
    })
    
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="mt-auto pt-6">
      <div className="flex items-center gap-2 mb-6">
        <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
        <span className="text-sm font-medium">
          {product.stock > 0 ? `${product.stock} in stock - Ready to ship` : 'Out of stock'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {product.stock > 0 && (
          <div className="relative group w-full sm:w-auto">
            <div className="flex items-center border border-border/60 rounded-xl h-14 w-full sm:w-auto overflow-hidden">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="flex items-center justify-center h-full w-12 text-muted-foreground hover:bg-secondary/50 hover:text-foreground disabled:opacity-50 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center h-full w-12 font-semibold text-foreground text-lg border-x border-border/60">
                {quantity}
              </div>
              <button
                onClick={handleIncrease}
                disabled={quantity >= product.stock}
                className="flex items-center justify-center h-full w-12 text-muted-foreground hover:bg-secondary/50 hover:text-foreground disabled:opacity-50 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs font-medium rounded py-1.5 px-3 pointer-events-none whitespace-nowrap shadow-md z-10">
              {quantity} × ${finalPrice.toFixed(2)} = ${totalPrice.toFixed(2)}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
            </div>
          </div>
        )}
        
        <Button
          size="lg"
          onClick={handleAddToCart}
          className="flex-1 text-base font-semibold h-14 rounded-xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
          disabled={product.stock <= 0}
        >
          {isAdded ? (
            <div className="flex items-center text-emerald-100">
              <Check className="w-5 h-5 mr-2" />
              Added to Cart
            </div>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5 mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
