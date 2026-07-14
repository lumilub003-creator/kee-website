import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageSquare, Eye, ShoppingBag, CreditCard } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onSelect: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  onBuyNow: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  whatsappNumber?: string;
}

export default function ProductCard({
  product,
  onSelect,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  whatsappNumber = '919999999999',
}: ProductCardProps) {
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [showSizer, setShowSizer] = useState<'cart' | 'buy' | null>(null);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const formattedOriginalPrice = product.originalPrice
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(product.originalPrice)
    : null;

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isSoldOut = product.stock === 0;

  // WhatsApp order text
  const handleQuickWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultText = `Hello KEE! I would like to place an order for the elegant "${product.name}" (${product.id}).\n\nPrice: ${formattedPrice}\nCollection: ${product.collection}\n\nPlease help me choose the appropriate size and color. Thank you!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col bg-white border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Product Image Section */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 cursor-pointer"
        onClick={() => onSelect(product)}
        onMouseEnter={() => product.images.length > 1 && setHoveredImageIndex(1)}
        onMouseLeave={() => setHoveredImageIndex(0)}
      >
        <img
          src={product.images[hoveredImageIndex] || product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform transition-all duration-[800ms] group-hover:scale-105"
        />

        {/* Inline Size Choice Overlay */}
        {showSizer && (
          <div
            className="absolute inset-0 bg-neutral-950/95 backdrop-blur-xs flex flex-col justify-center items-center p-4 z-20 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.25em] font-bold mb-3">
              {showSizer === 'cart' ? 'Select Bag Size' : 'Select Sizing Coordinates'}
            </span>
            <div className="grid grid-cols-3 gap-1.5 w-full max-w-[200px] mb-5">
              {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    if (showSizer === 'cart') {
                      onAddToCart(product, size);
                    } else {
                      onBuyNow(product, size);
                    }
                    setShowSizer(null);
                  }}
                  className="py-2 bg-neutral-900 border border-neutral-800 text-white hover:bg-amber-600 hover:text-white hover:border-transparent transition-all text-[11px] font-bold"
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSizer(null)}
              className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 hover:text-white font-semibold underline underline-offset-4"
            >
              Close
            </button>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isSoldOut ? (
            <span className="bg-black text-[10px] text-white font-semibold uppercase tracking-widest px-2.5 py-1">
              Sold Out
            </span>
          ) : (
            <>
              {product.isNew && (
                <span className="bg-[#DFD1B7] text-[10px] text-neutral-900 font-semibold uppercase tracking-widest px-2.5 py-1">
                  New
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-neutral-950 text-[10px] text-[#FAF9F6] font-semibold uppercase tracking-widest px-2.5 py-1 border border-neutral-800">
                  Best Seller
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="bg-red-800 text-[10px] text-white font-semibold uppercase tracking-widest px-2.5 py-1">
                  -{discountPercentage}% Off
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-800 hover:text-red-500 hover:scale-105 transition-all duration-300 shadow-sm z-10"
          aria-label="Add to Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-700'}`}
          />
        </button>

        {/* Hover action bar overlay (Desktop) */}
        {!isSoldOut && (
          <div className="absolute bottom-0 inset-x-0 bg-neutral-950/80 backdrop-blur-xs p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 md:flex hidden flex-col gap-1.5 z-10">
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizer('buy');
                }}
                className="flex-1 py-2 bg-[#D4AF37] hover:bg-amber-800 hover:text-white text-[10px] text-neutral-950 uppercase tracking-widest font-black transition-all flex items-center justify-center gap-1"
              >
                Buy Now
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizer('cart');
                }}
                className="py-2 px-2.5 bg-neutral-900 text-white hover:bg-white hover:text-black border border-neutral-800 transition-all"
                title="Add to Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelect(product)}
                className="flex-1 py-1.5 bg-transparent text-[9px] text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-400 uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-3 h-3" /> Details
              </button>
              <button
                onClick={handleQuickWhatsAppOrder}
                className="flex-1 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-[9px] text-white uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <MessageSquare className="w-3 h-3 fill-white" /> WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col flex-1 bg-white">
        <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mb-1">
          {product.collection}
        </span>
        <h3
          onClick={() => onSelect(product)}
          className="font-sans text-sm font-medium tracking-tight text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
        >
          {product.name}
        </h3>
        {product.tagline && (
          <p className="text-[11px] text-neutral-500 italic mt-0.5 font-light line-clamp-1">
            {product.tagline}
          </p>
        )}

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-neutral-950">{formattedPrice}</span>
          {formattedOriginalPrice && (
            <span className="text-xs text-neutral-400 line-through font-light">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        {/* Action button section (Mobile view action button) */}
        {!isSoldOut && (
          <div className="mt-4 pt-3 border-t border-neutral-100 flex md:hidden flex-col gap-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizer('buy');
                }}
                className="py-2.5 bg-[#D4AF37] text-neutral-950 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-1"
              >
                Buy Now
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizer('cart');
                }}
                className="py-2.5 bg-white text-neutral-950 border border-neutral-300 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> + Bag
              </button>
            </div>
            <button
              onClick={handleQuickWhatsAppOrder}
              className="w-full py-2 bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2 rounded-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-white fill-white" /> Order via WhatsApp
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
