"use client"

import { useCartStore } from "@/lib/store/useCartStore"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart, Trash2, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { clientMutation } from "@/lib/core/client-api"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true)
      const orderData = {
        price: totalPrice,
        items: items,
        // Optional default fields for the backend payload
        name: 'Guest User',
        email: 'guest@example.com',
        phone: '01700000000',
      }

      const res = await clientMutation<{ url?: string }>("/api/orders", orderData)
      if (res?.url) {
        window.location.href = res.url
      } else {
        console.error("Failed to get payment URL", res)
        alert("Payment initialization failed. Please try again.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Something went wrong during checkout.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg z-[120]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
            <ShoppingCart className="w-6 h-6" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 mt-4 -mx-6 px-6 no-scrollbar border-t border-border/40">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <Button variant="outline" onClick={() => setIsOpen(false)} className="mt-4">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center bg-secondary/20 p-4 rounded-2xl border border-border/50">
                  <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden relative flex-shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <h4 className="font-semibold text-foreground line-clamp-1">{item.name}</h4>
                    <p className="font-bold text-primary">${item.price.toFixed(2)}</p>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-border/60 rounded-lg overflow-hidden h-8">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-full flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <div className="w-8 h-full flex items-center justify-center text-sm font-medium border-x border-border/60">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 transition-colors ml-auto p-2"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-6 border-t border-border/40 pb-2">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-muted-foreground">Subtotal</span>
              <span className="text-3xl font-black text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
