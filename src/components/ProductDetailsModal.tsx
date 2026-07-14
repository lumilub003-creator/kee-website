import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Heart, Star, Check, HelpCircle, ChevronLeft, ChevronRight, Plus, Minus, ShoppingBag, Play, Pause, RotateCcw, Sparkles, Bell, Eye } from 'lucide-react';
import { Product, ColorOption, Review } from '../types';
import SizeChart from './SizeChart';

interface ProductDetailsModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddReview: (productId: string, review: Review) => void;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL', color: ColorOption, quantity: number) => void;
  onBuyNow: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL', color: ColorOption) => void;
  whatsappNumber?: string;
  allProducts?: Product[];
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onToggleWishlist,
  isWishlisted,
  relatedProducts,
  onSelectProduct,
  onAddReview,
  onAddToCart,
  onBuyNow,
  whatsappNumber = '919999999999',
  allProducts = [],
}: ProductDetailsModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping'>('details');

  // Interactive Sizing, Video, Zoom and Recently Viewed States
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(30);

  // Notify Me form
  const [notifyName, setNotifyName] = useState('');
  const [notifyContact, setNotifyContact] = useState('');
  const [isNotifiedSuccess, setIsNotifiedSuccess] = useState(false);

  // Recently Viewed Local Storage tracker
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  // Order Confirmation Screen state
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState<any>(null);

  // Dynamic tracking of recently viewed
  useEffect(() => {
    if (isOpen && product) {
      // 1. Add to localStorage list
      try {
        const existing = localStorage.getItem('kee_recently_viewed');
        let list: string[] = [];
        if (existing) {
          list = JSON.parse(existing);
        }
        list = list.filter((id) => id !== product.id);
        list.unshift(product.id);
        list = list.slice(0, 6);
        localStorage.setItem('kee_recently_viewed', JSON.stringify(list));
      } catch (e) {
        console.error(e);
      }

      // Reset states
      setActiveImageIndex(0);
      setSelectedSize(null);
      setSelectedColor(null);
      setSizeError(false);
      setColorError(false);
      setQuantity(1);
      setIsVideoActive(false);
      setIsNotifiedSuccess(false);
      setNotifyName('');
      setNotifyContact('');
    }
  }, [product, isOpen]);

  // Load recently viewed details
  useEffect(() => {
    if (isOpen && allProducts && allProducts.length > 0) {
      try {
        const existing = localStorage.getItem('kee_recently_viewed');
        if (existing) {
          const ids: string[] = JSON.parse(existing);
          // Get products corresponding to ids (exclude current product)
          const items = ids
            .map((id) => allProducts.find((p) => p.id === id))
            .filter((p): p is Product => !!p && p.id !== product.id);
          setRecentlyViewed(items);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [product, isOpen, allProducts]);

  // Simulated video progression logic
  useEffect(() => {
    let interval: any;
    if (isVideoActive && isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 1.2));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isVideoActive, isVideoPlaying]);

  if (!isOpen) return null;

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

  const isSoldOut = product.stock === 0;

  // Custom pre-filled WhatsApp message based on selections
  const handleOrderWhatsApp = () => {
    let hasError = false;
    if (!selectedSize && !isSoldOut) {
      setSizeError(true);
      window.showToast?.('Please select your size before continuing.', 'error');
      hasError = true;
    }
    if (!selectedColor && !isSoldOut) {
      setColorError(true);
      window.showToast?.('Please select a color.', 'error');
      hasError = true;
    }
    if (hasError) return;

    const orderId = `KEE-${Math.floor(1000 + Math.random() * 9000)}`;
    const sizeStr = selectedSize || 'Standard';
    const colorStr = selectedColor?.name || 'Standard';

    const whatsappMessage = `Hello KEE! I would like to place an order for this gorgeous masterpiece:\n\n` +
      `⚜️ *Product*: ${product.name}\n` +
      `⚜️ *Product ID*: ${product.id}\n` +
      `⚜️ *Size Selected*: ${sizeStr}\n` +
      `⚜️ *Color Selected*: ${colorStr}\n` +
      `⚜️ *Price*: ${formattedPrice}\n\n` +
      `Please verify stock and share payment instructions. Thank you!`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Simulate order placement
    setConfirmedOrderDetails({
      orderId,
      productName: product.name,
      size: sizeStr,
      color: colorStr,
      price: product.price,
      estimatedDelivery: '3-5 Business Days'
    });
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    setShowOrderSuccess(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) {
      window.showToast?.('Please fill out all fields before submitting.', 'warning');
      return;
    }

    const newReview: Review = {
      id: `new-rev-${Date.now()}`,
      author: reviewerName,
      rating: reviewerRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewerComment,
    };

    onAddReview(product.id, newReview);
    setReviewerName('');
    setReviewerComment('');
    setReviewerRating(5);
    setReviewSuccessMsg(true);
    setTimeout(() => setReviewSuccessMsg(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-0 md:p-4">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white text-neutral-900 w-full max-w-5xl rounded-none md:rounded-none overflow-hidden border border-neutral-200/50 shadow-2xl z-10 my-auto h-full md:h-auto max-h-[100vh] md:max-h-[92vh] flex flex-col"
      >
        {/* Modal Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 border border-neutral-100 hover:bg-black hover:text-white transition-all duration-300 z-50 text-neutral-800 shadow-sm"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body: Scrollable */}
        <div className="overflow-y-auto flex-1">
          {showOrderSuccess ? (
            /* ORDER SUCCESS SCREEN WITH UPI DIRECTIONS */
            <div className="p-6 md:p-12 text-center max-w-xl mx-auto py-16">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 border border-emerald-100">
                <Check className="w-10 h-10" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Order Inquiry Sent</span>
              <h2 className="font-sans text-2xl font-light text-neutral-950 mt-1 uppercase tracking-wider">Thank You, Elegant</h2>
              <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
                Your order query has been initiated on WhatsApp! We have reserved your item temporarily. 
              </p>

              <div className="my-8 p-6 bg-[#FAF9F6] border border-amber-600/20 text-left space-y-4">
                <h3 className="font-sans text-xs uppercase tracking-widest text-neutral-800 font-semibold border-b border-neutral-200 pb-2">
                  UPI Payment Instructions (KEE!)
                </h3>
                <div className="space-y-2.5 text-xs text-neutral-700">
                  <p className="flex justify-between">
                    <span className="text-neutral-400">Order Query ID:</span> 
                    <span className="font-semibold text-neutral-900">{confirmedOrderDetails?.orderId}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neutral-400">Garment Name:</span> 
                    <span className="font-medium text-neutral-900">{confirmedOrderDetails?.productName} ({confirmedOrderDetails?.size})</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neutral-400">Total Amount:</span> 
                    <span className="font-bold text-neutral-950">₹{confirmedOrderDetails?.price}</span>
                  </p>
                  
                  <div className="pt-3 border-t border-dashed border-neutral-200 space-y-1 bg-amber-500/5 p-3 rounded-xs text-neutral-800">
                    <p className="font-semibold text-amber-900 uppercase tracking-wider text-[10px]">Payment Verification Steps:</p>
                    <ol className="list-decimal pl-4 space-y-1 mt-1 text-[11px] text-neutral-700">
                      <li>Use UPI app (GPay, PhonePe, Paytm) to transfer exactly <strong className="text-neutral-950">₹{confirmedOrderDetails?.price}</strong></li>
                      <li>Official VPA/UPI ID: <strong className="text-neutral-900 select-all">kee.luxury@upi</strong></li>
                      <li>Add Note: <strong className="text-neutral-900">{confirmedOrderDetails?.orderId}</strong></li>
                      <li>Send a screenshot of the payment receipt on WhatsApp for instant confirmation.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    const defaultText = `Hey KEE! I paid the amount ₹${confirmedOrderDetails?.price} for query ${confirmedOrderDetails?.orderId}. Please confirm!`;
                    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultText)}`, '_blank');
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Sent Payment Screenshot
                </button>
                <button
                  onClick={() => {
                    setShowOrderSuccess(false);
                    setConfirmedOrderDetails(null);
                  }}
                  className="px-6 py-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs uppercase tracking-widest transition-colors"
                >
                  Return to Details
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
              {/* LEFT COLUMN: Gallery with Zoom & Video Reel */}
              <div className="p-4 md:p-8 space-y-4">
                <div className="relative aspect-[3/4] bg-neutral-950 overflow-hidden border border-neutral-800 flex flex-col justify-center items-center shadow-lg group/gallery">
                  
                  {!isVideoActive ? (
                    /* PRODUCT ZOOM WRAPPER */
                    <div
                      onMouseEnter={() => setIsZoomed(true)}
                      onMouseMove={(e) => {
                        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - left) / width) * 100;
                        const y = ((e.clientY - top) / height) * 100;
                        setZoomPos({ x, y });
                      }}
                      onMouseLeave={() => setIsZoomed(false)}
                      className="w-full h-full cursor-zoom-in overflow-hidden relative"
                    >
                      <img
                        src={product.images[activeImageIndex] || product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        style={{
                          transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        }}
                        className="w-full h-full object-cover object-center transition-transform duration-150 ease-out pointer-events-none"
                      />
                      
                      {/* Zoom Indicator Icon on Hover */}
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-[10px] text-white uppercase tracking-widest font-semibold px-2.5 py-1 pointer-events-none opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" /> Hover to Zoom
                      </div>
                    </div>
                  ) : (
                    /* HIGH COUTURE RUNWAY VIDEO SIMULATION */
                    <div className="w-full h-full relative bg-neutral-950 flex flex-col justify-between p-6 overflow-hidden">
                      {/* Dynamic Background visual lights */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-amber-600 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-900 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
                      </div>

                      {/* Video Top Details */}
                      <div className="z-10 flex justify-between items-center text-white">
                        <span className="text-[9px] uppercase tracking-[0.25em] font-black text-[#D4AF37] flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-red-600 animate-ping inline-block" /> Live Runway Reel
                        </span>
                        <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-400">00:0{Math.floor(videoProgress/10)} / 00:10</span>
                      </div>

                      {/* Video Body Content */}
                      <div className="z-10 text-center space-y-3.5 my-auto">
                        <div className="relative inline-block">
                          <motion.div
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ repeat: Infinity, duration: 2.5 }}
                            className="w-20 h-20 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-black/60 mx-auto"
                          >
                            <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                          </motion.div>
                          <div className="absolute -inset-2 border border-amber-600/25 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
                        </div>
                        
                        <div>
                          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-[0.2em]">KEE! ATELIER REEL</h4>
                          <p className="text-[10px] text-[#DFD1B7]/80 uppercase tracking-widest font-semibold mt-1">
                            {product.name} — Raw Silk Showcase
                          </p>
                        </div>

                        {/* Animated Visualizer Bars */}
                        <div className="flex justify-center items-end gap-1 h-7">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => {
                            const heights = isVideoPlaying ? ['h-3', 'h-6', 'h-2', 'h-5', 'h-4', 'h-7', 'h-3', 'h-5'] : ['h-2'];
                            return (
                              <div
                                key={bar}
                                className={`w-0.75 bg-[#D4AF37] rounded-full transition-all duration-300 ${
                                  heights[Math.floor(Math.random() * heights.length)]
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Video Bottom Progress & Controls */}
                      <div className="z-10 space-y-3">
                        {/* Progress bar */}
                        <div className="w-full h-[2px] bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#D4AF37]" style={{ width: `${videoProgress}%` }} />
                        </div>

                        {/* Controls */}
                        <div className="flex justify-between items-center text-white">
                          <button
                            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                            className="p-1.5 hover:text-[#D4AF37] transition-colors"
                          >
                            {isVideoPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5" />}
                          </button>
                          
                          <button
                            onClick={() => {
                              setIsVideoActive(false);
                            }}
                            className="text-[9px] uppercase tracking-widest font-bold text-[#D4AF37] hover:underline"
                          >
                            Return to Photos
                          </button>

                          <button
                            onClick={() => setVideoProgress(0)}
                            className="p-1.5 hover:text-[#D4AF37] transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Slider controls */}
                  {!isVideoActive && product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/95 rounded-full shadow-md text-neutral-800 hover:bg-black hover:text-white transition-all z-20"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/95 rounded-full shadow-md text-neutral-800 hover:bg-black hover:text-white transition-all z-20"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails containing the Video button */}
                <div className="flex gap-2.5 overflow-x-auto pb-2">
                  {/* Photo Thumbnails */}
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsVideoActive(false);
                        setActiveImageIndex(idx);
                      }}
                      className={`relative w-20 aspect-[3/4] flex-shrink-0 border overflow-hidden transition-all duration-300 ${
                        !isVideoActive && activeImageIndex === idx ? 'border-amber-600 scale-95 shadow-xs' : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}

                  {/* Elegant Dynamic Video Reel Thumbnail */}
                  <button
                    onClick={() => setIsVideoActive(true)}
                    className={`relative w-20 aspect-[3/4] flex-shrink-0 border flex flex-col items-center justify-center transition-all duration-300 bg-neutral-950 text-white ${
                      isVideoActive ? 'border-[#D4AF37] scale-95 ring-1 ring-amber-600/30' : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <Play className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37] mb-1.5 animate-pulse" />
                    <span className="text-[8px] uppercase tracking-widest text-[#DFD1B7] font-black">Runway Reel</span>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Product Info & Actions */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  {/* Header info */}
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.2em]">
                        {product.collection} Collection
                      </span>
                      <h1 className="font-sans text-2xl font-light text-neutral-950 mt-1 uppercase tracking-wide">
                        {product.name}
                      </h1>
                      {product.tagline && (
                        <p className="text-xs text-neutral-500 italic mt-0.5">{product.tagline}</p>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`p-2.5 rounded-full border transition-all ${
                        isWishlisted
                          ? 'bg-red-50 border-red-100 text-red-500'
                          : 'bg-neutral-50 border-neutral-100 text-neutral-500 hover:text-neutral-950'
                      }`}
                      aria-label="Toggle Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Rating / Reviews Count */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500 font-medium">
                      {product.rating} / 5 ({product.reviews.length} reviews)
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-neutral-100">
                    <span className="text-2xl font-bold text-neutral-950">{formattedPrice}</span>
                    {formattedOriginalPrice && (
                      <span className="text-sm text-neutral-400 line-through font-light">
                        {formattedOriginalPrice}
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="text-xs text-red-700 bg-red-50 font-semibold uppercase tracking-wider px-2.5 py-0.5">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Stock Check */}
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                      Availability:
                    </span>
                    {isSoldOut ? (
                      <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1">
                        Sold Out
                      </span>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1">
                        In Stock ({product.stock} pieces remaining)
                      </span>
                    )}
                  </div>

                  {/* Color Options Swatches */}
                  <div className={`mb-6 p-2.5 transition-all duration-300 ${colorError ? 'border border-red-500 bg-red-50/20' : 'border border-transparent'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                        Color: <span className="text-neutral-900 font-bold">{selectedColor ? selectedColor.name : 'Select Color'}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => {
                            setSelectedColor(color);
                            setColorError(false);
                            window.showToast?.('✓ Color Selected: ' + color.name, 'success');
                          }}
                          style={{ backgroundColor: color.value }}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                            selectedColor?.name === color.name
                              ? 'ring-2 ring-amber-600 border-white scale-110'
                              : 'border-neutral-300 hover:scale-105'
                          }`}
                          title={color.name}
                        >
                          {selectedColor?.name === color.name && (
                            <Check className={`w-3.5 h-3.5 ${color.value === '#FFFFFF' ? 'text-black' : 'text-white mix-blend-difference'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Options */}
                  {!isSoldOut && (
                    <div className={`mb-8 p-2.5 transition-all duration-300 ${sizeError ? 'border border-red-500 bg-red-50/20' : 'border border-transparent'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                          Select Size: {selectedSize && <span className="text-neutral-900 font-bold">{selectedSize}</span>}
                        </span>
                        <button
                          onClick={() => setIsSizeChartOpen(true)}
                          className="text-xs text-amber-800 hover:text-black hover:underline tracking-wide uppercase font-medium flex items-center gap-1"
                        >
                          Size Chart
                        </button>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                          const isAvailable = product.sizes.includes(size as any);
                          return (
                            <button
                              key={size}
                              disabled={!isAvailable}
                              onClick={() => {
                                setSelectedSize(size as any);
                                setSizeError(false);
                                window.showToast?.('✓ Size Selected: ' + size, 'success');
                              }}
                              className={`py-2.5 text-xs font-medium border uppercase tracking-wider transition-all duration-200 ${
                                !isAvailable
                                  ? 'bg-neutral-100/50 border-neutral-100 text-neutral-300 line-through cursor-not-allowed'
                                  : selectedSize === size
                                  ? 'bg-black border-black text-white'
                                  : 'border-neutral-200 hover:border-black hover:bg-neutral-50 text-neutral-800'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* QUANTITY SELECTOR */}
                  {!isSoldOut && (
                    <div className="mb-6 flex items-center gap-4">
                      <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-neutral-200 bg-white">
                        <button
                          type="button"
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="px-3 py-1.5 text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-4 text-xs font-bold text-neutral-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                          className="px-3 py-1.5 text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ORDER BUTTON WITH WHATSAPP DESCRIPTION */}
                  <div className="space-y-3 mb-8">
                    {isSoldOut ? (
                      <div className="space-y-4">
                        <button
                          disabled
                          className="w-full py-4 bg-neutral-200 text-neutral-400 text-xs font-bold uppercase tracking-widest cursor-not-allowed text-center"
                        >
                          Sold Out / Currently Unavailable
                        </button>

                        {/* NOTIFY ME BACK IN STOCK FORM */}
                        <div className="bg-[#FAF9F6] border border-[#D4AF37]/30 p-4 rounded-xs text-left space-y-3">
                          <h4 className="font-sans text-xs uppercase tracking-widest text-[#D4AF37] font-bold flex items-center gap-1.5">
                            <Bell className="w-3.5 h-3.5 animate-bounce" /> Notify Me When Back In Stock
                          </h4>
                          <p className="text-[11px] text-neutral-600 leading-relaxed">
                            This masterpiece is currently sold out. Leave your details below, and our stylist concierge will alert you first when it is re-released.
                          </p>
                          
                          {isNotifiedSuccess ? (
                            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                              ✓ Royal notification request received! We will alert you immediately.
                            </div>
                          ) : (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!notifyName.trim() || !notifyContact.trim()) {
                                  window.showToast?.('Please enter your name and contact information.', 'error');
                                  return;
                                }
                                setIsNotifiedSuccess(true);
                              }}
                              className="space-y-2"
                            >
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  required
                                  placeholder="Your Name"
                                  value={notifyName}
                                  onChange={(e) => setNotifyName(e.target.value)}
                                  className="p-2 bg-white border border-neutral-200 text-xs focus:border-black outline-hidden"
                                />
                                <input
                                  type="text"
                                  required
                                  placeholder="WhatsApp/Email"
                                  value={notifyContact}
                                  onChange={(e) => setNotifyContact(e.target.value)}
                                  className="p-2 bg-white border border-neutral-200 text-xs focus:border-black outline-hidden"
                                />
                              </div>
                              <button
                                type="submit"
                                className="w-full py-2 bg-black hover:bg-amber-800 text-white text-[10px] uppercase tracking-widest font-black transition-colors"
                              >
                                Request Priority Alert
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {/* Buy Now Button (navigates to checkout) */}
                        <button
                          type="button"
                          onClick={() => {
                            let hasError = false;
                            if (!selectedSize) {
                              setSizeError(true);
                              window.showToast?.('Please select your size before continuing.', 'error');
                              hasError = true;
                            }
                            if (!selectedColor) {
                              setColorError(true);
                              window.showToast?.('Please select a color.', 'error');
                              hasError = true;
                            }
                            if (hasError) return;
                            onBuyNow(product, selectedSize, selectedColor!);
                          }}
                          className="w-full py-4 bg-neutral-950 text-[#FAF9F6] hover:bg-amber-800 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md border border-neutral-900 cursor-pointer"
                        >
                          ⚜️ Buy Now
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          {/* Add to Cart Button */}
                          <button
                            type="button"
                            onClick={() => {
                              let hasError = false;
                              if (!selectedSize) {
                                setSizeError(true);
                                window.showToast?.('Please select your size before continuing.', 'error');
                                hasError = true;
                              }
                              if (!selectedColor) {
                                setColorError(true);
                                window.showToast?.('Please select a color.', 'error');
                                hasError = true;
                              }
                              if (hasError) return;
                              onAddToCart(product, selectedSize, selectedColor!, quantity);
                            }}
                            className="py-3.5 bg-white text-neutral-950 hover:bg-neutral-50 border border-neutral-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <ShoppingBag className="w-4 h-4 text-amber-700" />
                            Add to Cart
                          </button>

                          {/* WhatsApp Order Button */}
                          <button
                            type="button"
                            onClick={handleOrderWhatsApp}
                            className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4 text-white fill-white" />
                            Order via WhatsApp
                          </button>
                        </div>

                        {/* FREQUENTLY BOUGHT TOGETHER BUNDLE CARD */}
                        {relatedProducts && relatedProducts.length > 0 && (
                          <div className="p-3 bg-amber-500/5 border border-amber-600/10 rounded-xs mt-3 text-left">
                            <div className="flex items-center gap-1.5 text-amber-800 text-[9px] font-bold uppercase tracking-widest mb-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Frequently Bought Together
                            </div>
                            <div className="flex items-center gap-2.5">
                              <img src={relatedProducts[0].images[0]} className="w-10 h-13 object-cover border border-neutral-200" />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-[11px] font-semibold text-neutral-800 truncate">{relatedProducts[0].name}</h5>
                                <p className="text-[10px] text-neutral-500 font-mono">₹{relatedProducts[0].price}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  let hasError = false;
                                  if (!selectedSize) {
                                    setSizeError(true);
                                    window.showToast?.('Please select your size before continuing.', 'error');
                                    hasError = true;
                                  }
                                  if (!selectedColor) {
                                    setColorError(true);
                                    window.showToast?.('Please select a color.', 'error');
                                    hasError = true;
                                  }
                                  if (hasError) return;
                                  // Add main item
                                  onAddToCart(product, selectedSize, selectedColor!, 1);
                                  // Add companion item with same size (or fallback to first size)
                                  const companionSize = relatedProducts[0].sizes.includes(selectedSize) ? selectedSize : relatedProducts[0].sizes[0] || 'M';
                                  onAddToCart(relatedProducts[0], companionSize, relatedProducts[0].colors[0], 1);
                                  window.showToast?.(`✓ "${product.name}" & "${relatedProducts[0].name}" added as bundle!`, 'success');
                                }}
                                className="px-2.5 py-1.5 bg-neutral-950 hover:bg-amber-800 text-white text-[8px] uppercase tracking-widest font-black transition-colors"
                              >
                                + Add Bundle
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                            )}

                    <div className="p-3 bg-[#FAF9F6] border border-dashed border-amber-600/20 rounded-xs flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] md:text-xs text-neutral-600 leading-normal">
                        <span className="font-semibold text-neutral-800 uppercase block mb-0.5">Luxury Sizing Concierge</span>
                        Select your perfect size and color above! Check out securely using our instant <strong>UPI Gateway (GPay, PhonePe, Paytm)</strong>, or route your order instantly via WhatsApp.
                      </div>
                    </div>
                  </div>

                  {/* Tabs: Details, Fabric & Care, Shipping */}
                  <div className="mb-8 border-b border-neutral-200/60">
                    <div className="flex gap-6">
                      {(['details', 'fabric', 'shipping'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`pb-3 text-xs uppercase tracking-widest font-semibold relative transition-all duration-300 ${
                            activeTab === tab ? 'text-black' : 'text-neutral-400 hover:text-black'
                          }`}
                        >
                          {tab === 'details' ? 'Description' : tab === 'fabric' ? 'Fabric & Care' : 'Shipping & Returns'}
                          {activeTab === tab && (
                            <motion.div
                              layoutId="activeTabUnderline"
                              className="absolute bottom-0 inset-x-0 h-[1.5px] bg-amber-600"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-neutral-700 leading-relaxed mb-8 min-h-[80px]">
                    {activeTab === 'details' && <p>{product.description}</p>}
                    {activeTab === 'fabric' && (
                      <div className="space-y-2">
                        <p>
                          <strong className="text-neutral-900 font-semibold">Fabric:</strong> {product.fabric}
                        </p>
                        <p>
                          <strong className="text-neutral-900 font-semibold">Wash Instructions:</strong> {product.washCare}
                        </p>
                      </div>
                    )}
                    {activeTab === 'shipping' && (
                      <p>
                        Complimentary premium delivery within India in 3 to 6 business days. Express shipping is supported on request. Global priority dispatch via DHL with flat rate. Safe return or size exchanges accepted within 7 calendar days.
                      </p>
                    )}
                  </div>
                </div>

                {/* REVIEWS LIST SECTION */}
                <div className="mt-10 pt-10 border-t border-neutral-100">
                  <h3 className="font-sans text-sm uppercase tracking-widest font-bold text-neutral-900 mb-6">
                    Client Reviews ({product.reviews.length})
                  </h3>

                  {product.reviews.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic mb-6">No reviews for this product yet. Be the first to share your experience!</p>
                  ) : (
                    <div className="space-y-5 mb-8">
                      {product.reviews.map((rev) => (
                        <div key={rev.id} className="text-xs border-b border-neutral-100 pb-4">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-semibold text-neutral-900">{rev.author}</span>
                            <span className="text-neutral-400 font-light text-[10px]">{rev.date}</span>
                          </div>
                          <div className="flex items-center text-amber-500 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-neutral-600 leading-relaxed italic">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="bg-neutral-50/80 p-4 border border-neutral-100 space-y-3">
                    <h4 className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-800">
                      Write an Elegant Review
                    </h4>
                    
                    {reviewSuccessMsg && (
                      <p className="text-xs text-emerald-800 bg-emerald-50 p-2 font-medium">
                        Your luxury testimony was added successfully! Thank you.
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="Lady Isabella"
                          className="w-full p-2 bg-white border border-neutral-200 text-xs focus:border-black outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Rating</label>
                        <select
                          value={reviewerRating}
                          onChange={(e) => setReviewerRating(Number(e.target.value))}
                          className="w-full p-2 bg-white border border-neutral-200 text-xs focus:border-black outline-hidden"
                        >
                          <option value="5">5 Stars (Perfect)</option>
                          <option value="4">4 Stars (Exquisite)</option>
                          <option value="3">3 Stars (Good)</option>
                          <option value="2">2 Stars</option>
                          <option value="1">1 Star</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Your Testimony</label>
                      <textarea
                        required
                        rows={2}
                        value={reviewerComment}
                        onChange={(e) => setReviewerComment(e.target.value)}
                        placeholder="The garment is truly breathtaking..."
                        className="w-full p-2 bg-white border border-neutral-200 text-xs focus:border-black outline-hidden resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                    >
                      Publish Review
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* RELATED PRODUCTS SECTION */}
          {relatedProducts.length > 0 && (
            <div className="p-6 md:p-12 bg-[#FAF9F6] border-t border-neutral-200/50">
              <h3 className="font-sans text-center text-xs uppercase tracking-widest font-bold text-neutral-900 mb-8 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" /> Complete The Look / Related Masterpieces
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((rel) => {
                  const relPrice = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(rel.price);

                  return (
                    <div
                      key={rel.id}
                      onClick={() => {
                        onSelectProduct(rel);
                        setActiveImageIndex(0);
                        setSelectedSize(null);
                        setShowOrderSuccess(false);
                      }}
                      className="group cursor-pointer bg-white border border-neutral-200/40 p-2.5 transition-all hover:shadow-md text-center hover:border-amber-600/30"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden mb-2 bg-neutral-50">
                        <img
                          src={rel.images[0]}
                          alt={rel.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-[600ms]"
                        />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">{rel.collection}</span>
                      <h4 className="text-xs font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-1 mt-0.5">
                        {rel.name}
                      </h4>
                      <p className="text-xs font-bold text-neutral-950 mt-1">{relPrice}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RECENTLY VIEWED MASTERPIECES */}
          {recentlyViewed && recentlyViewed.length > 0 && (
            <div className="p-6 md:p-12 bg-white border-t border-neutral-100">
              <h3 className="font-sans text-center text-xs uppercase tracking-widest font-bold text-neutral-400 mb-8 tracking-[0.25em]">
                ⚜️ Your Recently Viewed Masterpieces
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {recentlyViewed.map((item) => {
                  const itemPrice = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(item.price);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectProduct(item);
                        setActiveImageIndex(0);
                        setSelectedSize(null);
                        setShowOrderSuccess(false);
                      }}
                      className="group cursor-pointer bg-[#FAF9F6] border border-neutral-200/20 p-2 transition-all hover:shadow-sm text-center"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden mb-1.5 bg-white">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-[600ms]"
                        />
                      </div>
                      <h4 className="text-[11px] font-medium text-neutral-800 group-hover:text-amber-800 transition-colors line-clamp-1 mt-0.5">
                        {item.name}
                      </h4>
                      <p className="text-[10px] font-bold text-neutral-950 mt-0.5">{itemPrice}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Size chart guide popup */}
      <SizeChart isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
    </div>
  );
}
