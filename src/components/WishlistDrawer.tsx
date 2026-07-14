import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageSquare, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  whatsappNumber?: string;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistedProducts,
  onRemoveFromWishlist,
  onSelectProduct,
  whatsappNumber = '919999999999',
}: WishlistDrawerProps) {
  const formattedPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  const handleInquireAllWhatsApp = () => {
    if (wishlistedProducts.length === 0) return;

    let itemsList = wishlistedProducts.map((p) => `• ${p.name} (${p.id}) - ${formattedPrice(p.price)}`).join('\n');
    const defaultText = `Hello KEE! I have compiled my luxury wishlist and would love to inquire about availability and bespoke sizing:\n\n${itemsList}\n\nPlease guide me through completing my order. Thank you!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultText)}`;
    window.open(whatsappUrl, '_blank');
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
                  <Heart className="w-4 h-4 text-amber-700 fill-amber-700" />
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                    Your Wishlist ({wishlistedProducts.length})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-24 space-y-3">
                    <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center mx-auto text-neutral-300">
                      <Heart className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium">Your boutique is empty</p>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                      Wander through our luxury collections and click the heart icon to gather your favorite masterpieces.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-amber-800 transition-colors"
                    >
                      Browse Collections
                    </button>
                  </div>
                ) : (
                  wishlistedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 p-3 bg-white border border-neutral-100/80 hover:border-neutral-200 transition-all duration-300 relative group"
                    >
                      {/* Product Thumbnail */}
                      <div
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="w-20 aspect-[3/4] bg-neutral-50 overflow-hidden cursor-pointer relative shrink-0"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="text-[9px] uppercase tracking-widest text-amber-700 font-semibold">
                          {p.collection}
                        </span>
                        <h3
                          onClick={() => {
                            onSelectProduct(p);
                            onClose();
                          }}
                          className="text-xs font-semibold text-neutral-900 hover:text-amber-800 transition-colors truncate cursor-pointer mt-0.5"
                        >
                          {p.name}
                        </h3>
                        <p className="text-xs font-bold text-neutral-950 mt-1">{formattedPrice(p.price)}</p>

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => {
                              onSelectProduct(p);
                              onClose();
                            }}
                            className="text-[10px] uppercase tracking-wider text-neutral-500 hover:text-black font-semibold transition-colors"
                          >
                            Customize / View
                          </button>
                        </div>
                      </div>

                      {/* Remove Trash Button */}
                      <button
                        onClick={() => onRemoveFromWishlist(p.id)}
                        className="absolute right-3 top-3 p-1.5 text-neutral-300 hover:text-red-700 rounded-md hover:bg-neutral-50 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {wishlistedProducts.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-neutral-100 bg-[#FAF9F6] space-y-3">
                  <div className="text-center text-[10px] text-neutral-500 leading-normal mb-1">
                    Send your compiled items to our boutique concierge over WhatsApp for customized measurements, tailoring options and secure payment coordinates.
                  </div>
                  <button
                    onClick={handleInquireAllWhatsApp}
                    className="w-full py-3.5 bg-neutral-950 text-[#FAF9F6] hover:bg-amber-800 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    Inquire Wishlist on WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
