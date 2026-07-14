import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Shirt,
  Scissors,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Instagram,
  Heart,
  Eye,
  Mail,
  MapPin,
  Phone,
  Filter,
  X,
  ChevronRight,
  Info,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import PolicyViews from './components/PolicyViews';
import SizeChart from './components/SizeChart';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import OrderConfirmationView from './components/OrderConfirmationView';
import CustomerPortal from './components/CustomerPortal';
import StyleAssistant from './components/StyleAssistant';

import { PRODUCTS, FAQS, INSTAGRAM_POSTS, REVIEWS, COLLECTIONS, IMAGES, INITIAL_BANNERS } from './data';
import { Product, Review, Banner, CartItem, ColorOption, Order, CustomerUser } from './types';

declare global {
  interface Window {
    showToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  }
}

export default function App() {
  // Navigation & Views
  const [currentView, setCurrentView] = useState<string>('home'); // 'home' | 'shop' | 'about' | 'faq' | 'contact' | 'admin'
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'shipping' | 'returns'>('privacy');
  
  // Real-time interactive products database with localStorage persistence
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kee_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return PRODUCTS;
  });

  // Homepage managed banners with localStorage persistence
  const [bannersList, setBannersList] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('kee_banners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BANNERS;
  });
  
  // Filtering & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Shopping Cart state with lazy initial load from localStorage
  const [cartList, setCartList] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kee_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<any>(null);

  // Master Customer Orders list with persistent localStorage
  const [ordersList, setOrdersList] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kee_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => {
    return localStorage.getItem('kee_whatsapp') || '919999999999';
  });

  // Clear all cached logo data and localStorage values on app load once
  useEffect(() => {
    localStorage.removeItem('kee_custom_logo');
  }, []);

  // Master authenticated customer user
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('kee_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Sync state values back to local storage
  useEffect(() => {
    localStorage.setItem('kee_orders', JSON.stringify(ordersList));
  }, [ordersList]);

  useEffect(() => {
    localStorage.setItem('kee_whatsapp', whatsappNumber);
  }, [whatsappNumber]);

  // Set the dynamic browser favicon of the luxury circular KEE! logo
  useEffect(() => {
    const link = (document.querySelector("link[rel~='icon']") as HTMLLinkElement) || document.createElement('link');
    link.type = 'image/jpeg';
    link.rel = 'icon';
    link.href = '/assets/logo.jpeg';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kee_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kee_current_user');
    }
  }, [currentUser]);

  // Cart helper actions
  const handleAddToCart = (
    product: Product,
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL',
    color: ColorOption,
    qty: number = 1,
    showCart: boolean = true
  ) => {
    setCartList((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );
      let updated;
      if (idx > -1) {
        updated = [...prev];
        const targetQty = updated[idx].quantity + qty;
        updated[idx] = { ...updated[idx], quantity: Math.min(targetQty, product.stock) };
      } else {
        updated = [
          ...prev,
          {
            product,
            selectedSize: size,
            selectedColor: color,
            quantity: Math.min(qty, product.stock),
          },
        ];
      }
      localStorage.setItem('kee_cart', JSON.stringify(updated));
      return updated;
    });

    showToast('✓ Added to Cart', 'success');

    if (showCart) {
      triggerTransition(() => {
        setIsCartOpen(true);
      });
    }
  };

  const handleBuyNow = (
    product: Product,
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL',
    color?: ColorOption
  ) => {
    // Adds to cart, skips opening cart drawer, routes directly to checkout
    const finalColor = color || product.colors[0];
    handleAddToCart(product, size, finalColor, 1, false);
    triggerTransition(() => {
      setCurrentView('checkout');
      setSelectedProduct(null); // close details modal if open
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    });
  };

  const handleUpdateCartItemQty = (index: number, newQty: number) => {
    setCartList((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const updated = [...prev];
      const stockLimit = updated[index].product.stock;
      updated[index] = {
        ...updated[index],
        quantity: Math.max(1, Math.min(newQty, stockLimit)),
      };
      localStorage.setItem('kee_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartList((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('kee_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleOrderCompleted = (orderDetails: any) => {
    // Inject Pending status on checkout completion
    const newOrder: Order = {
      ...orderDetails,
      status: 'Pending',
    };
    
    setOrdersList((prev) => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);

    // If there is a VIP logged-in user, append this order to their profile history
    if (currentUser) {
      setCurrentUser((prevUser) => {
        if (!prevUser) return null;
        const updatedOrders = [newOrder, ...(prevUser.orders || [])];
        const updatedUser = { ...prevUser, orders: updatedOrders };
        
        // Sync with registered users db
        const savedUsers = localStorage.getItem('kee_registered_users');
        if (savedUsers) {
          try {
            const usersList: CustomerUser[] = JSON.parse(savedUsers);
            const userIndex = usersList.findIndex((u) => u.email === prevUser.email);
            if (userIndex > -1) {
              usersList[userIndex] = updatedUser;
              localStorage.setItem('kee_registered_users', JSON.stringify(usersList));
            }
          } catch (e) {
            console.error(e);
          }
        }
        return updatedUser;
      });
    }

    showToast('✓ Order Successful', 'success');

    setCartList([]);
    localStorage.removeItem('kee_cart');
    triggerTransition(() => {
      setCurrentView('confirmation');
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    });
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], awb?: string, courier?: string) => {
    setOrdersList((prevOrders) => {
      const updated = prevOrders.map((order) => {
        if (order.orderId === orderId) {
          return {
            ...order,
            status,
            trackingAWB: awb ?? order.trackingAWB,
            trackingCourier: courier ?? order.trackingCourier,
          };
        }
        return order;
      });
      return updated;
    });

    // Also update order status in VIP customer user profile history if matches logged-in user
    if (currentUser) {
      setCurrentUser((prevUser) => {
        if (!prevUser) return null;
        const updatedOrders = (prevUser.orders || []).map((o) =>
          o.orderId === orderId
            ? { ...o, status, trackingAWB: awb ?? o.trackingAWB, trackingCourier: courier ?? o.trackingCourier }
            : o
        );
        const updatedUser = { ...prevUser, orders: updatedOrders };

        // Sync with registered users db
        const savedUsers = localStorage.getItem('kee_registered_users');
        if (savedUsers) {
          try {
            const usersList: CustomerUser[] = JSON.parse(savedUsers);
            const userIndex = usersList.findIndex((u) => u.email === prevUser.email);
            if (userIndex > -1) {
              usersList[userIndex] = updatedUser;
              localStorage.setItem('kee_registered_users', JSON.stringify(usersList));
            }
          } catch (e) {
            console.error(e);
          }
        }
        return updatedUser;
      });
    }
  };
  
  // Details Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Size chart popups
  const [isGeneralSizeGuideOpen, setIsGeneralSizeGuideOpen] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', topic: 'Size Guidance' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Synchronize Wishlist from localStorage on boot
  useEffect(() => {
    const saved = localStorage.getItem('kee_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Update Wishlist helper
  const handleToggleWishlist = (productId: string) => {
    let updated;
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      showToast('✓ Removed from Wishlist', 'info');
    } else {
      updated = [...wishlist, productId];
      showToast('✓ Product Added to Wishlist', 'success');
    }
    setWishlist(updated);
    localStorage.setItem('kee_wishlist', JSON.stringify(updated));
  };

  // Helper for adding reviews on details modal
  const handleAddReviewToProduct = (productId: string, newReview: Review) => {
    setProductsList((prevProducts) => {
      const updated = prevProducts.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          // Recalculate average rating
          const totalRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
          const newAvgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));
          return {
            ...p,
            reviews: updatedReviews,
            rating: newAvgRating,
          };
        }
        return p;
      });
      localStorage.setItem('kee_products', JSON.stringify(updated));
      return updated;
    });
  };

  // Product CRUD state modifiers for Admin Dashboard
  const handleAddProduct = (newProduct: Product) => {
    setProductsList((prev) => {
      const updated = [newProduct, ...prev];
      localStorage.setItem('kee_products', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProductsList((prev) => {
      const updated = prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      localStorage.setItem('kee_products', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      localStorage.setItem('kee_products', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateBanners = (updatedBanners: Banner[]) => {
    setBannersList(updatedBanners);
    localStorage.setItem('kee_banners', JSON.stringify(updatedBanners));
  };

  // Trigger modal display from anywhere
  const handleSelectProduct = (product: Product) => {
    triggerTransition(() => {
      // Sync review data from live state to ensure additions are visible
      const liveProduct = productsList.find((p) => p.id === product.id) || product;
      setSelectedProduct(liveProduct);
    });
  };

  const handleCloseProductDetails = () => {
    triggerTransition(() => {
      setSelectedProduct(null);
    });
  };

  // Resolve active wishlisted products list
  const wishlistedProducts = productsList.filter((p) => wishlist.includes(p.id));

  // Navigate helper
  const handleNavigate = (view: string, arg?: any) => {
    triggerTransition(() => {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'instant' as any });

      if (view === 'shop') {
        if (arg === 'new') {
          setSelectedCollection(null);
          setSelectedSize(null);
          setSortOption('newest');
        } else if (arg === 'bestsellers') {
          setSelectedCollection(null);
          setSelectedSize(null);
          setSortOption('bestseller');
        } else if (arg) {
          // collection name
          setSelectedCollection(arg);
          setSelectedSize(null);
          setSortOption('featured');
        } else {
          // Reset everything
          setSelectedCollection(null);
          setSelectedSize(null);
          setSortOption('featured');
        }
      }
    });
  };

  const handleOpenPolicy = (policy: 'privacy' | 'shipping' | 'returns') => {
    triggerTransition(() => {
      setActivePolicy(policy);
      setCurrentView('policy');
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    });
  };

  // Filter and sort products
  const filteredProducts = productsList.filter((p) => {
    // 1. Search Query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.collection.toLowerCase().includes(query) ||
      p.fabric.toLowerCase().includes(query) ||
      (p.tagline && p.tagline.toLowerCase().includes(query)) ||
      p.description.toLowerCase().includes(query);

    // 2. Collection filter
    const matchesCollection = !selectedCollection || p.collection === selectedCollection;

    // 3. Size filter
    const matchesSize = !selectedSize || p.sizes.includes(selectedSize as any);

    return matchesSearch && matchesCollection && matchesSize;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low-high') return a.price - b.price;
    if (sortOption === 'price-high-low') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    if (sortOption === 'newest') return (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0); // show new first
    if (sortOption === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0); // show bestsellers first
    return 0; // default featured / no change
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.message.trim()) return;

    const whatsappText = `Hello KEE! I am reaching out regarding: *${contactForm.topic}*.\n\n` +
      `👤 *Name*: ${contactForm.name}\n` +
      `✉️ *Email*: ${contactForm.email}\n` +
      `✍️ *Message*: ${contactForm.message}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, '_blank');

    setContactSuccess(true);
    setContactForm({ name: '', email: '', message: '', topic: 'Size Guidance' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const [isAppLoading, setIsAppLoading] = useState(true);

  // Premium Luxury Toast Notification System
  interface ToastItem {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    window.showToast = (msg, type = 'success') => {
      showToast(msg, type);
    };
    return () => {
      delete window.showToast;
    };
  }, []);

  // Reusable Luxury Page Transition state & trigger helper
  const [transitionState, setTransitionState] = useState<{ isVisible: boolean }>({ isVisible: false });

  const triggerTransition = (action: () => void) => {
    setTransitionState({ isVisible: true });
    setTimeout(() => {
      action();
      setTimeout(() => {
        setTransitionState({ isVisible: false });
      }, 50);
    }, 450); // Fully opaque at 450ms, then trigger state updates and start fade-out
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1000); // 1.0 second duration for initial load
    return () => clearTimeout(timer);
  }, []);

  const activeHeroBanner = bannersList.find(b => b.isActive) || bannersList[0];

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-[#FCFCF9] z-[9999] flex flex-col items-center justify-center font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1.02 }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col items-center justify-center"
        >
          <img
            src="/assets/logo.jpeg"
            alt="KEE! Luxury Brand"
            width="224"
            height="224"
            className="w-48 h-48 md:w-56 md:h-56 object-contain"
          />
          <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#3A2D25] font-bold mt-4 animate-pulse" style={{ animationDuration: '2.5s' }}>
            ELEGANCE IN EVERY THREAD
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 flex flex-col font-sans selection:bg-[#DFD1B7] selection:text-neutral-900">
      
      {/* 1. Brand Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        wishlistedProducts={wishlistedProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartList.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => triggerTransition(() => setIsCartOpen(true))}
        whatsappNumber={whatsappNumber}
      />

      {/* 2. Main Router */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* ================= HOME VIEW ================= */}
          {currentView === 'home' && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-16 md:space-y-24"
            >
              {/* Premium Hero Banner (Dynamic Admin Managed) */}
              <section className="relative w-full aspect-[16/10] md:aspect-[16/7] overflow-hidden bg-neutral-950">
                <img
                  src={activeHeroBanner.image}
                  alt={activeHeroBanner.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-[center_35%] opacity-85 transition-transform duration-[4000ms] hover:scale-103"
                />
                
                {/* Gold Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

                <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-left">
                  <div className="max-w-xl space-y-4 sm:space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-600/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-semibold"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Capsule Premiere 2026</span>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.7 }}
                      className="font-sans text-3xl sm:text-5xl md:text-6xl font-extralight tracking-wide text-white uppercase leading-[1.1]"
                    >
                      {activeHeroBanner.title}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.7 }}
                      className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-md"
                    >
                      {activeHeroBanner.subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="pt-4 flex flex-wrap gap-3.5"
                    >
                      <button
                        onClick={() => handleNavigate(activeHeroBanner.ctaView as any, activeHeroBanner.ctaArg)}
                        className="px-6 sm:px-8 py-3.5 bg-white text-neutral-950 text-xs uppercase tracking-[0.2em] font-bold transition-all hover:bg-[#D4AF37] hover:text-black hover:shadow-lg"
                      >
                        {activeHeroBanner.ctaText}
                      </button>
                      <button
                        onClick={() => handleNavigate('shop', 'Kurtis')}
                        className="px-6 sm:px-8 py-3.5 bg-transparent text-white border border-white/40 text-xs uppercase tracking-[0.2em] font-bold transition-all hover:bg-white/10 hover:border-white"
                      >
                        Kurtis Edition
                      </button>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Collections Navigation Bento */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Signature Lines</span>
                  <h2 className="font-sans text-2xl sm:text-3xl font-light tracking-wider text-neutral-950 mt-1 uppercase">
                    Featured Collections
                  </h2>
                  <div className="w-12 h-[1px] bg-amber-600 mx-auto mt-3.5" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {COLLECTIONS.map((col, idx) => (
                    <div
                      key={col.id}
                      onClick={() => handleNavigate('shop', col.name)}
                      className="group cursor-pointer relative aspect-[3/4] overflow-hidden bg-neutral-950 border border-neutral-200/40"
                    >
                      <img
                        src={col.image}
                        alt={col.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-[1200ms] group-hover:scale-105 group-hover:opacity-80 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                      
                      <div className="absolute bottom-5 inset-x-5 text-left">
                        <span className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold">
                          0{idx + 1} / Atelier
                        </span>
                        <h3 className="font-sans text-base font-semibold text-white uppercase tracking-wider mt-1">
                          {col.name}
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-light mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 line-clamp-2 leading-relaxed">
                          {col.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase text-white font-bold mt-3 border-b border-white/20 pb-0.5 group-hover:text-[#D4AF37] transition-all">
                          Acquire Collection <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Products Sections or Coming Soon */}
              {productsList.length === 0 ? (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <div className="bg-[#FAF9F6] border border-[#D4AF37]/30 text-center py-24 px-6 md:px-12 space-y-6 max-w-2xl mx-auto shadow-sm">
                    <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Atelier Launch</span>
                    <h3 className="font-sans text-2xl md:text-3xl font-light tracking-widest text-[#1e1e1e] uppercase">
                      New Collection Coming Soon
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                      Premium styles are being carefully curated. Stay tuned for our first exclusive collection.
                    </p>
                    <div className="w-12 h-[1px] bg-amber-600/60 mx-auto" />
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const email = (e.currentTarget.elements.namedItem('coming_soon_email') as HTMLInputElement).value;
                        if (email) {
                          showToast('✓ Thank you! We will notify you when the collection launches.', 'success');
                          e.currentTarget.reset();
                        }
                      }}
                      className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-4"
                    >
                      <input
                        type="email"
                        name="coming_soon_email"
                        required
                        placeholder="Your email address"
                        className="flex-1 p-3 border border-neutral-200 bg-white text-xs outline-hidden focus:border-black transition-all text-neutral-900"
                      />
                      <button
                        type="submit"
                        className="bg-neutral-950 text-white text-xs uppercase tracking-widest font-bold px-6 py-3 hover:bg-amber-800 transition-all shrink-0 cursor-pointer"
                      >
                        Notify Me
                      </button>
                    </form>
                  </div>
                </section>
              ) : (
                <>
                  {/* New Arrivals Section */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-baseline mb-10 border-b border-neutral-100 pb-4">
                      <div>
                        <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Fresh off Loom</span>
                        <h2 className="font-sans text-2xl sm:text-3xl font-light tracking-wide text-neutral-950 uppercase mt-0.5">
                          New Arrivals
                        </h2>
                      </div>
                      <button
                        onClick={() => handleNavigate('shop', 'new')}
                        className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-950 font-bold border-b border-transparent hover:border-black transition-all flex items-center gap-1"
                      >
                        View All <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {productsList
                        .filter((p) => p.isNew)
                        .slice(0, 4)
                        .map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onSelect={handleSelectProduct}
                            isWishlisted={wishlist.includes(product.id)}
                            onToggleWishlist={handleToggleWishlist}
                            onAddToCart={(prod, sz) => handleAddToCart(prod, sz, prod.colors[0], 1, true)}
                            onBuyNow={handleBuyNow}
                            whatsappNumber={whatsappNumber}
                          />
                        ))}
                    </div>
                  </section>

                  {/* Best Sellers Section */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-baseline mb-10 border-b border-neutral-100 pb-4">
                      <div>
                        <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Acclaimed Elegance</span>
                        <h2 className="font-sans text-2xl sm:text-3xl font-light tracking-wide text-neutral-950 uppercase mt-0.5">
                          Best Sellers
                        </h2>
                      </div>
                      <button
                        onClick={() => handleNavigate('shop', 'bestsellers')}
                        className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-950 font-bold border-b border-transparent hover:border-black transition-all flex items-center gap-1"
                      >
                        View All <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {productsList
                        .filter((p) => p.isBestSeller)
                        .slice(0, 4)
                        .map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onSelect={handleSelectProduct}
                            isWishlisted={wishlist.includes(product.id)}
                            onToggleWishlist={handleToggleWishlist}
                            onAddToCart={(prod, sz) => handleAddToCart(prod, sz, prod.colors[0], 1, true)}
                            onBuyNow={handleBuyNow}
                            whatsappNumber={whatsappNumber}
                          />
                        ))}
                    </div>
                  </section>
                </>
              )}

              {/* Why Choose KEE! Brand Philosophy */}
              <section className="bg-neutral-950 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-[0.35em]">Uncompromised Standards</span>
                  <h2 className="font-sans text-2xl sm:text-3xl font-light tracking-wider text-white mt-1 uppercase">
                    Why Choose KEE!
                  </h2>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto mt-3">
                    Exquisite fabrics woven with patience, tailored to amplify your sovereign self.
                  </p>
                  <div className="w-12 h-[1px] bg-amber-600/60 mx-auto mt-4 mb-16" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div className="space-y-4">
                      <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                        <Shirt className="w-6 h-6" />
                      </div>
                      <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-white">
                        Premium Natural Fabrics
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed px-4">
                        We import and source only elite materials: fine pure Italian satin, heavyweight Belgian organic linens, and Handloom silk.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                        <Scissors className="w-6 h-6" />
                      </div>
                      <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-white">
                        Atelier Sizing Guidance
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed px-4">
                        Consult directly with our custom stitching master via WhatsApp for personalized sizing, bespoke sleeve length, and neckline tweaks.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-white">
                        Expedited VIP Shipping
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed px-4">
                        Complimentary premium shipping within India with leading express air couriers. Arrives beautiful, steam-pressed, in dustbags.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                        <Shield className="w-6 h-6" />
                      </div>
                      <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-white">
                        Elite Satisfaction Rules
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed px-4">
                        Size suboptimal? We arrange instant pick-up from your residence and process instant digital UPI exchanges or full refunds.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bento Reviews Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Clientele Chronicles</span>
                  <h2 className="font-sans text-2xl sm:text-3xl font-light tracking-wider text-neutral-950 mt-1 uppercase">
                    Trusted by Modern Women
                  </h2>
                  <div className="w-12 h-[1px] bg-amber-600 mx-auto mt-3.5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {REVIEWS.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white border border-neutral-100 p-6 md:p-8 flex flex-col justify-between shadow-xs relative"
                    >
                      <span className="text-6xl text-amber-500/15 font-serif absolute top-4 left-4 font-black">“</span>
                      
                      <div className="space-y-4 relative z-10">
                        {/* Rating stars */}
                        <div className="flex text-amber-500 gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Sparkles key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <p className="text-xs text-neutral-700 leading-relaxed italic">
                          "{rev.text}"
                        </p>
                      </div>

                      <div className="flex items-center gap-4 mt-8 pt-4 border-t border-neutral-50">
                        <img
                          src={rev.avatar}
                          alt={rev.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">{rev.name}</h4>
                          <span className="text-[10px] text-neutral-400 font-light uppercase tracking-widest">{rev.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Instagram Feed Integration Grid */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Digital Lookbook</span>
                  <h2 className="font-sans text-2xl sm:text-3xl font-light tracking-wider text-neutral-950 mt-1 uppercase">
                    #KEE!ELEGANCE
                  </h2>
                  <p className="text-xs text-neutral-500 mt-2">
                    Follow us on Instagram for dynamic styling guides, moodboards and studio updates.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {INSTAGRAM_POSTS.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => window.open('https://instagram.com/kee.official__', '_blank')}
                      className="group cursor-pointer relative aspect-square bg-neutral-950 overflow-hidden"
                    >
                      <img
                        src={post.image}
                        alt="Instagram style post"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-75"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <div className="text-center space-y-1">
                          <Instagram className="w-5 h-5 mx-auto" />
                          <span className="text-[10px] uppercase font-bold tracking-widest">{post.likes} Likes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ================= SHOP VIEW ================= */}
          {currentView === 'shop' && (
            <motion.div
              key="shop-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16"
            >
              {/* Header section with collection banners or clear headings */}
              <div className="text-center mb-10">
                <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Online Atelier</span>
                <h2 className="font-sans text-3xl font-light text-neutral-950 uppercase mt-1 tracking-wide">
                  {selectedCollection ? `${selectedCollection}` : 'Boutique Collection'}
                </h2>
                <p className="text-xs text-neutral-500 max-w-md mx-auto mt-2 leading-relaxed">
                  Browse our exquisite, tailor-stitched catalog. Refine garments by collection, size guidelines, or sorting parameters.
                </p>
                <div className="w-12 h-[1px] bg-amber-600/60 mx-auto mt-4" />
              </div>

              {/* Dynamic filter toolbar */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Desktop Sidebar filter menu */}
                <aside className="w-full lg:w-64 shrink-0 bg-white border border-neutral-100 p-5 md:p-6 space-y-6 hidden lg:block">
                  <div className="border-b border-neutral-100 pb-4">
                    <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-neutral-900">
                      Refine Options
                    </h3>
                  </div>

                  {/* Search Feedback inside sidebar if exists */}
                  {searchQuery && (
                    <div className="bg-neutral-50 p-3 text-xs text-neutral-600 border border-neutral-100">
                      Searching for "<span className="font-semibold text-black">{searchQuery}</span>"
                      <button onClick={() => setSearchQuery('')} className="block text-[10px] text-amber-700 font-bold mt-1.5 uppercase hover:underline">
                        Clear Search
                      </button>
                    </div>
                  )}

                  {/* Collections list filter */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">Atelier Lines</span>
                    <div className="flex flex-col text-left space-y-2.5">
                      <button
                        onClick={() => setSelectedCollection(null)}
                        className={`text-xs font-semibold uppercase tracking-wider text-left transition-colors ${
                          selectedCollection === null ? 'text-amber-800 font-bold' : 'text-neutral-600 hover:text-black'
                        }`}
                      >
                        All Masterpieces
                      </button>
                      {['Kurtis', 'Maxi Dresses', 'Co-ord Sets', 'Western Wear'].map((col) => (
                        <button
                          key={col}
                          onClick={() => setSelectedCollection(col)}
                          className={`text-xs font-semibold uppercase tracking-wider text-left transition-colors ${
                            selectedCollection === col ? 'text-amber-800 font-bold' : 'text-neutral-600 hover:text-black'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size list filter */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">Select Size</span>
                    <div className="flex flex-wrap gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                          className={`w-9 h-9 border text-xs font-semibold flex items-center justify-center transition-all ${
                            selectedSize === size
                              ? 'bg-black border-black text-white'
                              : 'border-neutral-200 text-neutral-700 hover:border-black hover:bg-[#FAF9F6]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* General Size guide popup trigger */}
                  <div className="pt-2">
                    <button
                      onClick={() => setIsGeneralSizeGuideOpen(true)}
                      className="text-[10px] uppercase tracking-widest font-bold text-amber-800 hover:text-black hover:underline flex items-center gap-1"
                    >
                      View Size Chart & measurements
                    </button>
                  </div>
                </aside>

                {/* Mobile filters button & Toolbar */}
                <div className="w-full flex-1 space-y-6">
                  <div className="flex flex-wrap justify-between items-center gap-4 bg-white border border-neutral-100 p-4">
                    <div className="flex items-center gap-3">
                      {/* Mobile sidebar trigger */}
                      <button
                        onClick={() => setIsFilterSidebarOpen(true)}
                        className="lg:hidden p-2.5 bg-neutral-950 text-white hover:bg-neutral-900 transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                      >
                        <Filter className="w-4 h-4" /> Filters
                      </button>
                      <span className="text-xs text-neutral-500 font-medium">
                        Displaying <strong className="text-neutral-900">{sortedProducts.length}</strong> creations
                      </span>
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">Sort By:</span>
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-2 border border-neutral-200 bg-white text-xs font-semibold focus:outline-hidden focus:border-black outline-hidden"
                      >
                        <option value="featured">Default (Featured)</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="newest">Newest First</option>
                        <option value="bestseller">Best Sellers</option>
                      </select>
                    </div>
                  </div>

                  {/* Active filters breadcrumbs */}
                  {(selectedCollection || selectedSize || searchQuery) && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">Active Refinements:</span>
                      
                      {selectedCollection && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-900 px-2.5 py-1 uppercase tracking-wider font-semibold flex items-center gap-1 border border-amber-500/20">
                          Collection: {selectedCollection}
                          <button onClick={() => setSelectedCollection(null)} className="hover:text-black">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {selectedSize && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-900 px-2.5 py-1 uppercase tracking-wider font-semibold flex items-center gap-1 border border-amber-500/20">
                          Size: {selectedSize}
                          <button onClick={() => setSelectedSize(null)} className="hover:text-black">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {searchQuery && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-900 px-2.5 py-1 uppercase tracking-wider font-semibold flex items-center gap-1 border border-amber-500/20">
                          Search: "{searchQuery}"
                          <button onClick={() => setSearchQuery('')} className="hover:text-black">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setSelectedCollection(null);
                          setSelectedSize(null);
                          setSearchQuery('');
                        }}
                        className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-red-700 transition-colors"
                      >
                        Reset All
                      </button>
                    </div>
                  )}

                  {/* Products Grid */}
                  {productsList.length === 0 ? (
                    <div className="bg-[#FAF9F6] border border-[#D4AF37]/30 text-center py-24 px-6 md:px-12 space-y-6 max-w-2xl mx-auto shadow-sm">
                      <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Atelier Launch</span>
                      <h3 className="font-sans text-2xl md:text-3xl font-light tracking-widest text-neutral-900 uppercase">
                        New Collection Coming Soon
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                        Premium styles are being carefully curated. Stay tuned for our first exclusive collection.
                      </p>
                      <div className="w-12 h-[1px] bg-amber-600/60 mx-auto" />
                      
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const email = (e.currentTarget.elements.namedItem('coming_soon_email') as HTMLInputElement).value;
                          if (email) {
                            showToast('✓ Thank you! We will notify you when the collection launches.', 'success');
                            e.currentTarget.reset();
                          }
                        }}
                        className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-4"
                      >
                        <input
                          type="email"
                          name="coming_soon_email"
                          required
                          placeholder="Your email address"
                          className="flex-1 p-3 border border-neutral-200 bg-white text-xs outline-hidden focus:border-black transition-all text-neutral-900"
                        />
                        <button
                          type="submit"
                          className="bg-neutral-950 text-white text-xs uppercase tracking-widest font-bold px-6 py-3 hover:bg-amber-800 transition-all shrink-0 cursor-pointer"
                        >
                          Notify Me
                        </button>
                      </form>
                    </div>
                  ) : sortedProducts.length === 0 ? (
                    <div className="bg-white border border-neutral-100 text-center py-20 px-6 space-y-4">
                      <div className="w-12 h-12 rounded-full border border-neutral-100 bg-neutral-50 flex items-center justify-center mx-auto text-neutral-300">
                        <Shirt className="w-5 h-5 animate-pulse" />
                      </div>
                      <h3 className="font-sans text-sm uppercase tracking-widest font-bold text-neutral-900">
                        No creations match filters
                      </h3>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                        We apologize. We currently do not have matching size variations or collections available. Reach our custom stitching desk below for custom bespoke weaving instructions.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCollection(null);
                          setSelectedSize(null);
                          setSearchQuery('');
                        }}
                        className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-amber-800 transition-colors"
                      >
                        Browse Full Catalogue
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {sortedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelect={handleSelectProduct}
                          isWishlisted={wishlist.includes(product.id)}
                          onToggleWishlist={handleToggleWishlist}
                          onAddToCart={(prod, sz) => handleAddToCart(prod, sz, prod.colors[0], 1, true)}
                          onBuyNow={handleBuyNow}
                          whatsappNumber={whatsappNumber}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* MOBILE BOTTOM FILTER SHEET */}
              <AnimatePresence>
                {isFilterSidebarOpen && (
                  <div className="fixed inset-0 z-50 flex lg:hidden">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsFilterSidebarOpen(false)}
                      className="absolute inset-0 bg-black"
                    />

                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="relative w-full mt-auto bg-white rounded-t-2xl shadow-2xl p-6 z-10 flex flex-col justify-between max-h-[80vh] overflow-y-auto"
                    >
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                          <h3 className="font-sans text-sm uppercase tracking-widest font-bold text-neutral-950">
                            Refine Products
                          </h3>
                          <button
                            onClick={() => setIsFilterSidebarOpen(false)}
                            className="p-1 rounded-full text-neutral-400 hover:text-black"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Mobile Collection Filter */}
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block">Atelier Lines</span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setSelectedCollection(null);
                                setIsFilterSidebarOpen(false);
                              }}
                              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border ${
                                selectedCollection === null ? 'bg-black border-black text-white' : 'border-neutral-200 text-neutral-700'
                              }`}
                            >
                              All
                            </button>
                            {['Kurtis', 'Maxi Dresses', 'Co-ord Sets', 'Western Wear'].map((col) => (
                              <button
                                key={col}
                                onClick={() => {
                                  setSelectedCollection(col);
                                  setIsFilterSidebarOpen(false);
                                }}
                                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border ${
                                  selectedCollection === col ? 'bg-black border-black text-white' : 'border-neutral-200 text-neutral-700'
                                }`}
                              >
                                {col}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Mobile Size Filter */}
                        <div className="space-y-3 pt-4 border-t border-neutral-100">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block">Select Size</span>
                          <div className="flex flex-wrap gap-2">
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                              <button
                                key={size}
                                onClick={() => {
                                  setSelectedSize(selectedSize === size ? null : size);
                                  setIsFilterSidebarOpen(false);
                                }}
                                className={`w-9 h-9 border text-xs font-semibold flex items-center justify-center transition-all ${
                                  selectedSize === size
                                    ? 'bg-black border-black text-white'
                                    : 'border-neutral-200 text-neutral-700'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-neutral-100">
                        <button
                          onClick={() => {
                            setSelectedCollection(null);
                            setSelectedSize(null);
                            setSearchQuery('');
                            setIsFilterSidebarOpen(false);
                          }}
                          className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs uppercase tracking-widest font-semibold transition-colors text-center"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ================= ABOUT US ================= */}
          {currentView === 'about' && (
            <motion.div
              key="about-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-16 text-neutral-800"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Our Atelier</span>
                <h1 className="font-sans text-3xl md:text-4xl font-light tracking-wide text-neutral-950 uppercase">
                  Our Story
                </h1>
                <div className="w-12 h-[1px] bg-amber-600/60 mx-auto mt-4" />
              </div>

              {/* Story Intro */}
              <div className="prose prose-neutral max-w-none text-sm md:text-base leading-relaxed space-y-6 text-neutral-600 font-light">
                <p>
                  At <strong className="text-neutral-950 font-bold">KEE!</strong>, our foundational mission is encapsulated in four simple, powerful words: <strong>ELEGANCE IN EVERY THREAD</strong>.
                </p>
                <p>
                  Established as an elite micro-atelier, KEE! was created to counter the hyper-fast, mass-produced textile culture that compromises on longevity and structural dignity. We believe a woman's clothing is a visual fortress of her grace, confidence, and posture.
                </p>
              </div>

              {/* Bento visual story layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
                <div className="space-y-4">
                  <h3 className="font-sans text-sm uppercase tracking-widest font-bold text-neutral-900">
                    Traditional Looms Meet Modern Silhouettes
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-600">
                    We collaborate closely with traditional handloom co-operatives. From Chanderi weavers to mulberry silk rearing artisans, our supply chain respects ancestral patience. Each garment has passed through the skilled fingers of a master tailor, bringing back a sense of tactile honesty.
                  </p>
                  <p className="text-xs leading-relaxed text-neutral-600">
                    By choosing KEE!, you actively preserve heritage silk weaving cultures and support sustainable livelihood ecosystems for veteran Indian and European master weavers.
                  </p>
                </div>
                <div className="aspect-[4/3] overflow-hidden bg-neutral-100 border border-neutral-200/40">
                  <img
                    src={IMAGES.hero}
                    alt="Atelier Loom"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Philosophy Accordion blocks */}
              <div className="space-y-4 pt-8">
                <h3 className="font-sans text-xs uppercase tracking-[0.25em] text-center font-bold text-neutral-950 mb-6">
                  Atelier Pillars
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-neutral-100 p-5 space-y-2">
                    <CheckCircle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-neutral-950">
                      Slow Fashion Charter
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      We design limited capsule units only. We maintain low inventory metrics to avoid over-production, prioritizing luxury quality over sheer volume.
                    </p>
                  </div>

                  <div className="bg-white border border-neutral-100 p-5 space-y-2">
                    <CheckCircle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-neutral-950">
                      Bespoke Adaptations
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Our signature size configuration allows shoppers to specify sleeves, custom heights and neckline closures directly over WhatsApp with our tailoring masters.
                    </p>
                  </div>

                  <div className="bg-white border border-neutral-100 p-5 space-y-2">
                    <CheckCircle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-neutral-950">
                      Fair Wages & Dignity
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Every seamstress and handloom artisan in our ecosystem is paid double the local industry base, working in sunlit, ergonomic, clean, safe spaces.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= FAQ VIEW ================= */}
          {currentView === 'faq' && (
            <motion.div
              key="faq-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto px-6 py-12 md:py-20 space-y-12"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Boutique Assistance</span>
                <h1 className="font-sans text-3xl font-light text-neutral-950 uppercase">
                  Frequently Answered Questions
                </h1>
                <div className="w-12 h-[1px] bg-amber-600/60 mx-auto mt-4" />
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-neutral-100 p-5 space-y-2 hover:border-neutral-200 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-950">{faq.question}</h4>
                        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-neutral-50 p-5 text-center border border-neutral-200/50 space-y-3">
                <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-neutral-900">
                  Have an Unlisted Request?
                </h4>
                <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                  Our personal stylist concierge is always on hand to discuss custom fabric selections, color dye options, and urgent shipping requests.
                </p>
                <button
                  onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=Hello%20KEE!%20I%20have%20a%20special%20sizing%20or%20delivery%20request.`, '_blank')}
                  className="px-6 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-amber-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> Talk with Stylist on WhatsApp
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= CONTACT VIEW ================= */}
          {currentView === 'contact' && (
            <motion.div
              key="contact-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-[0.3em]">Reach KEE! Desk</span>
                <h1 className="font-sans text-3xl font-light text-neutral-950 uppercase">
                  Connect With Our Concierge
                </h1>
                <div className="w-12 h-[1px] bg-amber-600/60 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                
                {/* Contact coordinates */}
                <div className="lg:col-span-5 bg-neutral-950 text-neutral-400 p-8 flex flex-col justify-between border border-neutral-900">
                  <div className="space-y-8 text-left">
                    <div>
                      <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-2">
                        Atelier Coordinates
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Consult directly with our custom design desk or book a private fitting preview session.
                      </p>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white uppercase tracking-wider text-[10px]">Atelier Location</p>
                          <p className="text-neutral-500 mt-0.5">Online Store – Namakkal, Tamil Nadu, India</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white uppercase tracking-wider text-[10px]">Stylist Concierge Line</p>
                          <a
                            href={`https://wa.me/${whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-white transition-colors mt-0.5 block"
                          >
                            {whatsappNumber === '919999999999' ? '+91 99999 99999' : `+${whatsappNumber}`} (WhatsApp Support)
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white uppercase tracking-wider text-[10px]">Electronic Mail Desk</p>
                          <a href="mailto:shopkeeofficial@gmail.com" className="text-neutral-500 hover:text-white transition-colors mt-0.5 block">
                            shopkeeofficial@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Instagram className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white uppercase tracking-wider text-[10px]">Instagram Atelier</p>
                          <a
                            href="https://instagram.com/kee.official__"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-white transition-colors mt-0.5 block"
                          >
                            @kee.official__
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-neutral-900 mt-8">
                    <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-semibold leading-relaxed">
                      ⚜️ CUSTOM FIT NOTE: Sleeves, customized lengths and neck profiles can be accommodated easily.
                    </p>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-7 bg-white border border-neutral-100 p-8 text-left">
                  <h3 className="font-sans text-sm uppercase tracking-widest font-bold text-neutral-900 mb-6">
                    Initiate an Inquiry Form
                  </h3>

                  {contactSuccess && (
                    <div className="bg-emerald-50 text-emerald-800 p-4 font-semibold text-xs mb-6">
                      ⚜️ Inquiry details composed! We have opened WhatsApp with your details. Click 'Send' in WhatsApp to complete.
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Duchess Elizabeth"
                          className="w-full p-3 bg-neutral-50 border border-neutral-100 text-xs focus:border-black outline-hidden text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Your Email</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="elizabeth@monarchy.com"
                          className="w-full p-3 bg-neutral-50 border border-neutral-100 text-xs focus:border-black outline-hidden text-neutral-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Inquiry Category</label>
                      <select
                        value={contactForm.topic}
                        onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                        className="w-full p-3 bg-neutral-50 border border-neutral-100 text-xs focus:border-black outline-hidden text-neutral-900"
                      >
                        <option value="Size Guidance">Custom Size / Height Modification</option>
                        <option value="Bespoke Collection">Exclusive Private Viewing Session</option>
                        <option value="Shipping Inquiry">International Expedited Shipping Quote</option>
                        <option value="Custom Embroidery">Custom Zari Embroidery Details</option>
                        <option value="Corporate/Gift Inquiry">Bulk Custom Corporate Gifting</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Your Message Details</label>
                      <textarea
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Please describe your sizing coordinates or customization preferences..."
                        className="w-full p-3 bg-neutral-50 border border-neutral-100 text-xs focus:border-black outline-hidden resize-none text-neutral-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-neutral-950 text-[#FAF9F6] hover:bg-amber-800 text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400 fill-emerald-400" /> Send inquiry via WhatsApp
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= POLICIES VIEWS ================= */}
          {currentView === 'policy' && (
            <PolicyViews
              activePolicy={activePolicy}
              onBack={() => setCurrentView('home')}
            />
          )}

          {/* ================= ADMIN VIEW ================= */}
          {currentView === 'admin' && (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <AdminDashboard
                productsList={productsList}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                bannersList={bannersList}
                onUpdateBanners={handleUpdateBanners}
                onClose={() => handleNavigate('home')}
                ordersList={ordersList}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                whatsappNumber={whatsappNumber}
                onUpdateWhatsappNumber={setWhatsappNumber}
              />
            </motion.div>
          )}

          {/* ================= CHECKOUT VIEW ================= */}
          {currentView === 'checkout' && (
            <motion.div
              key="checkout-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <CheckoutView
                cartList={cartList}
                onUpdateQty={handleUpdateCartItemQty}
                onRemoveItem={handleRemoveCartItem}
                onNavigateBack={() => handleNavigate('shop')}
                onOrderCompleted={handleOrderCompleted}
                whatsappNumber={whatsappNumber}
              />
            </motion.div>
          )}

          {/* ================= ORDER CONFIRMATION VIEW ================= */}
          {currentView === 'confirmation' && lastCompletedOrder && (
            <motion.div
              key="confirmation-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <OrderConfirmationView
                orderDetails={lastCompletedOrder}
                onContinueShopping={() => handleNavigate('home')}
                whatsappNumber={whatsappNumber}
              />
            </motion.div>
          )}

          {/* ================= CUSTOMER PORTAL / VIP LOUNGE ================= */}
          {currentView === 'customer-portal' && (
            <motion.div
              key="customer-portal-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CustomerPortal
                productsList={productsList}
                ordersList={ordersList}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onSelectProduct={handleSelectProduct}
                currentUser={currentUser}
                onLoginUser={setCurrentUser}
                onLogoutUser={() => setCurrentUser(null)}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. Global Premium Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPolicy={handleOpenPolicy}
        whatsappNumber={whatsappNumber}
      />

      {/* ================= FLOATING WHATSAPP CHAT WIDGET ================= */}
      <div className="fixed bottom-6 right-6 z-40 group flex flex-col items-end gap-2.5">
        
        {/* Hover label / tooltip */}
        <div className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-neutral-950 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-2 border border-neutral-800 pointer-events-none whitespace-nowrap shadow-xl">
          ⚜️ Chat with KEE! Stylist
        </div>

        <button
          onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=Hello%20KEE!%20I%20would%20love%20to%20consult%20with%20your%20concierge%20stylist.`, '_blank')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center relative border border-emerald-500 rounded-full"
          aria-label="Direct Chat with Stylist"
        >
          <MessageSquare className="w-6 h-6 text-white fill-white" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white flex items-center justify-center text-[8px] font-bold text-white">1</span>
          </span>
        </button>
      </div>

      {/* ================= STYLE ASSISTANT CHAT BOT ================= */}
      <StyleAssistant
        productsList={productsList}
        onSelectProduct={handleSelectProduct}
        onAddToCart={handleAddToCart}
      />

      {/* ================= DETAILS MODAL POPUP ================= */}
      {selectedProduct && (
        <ProductDetailsModal
          isOpen={!!selectedProduct}
          product={selectedProduct}
          onClose={handleCloseProductDetails}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          relatedProducts={productsList.filter((p) => p.collection === selectedProduct.collection && p.id !== selectedProduct.id).slice(0, 4)}
          onSelectProduct={handleSelectProduct}
          onAddReview={handleAddReviewToProduct}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          whatsappNumber={whatsappNumber}
          allProducts={productsList}
        />
      )}

      {/* ================= GENERAL SIZE GUIDE POPUP ================= */}
      <SizeChart
        isOpen={isGeneralSizeGuideOpen}
        onClose={() => setIsGeneralSizeGuideOpen(false)}
      />

      {/* ================= SHOPPING CART DRAWER ================= */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartList={cartList}
        onUpdateCartItemQty={handleUpdateCartItemQty}
        onRemoveCartItem={handleRemoveCartItem}
        onNavigateToCheckout={() => handleNavigate('checkout')}
      />

      {/* ================= LUXURY PAGE TRANSITION OVERLAY ================= */}
      <AnimatePresence>
        {transitionState.isVisible && (
          <motion.div
            key="luxury-page-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#FCFCF9] z-[10000] flex flex-col items-center justify-center font-sans"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col items-center justify-center"
            >
              <img
                src="/assets/logo.jpeg"
                alt="KEE! Luxury Brand"
                width="224"
                height="224"
                className="w-48 h-48 md:w-56 md:h-56 object-contain"
              />
              <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#3A2D25] font-bold mt-4 animate-pulse" style={{ animationDuration: '2.5s' }}>
                ELEGANCE IN EVERY THREAD
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TOAST NOTIFICATIONS ================= */}
      <div className="fixed bottom-6 right-6 z-[11000] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="pointer-events-auto flex items-center justify-between gap-4 p-4 bg-neutral-950/95 border border-[#D4AF37]/40 shadow-2xl backdrop-blur-md text-white"
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && (
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="w-5 h-5 rounded-full bg-red-500/25 flex items-center justify-center text-red-400 shrink-0">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                )}
                {toast.type === 'warning' && (
                  <div className="w-5 h-5 rounded-full bg-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="w-5 h-5 rounded-full bg-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                )}
                <p className="font-sans text-xs font-semibold tracking-wide uppercase leading-tight">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
