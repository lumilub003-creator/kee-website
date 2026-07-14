import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, Menu, X, MessageSquare, ChevronDown, ShoppingBag, User } from 'lucide-react';
import { Product } from '../types';
import WishlistDrawer from './WishlistDrawer';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, arg?: any) => void;
  wishlistedProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  whatsappNumber?: string;
}

export default function Header({
  currentView,
  onNavigate,
  wishlistedProducts,
  onRemoveFromWishlist,
  onSelectProduct,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  whatsappNumber = '919999999999',
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleNavClick = (view: string, arg?: any) => {
    onNavigate(view, arg);
    setIsMobileMenuOpen(false);
    setIsCollectionsDropdownOpen(false);
  };

  const menuItems = [
    { label: 'Home', view: 'home' },
    { label: 'Shop All', view: 'shop' },
    { label: 'New Arrivals', view: 'shop', arg: 'new' },
    { label: 'Best Sellers', view: 'shop', arg: 'bestsellers' },
    { label: 'About Us', view: 'about' },
    { label: 'FAQ', view: 'faq' },
    { label: 'Contact', view: 'contact' },
  ];

  const collections = [
    { label: 'Kurtis', arg: 'Kurtis' },
    { label: 'Maxi Dresses', arg: 'Maxi Dresses' },
    { label: 'Co-ord Sets', arg: 'Co-ord Sets' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 shadow-xs">
        {/* Top Announcement Ribbon */}
        <div className="w-full bg-[#111] text-white text-[10px] py-2 px-4 tracking-[0.25em] text-center uppercase font-semibold overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee">
            ⚜️ COMPLIMENTARY EXPRESS SHIPPING PAN-INDIA • VIP CONCIERGE WHATSAPP CUSTOM SEWING • 10% OFF ON YOUR FIRST ORDER ⚜️
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Left: Hamburger & Search Icon */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-700 hover:text-black transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative hidden md:block">
              <button
                onClick={() => setIsSearchActive(!isSearchActive)}
                className="p-2 text-neutral-700 hover:text-black transition-colors flex items-center gap-1.5"
                aria-label="Toggle Search"
              >
                <Search className="w-4.5 h-4.5" />
                <span className="text-xs uppercase tracking-widest font-semibold text-neutral-400">Search</span>
              </button>
            </div>
          </div>

          {/* Center: Brand Typography & Tagline */}
          <div className="text-center flex flex-col items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/assets/logo.jpeg"
                alt="KEE! Brand"
                width="180"
                height="48"
                referrerPolicy="no-referrer"
                className="h-10 sm:h-12 w-auto object-contain py-1"
              />
              <span className="font-sans text-xl sm:text-2xl font-black tracking-[0.2em] text-neutral-900 uppercase">
                KEE!
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.35em] text-neutral-500 uppercase font-bold mt-1">
              Luxury Women's Fashion
            </p>
          </div>

          {/* Right: Quick Inquiries & Wishlist */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=Hello%20KEE!%20I%20would%20love%20to%20consult%20with%20your%20design%20concierge.`, '_blank')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-emerald-100 hover:border-emerald-200 bg-emerald-50 text-emerald-800 text-[10px] uppercase tracking-wider font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
              <span>Concierge</span>
            </button>

            {/* VIP Lounge (Customer Account) */}
            <button
              onClick={() => handleNavClick('customer-portal')}
              className={`p-2 transition-colors flex items-center gap-1.5 ${
                currentView === 'customer-portal' ? 'text-amber-800' : 'text-neutral-700 hover:text-black'
              }`}
              aria-label="VIP Lounge"
            >
              <User className="w-4.5 h-4.5" />
              <span className="hidden md:inline text-xs uppercase tracking-widest font-semibold text-neutral-400">
                VIP Lounge
              </span>
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-neutral-700 hover:text-black transition-colors relative flex items-center gap-1.5"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistedProducts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[8px] font-bold flex items-center justify-center animate-bounce">
                  {wishlistedProducts.length}
                </span>
              )}
              <span className="hidden md:inline text-xs uppercase tracking-widest font-semibold text-neutral-400">
                Wishlist
              </span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="p-2 text-neutral-700 hover:text-amber-800 transition-colors relative flex items-center gap-1.5"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-neutral-900" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full w-4 h-4 text-[8px] font-bold flex items-center justify-center animate-pulse z-10">
                  {cartCount}
                </span>
              )}
              <span className="hidden md:inline text-xs uppercase tracking-widest font-semibold text-neutral-400">
                Cart
              </span>
            </button>
          </div>
        </div>

        {/* Real-time Expandable Search Bar */}
        <AnimatePresence>
          {(isSearchActive || searchQuery) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#FAF9F6] border-b border-neutral-200/50"
            >
              <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
                <Search className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentView !== 'shop') onNavigate('shop');
                  }}
                  placeholder="Inquire for silk, linen, maxi dresses, kurtis..."
                  className="w-full bg-transparent border-none text-sm placeholder-neutral-400 text-neutral-900 outline-hidden focus:ring-0 py-1"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-xs uppercase tracking-wider font-bold text-neutral-400 hover:text-black transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSearchActive(false);
                    onSearchChange('');
                  }}
                  className="p-1 rounded-full text-neutral-400 hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Navigation links */}
        <nav className="hidden lg:block bg-[#FAF9F6] border-t border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 flex justify-center gap-10 py-3.5">
            {/* Simple Menu items */}
            <button
              onClick={() => handleNavClick('home')}
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-all relative ${
                currentView === 'home' ? 'text-amber-800 font-bold' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Home
            </button>

            {/* Collections dropdown trigger */}
            <div
              className="relative group"
              onMouseEnter={() => setIsCollectionsDropdownOpen(true)}
              onMouseLeave={() => setIsCollectionsDropdownOpen(false)}
            >
              <button
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-all flex items-center gap-1 relative ${
                  currentView.includes('collection') ? 'text-amber-800' : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                Collections <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              <AnimatePresence>
                {isCollectionsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-3 w-48 bg-white border border-neutral-200/50 shadow-xl z-50 flex flex-col p-1.5 rounded-none"
                  >
                    {collections.map((col) => (
                      <button
                        key={col.label}
                        onClick={() => handleNavClick('shop', col.arg)}
                        className="w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors font-medium border-l border-transparent hover:border-amber-600"
                      >
                        {col.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleNavClick('shop')}
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-all relative ${
                currentView === 'shop' ? 'text-amber-800 font-bold' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Shop All
            </button>

            <button
              onClick={() => handleNavClick('shop', 'new')}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-800 hover:text-red-950 transition-colors"
            >
              New Arrivals
            </button>

            <button
              onClick={() => handleNavClick('shop', 'bestsellers')}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 hover:text-black transition-colors"
            >
              Best Sellers
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-all relative ${
                currentView === 'about' ? 'text-amber-800' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Our Atelier
            </button>

            <button
              onClick={() => handleNavClick('faq')}
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-all relative ${
                currentView === 'faq' ? 'text-amber-800' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              FAQ
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-all relative ${
                currentView === 'contact' ? 'text-amber-800' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Contact
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE FULL-SCREEN SIDE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xs bg-white flex flex-col justify-between shadow-2xl h-full p-6 z-10 overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center mb-10">
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      handleNavClick('home');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <img
                      src="/assets/logo.jpeg"
                      alt="KEE! Brand"
                      width="120"
                      height="32"
                      referrerPolicy="no-referrer"
                      className="h-8 w-auto object-contain py-0.5"
                    />
                    <span className="font-sans text-lg font-black tracking-[0.2em] text-neutral-900 uppercase">
                      KEE!
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-black"
                    aria-label="Close Mobile Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="mb-8 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      onSearchChange(e.target.value);
                      if (currentView !== 'shop') onNavigate('shop');
                    }}
                    placeholder="Search boutique..."
                    className="w-full bg-neutral-50 border border-neutral-100 p-3 pl-10 text-xs rounded-none focus:outline-hidden focus:border-black text-neutral-800"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-5 flex flex-col text-left">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.view, item.arg)}
                      className={`text-xs uppercase tracking-widest text-left font-semibold pb-1.5 border-b border-neutral-100/60 ${
                        currentView === item.view ? 'text-amber-700' : 'text-neutral-700 hover:text-black'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}

                  {/* Collections list accordion */}
                  <div className="space-y-2 mt-4 pt-4 border-t border-neutral-100">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">Collections</p>
                    {collections.map((col) => (
                      <button
                        key={col.label}
                        onClick={() => handleNavClick('shop', col.arg)}
                        className="block text-xs uppercase tracking-wider text-neutral-600 hover:text-black pl-2 py-1"
                      >
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="mt-12 pt-6 border-t border-neutral-100 text-center space-y-4">
                <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold leading-normal">
                  ELEGANCE IN EVERY THREAD
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
                    className="w-full py-2 bg-emerald-600 text-white text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Concierge
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wishlist Sidebar Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistedProducts={wishlistedProducts}
        onRemoveFromWishlist={onRemoveFromWishlist}
        onSelectProduct={onSelectProduct}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
