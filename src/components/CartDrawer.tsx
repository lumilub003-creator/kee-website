import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartList: CartItem[];
  onUpdateCartItemQty: (index: number, newQty: number) => void;
  onRemoveCartItem: (index: number) => void;
  onNavigateToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartList,
  onUpdateCartItemQty,
  onRemoveCartItem,
  onNavigateToCheckout,
}: CartDrawerProps) {
  const formattedPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  const subtotal = cartList.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= 3000;
  const deliveryGoalRemaining = 3000 - subtotal;

  const handleCheckoutClick = () => {
    if (cartList.length === 0) return;
    onClose();
    onNavigateToCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white border-l border-neutral-100 flex flex-col justify-between shadow-2xl h-full"
            >
              {/* Header */}
              <div className="px-4 sm:px-6 py-6 border-b border-neutral-100 flex justify-between items-center bg-[#FAF9F6]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-700" />
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                    Your Cart ({cartList.reduce((sum, item) => sum + item.quantity, 0)})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Delivery progress banner */}
              {cartList.length > 0 && (
                <div className="bg-amber-500/5 px-6 py-3 border-b border-amber-500/10 text-xs text-neutral-700 flex items-center gap-2.5">
                  <Truck className="w-4.5 h-4.5 text-amber-700 shrink-0" />
                  <div>
                    {isFreeDelivery ? (
                      <span className="font-semibold text-emerald-800">
                        🎉 Splendid! You qualify for Free Express Delivery!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-neutral-900 font-bold">{formattedPrice(deliveryGoalRemaining)}</strong> more for <strong className="text-emerald-800">Free Shipping</strong>!
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {cartList.length === 0 ? (
                  <div className="text-center py-24 space-y-3">
                    <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center mx-auto text-neutral-300">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium">Your cart is empty</p>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                      Wander through our luxury collections and choose magnificent pieces to fill your wardrobe.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-amber-800 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cartList.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${idx}`}
                      className="flex items-start gap-4 p-3 bg-white border border-neutral-100/80 hover:border-neutral-200 transition-all duration-300 relative group"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-20 aspect-[3/4] bg-neutral-50 overflow-hidden relative shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="text-[9px] uppercase tracking-widest text-amber-700 font-semibold">
                          {item.product.collection}
                        </span>
                        <h3 className="text-xs font-semibold text-neutral-900 truncate mt-0.5">
                          {item.product.name}
                        </h3>
                        
                        {/* Selected options */}
                        <div className="flex flex-wrap gap-2 mt-1.5 text-[10px] text-neutral-500">
                          <span className="bg-neutral-50 border border-neutral-100 px-1.5 py-0.5">
                            Size: <strong className="text-neutral-800">{item.selectedSize}</strong>
                          </span>
                          <span className="bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 flex items-center gap-1">
                            Color: 
                            <span 
                              className="inline-block w-2.5 h-2.5 rounded-full border border-neutral-300" 
                              style={{ backgroundColor: item.selectedColor.value }} 
                            />
                            <strong className="text-neutral-800">{item.selectedColor.name}</strong>
                          </span>
                        </div>

                        {/* Price & Quantity Adjuster */}
                        <div className="mt-3.5 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-neutral-950">
                            {formattedPrice(item.product.price * item.quantity)}
                          </span>

                          <div className="flex items-center border border-neutral-200">
                            <button
                              onClick={() => onUpdateCartItemQty(idx, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1 px-2 text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateCartItemQty(idx, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="p-1 px-2 text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Trash Button */}
                      <button
                        onClick={() => onRemoveCartItem(idx)}
                        className="absolute right-3 top-3 p-1.5 text-neutral-300 hover:text-red-700 rounded-md hover:bg-neutral-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cartList.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-neutral-100 bg-[#FAF9F6] space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Boutique Subtotal:</span>
                      <span className="font-semibold text-neutral-800">{formattedPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Shipping Delivery:</span>
                      <span className="font-semibold text-neutral-800">
                        {isFreeDelivery ? (
                          <span className="text-emerald-800 uppercase tracking-widest text-[9px] font-bold">Complimentary</span>
                        ) : (
                          formattedPrice(150)
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-dashed border-neutral-200 flex justify-between text-sm font-bold text-neutral-950">
                      <span>Estimated Total:</span>
                      <span>{formattedPrice(subtotal + (isFreeDelivery ? 0 : 150))}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 bg-neutral-950 text-[#FAF9F6] hover:bg-amber-800 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Safe & Authenticated Checkout</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
