import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  Heart,
  LogOut,
  AlertCircle,
  MapPin,
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';
import { Product, Order, CustomerUser } from '../types';

interface CustomerPortalProps {
  productsList: Product[];
  ordersList: Order[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL', color: any, qty: number, showCart: boolean) => void;
  onBuyNow: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  onSelectProduct: (product: Product) => void;
  currentUser: CustomerUser | null;
  onLoginUser: (user: CustomerUser) => void;
  onLogoutUser: () => void;
}

export default function CustomerPortal({
  productsList,
  ordersList,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  currentUser,
  onLoginUser,
  onLogoutUser,
}: CustomerPortalProps) {
  // Navigation within Customer Portal
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form Inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  // Statuses
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Local storage lists for registered users mockup
  const getRegisteredUsers = (): CustomerUser[] => {
    const saved = localStorage.getItem('kee_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 'usr-1', fullName: 'Lady Isabella Montgomery', email: 'isabella@example.com', phone: '+91 99999 99999' }
    ];
  };

  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
  }, [authView, activeTab]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter all credentials.');
      return;
    }

    const users = getRegisteredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim());

    if (foundUser) {
      onLoginUser(foundUser);
      setSuccessMsg(`Welcome back, ${foundUser.fullName}!`);
    } else {
      setErrorMsg('No account found under this email. Try registering a new VIP account.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!registerName || !registerEmail || !registerPhone || !registerPassword) {
      setErrorMsg('Kindly complete all registration details.');
      return;
    }

    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === registerEmail.toLowerCase().trim())) {
      setErrorMsg('This email is already registered with our Atelier.');
      return;
    }

    const newUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      fullName: registerName,
      email: registerEmail.trim(),
      phone: registerPhone,
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('kee_registered_users', JSON.stringify(updatedUsers));

    onLoginUser(newUser);
    setSuccessMsg('Thank you for registering! Your KEE! VIP membership is now active.');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!forgotEmail) {
      setErrorMsg('Please specify your registered email.');
      return;
    }

    // Simulate reset link dispatch
    setSuccessMsg(`Secure recovery guidelines have been dispatched to ${forgotEmail}. Please review your inbox.`);
    setForgotEmail('');
  };

  // Curate user's wishlist products
  const wishlistedProducts = productsList.filter(p => wishlist.includes(p.id));

  // Curate user's specific orders
  const customerOrders = ordersList.filter(
    o => o.customer.email.toLowerCase() === currentUser?.email.toLowerCase()
  );

  // Tracking Stage Map
  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Dispatched': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return 0;
      default: return 1;
    }
  };

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* 1. NO USER: AUTHENTICATION INTERFACES */}
      {!currentUser ? (
        <div className="max-w-md mx-auto bg-white border border-neutral-200/80 p-8 shadow-xs">
          
          <div className="text-center space-y-2 mb-8">
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-800 px-3 py-1 uppercase tracking-[0.25em] font-bold">
              Atelier Private Access
            </span>
            <h2 className="font-sans text-2xl font-black tracking-widest uppercase text-neutral-900 pt-2">
              MY KEE<span className="text-[#D4AF37]">!</span> PORTAL
            </h2>
            <p className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase font-semibold">
              ELEGANCE IN EVERY THREAD
            </p>
          </div>

          {/* Feedback messages */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 p-3 text-xs mb-5 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 text-xs mb-5 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LOGIN VIEW */}
          {authView === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. isabella@example.com"
                    className="w-full p-3 bg-[#FAF9F6] border border-neutral-200 focus:border-neutral-950 focus:bg-white text-xs text-neutral-900 outline-hidden pl-10"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                    Secret Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthView('forgot')}
                    className="text-[9px] uppercase tracking-wider text-amber-800 font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-3 bg-[#FAF9F6] border border-neutral-200 focus:border-neutral-950 focus:bg-white text-xs text-neutral-900 outline-hidden pl-10"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-950 hover:bg-amber-900 text-[#FAF9F6] text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Enter Atelier Account
              </button>

              <div className="pt-4 text-center border-t border-neutral-100">
                <p className="text-xs text-neutral-500">
                  New to our luxury universe?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('register')}
                    className="text-amber-800 font-bold hover:underline"
                  >
                    Register VIP Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* REGISTER VIEW */}
          {authView === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Lady Isabella Montgomery"
                    className="w-full p-3 bg-[#FAF9F6] border border-neutral-200 focus:border-neutral-950 focus:bg-white text-xs text-neutral-900 outline-hidden pl-10"
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="isabella@example.com"
                    className="w-full p-3 bg-[#FAF9F6] border border-neutral-200 focus:border-neutral-950 focus:bg-white text-xs text-neutral-900 outline-hidden pl-10"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="+91 99999 99999"
                    className="w-full p-3 bg-[#FAF9F6] border border-neutral-200 focus:border-neutral-950 focus:bg-white text-xs text-neutral-900 outline-hidden pl-10"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">
                  Secret Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Create Secure Password"
                    className="w-full p-3 bg-[#FAF9F6] border border-neutral-200 focus:border-neutral-950 focus:bg-white text-xs text-neutral-900 outline-hidden pl-10"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 pb-2">
                <input type="checkbox" id="vip_consent" defaultChecked className="accent-amber-500" />
                <label htmlFor="vip_consent" className="text-[10px] text-neutral-500">
                  I consent to private previews & luxury updates.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-950 hover:bg-amber-900 text-[#FAF9F6] text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Activate VIP Account
              </button>

              <div className="pt-4 text-center border-t border-neutral-100">
                <p className="text-xs text-neutral-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="text-amber-800 font-bold hover:underline"
                  >
                    Enter Portal
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {authView === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                Input your registered email below, and our Atelier systems will dispatch encrypted instructions to reconstruct your secret password.
              </p>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="isabella@example.com"
                    className="w-full p-3 bg-[#FAF9F6] border border-neutral-200 focus:border-neutral-950 focus:bg-white text-xs text-neutral-900 outline-hidden pl-10"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-950 hover:bg-amber-900 text-[#FAF9F6] text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Send Recovery guidelines
              </button>

              <div className="pt-4 text-center border-t border-neutral-100">
                <p className="text-xs text-neutral-500">
                  Remember password?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="text-amber-800 font-bold hover:underline"
                  >
                    Return to Login
                  </button>
                </p>
              </div>
            </form>
          )}

        </div>
      ) : (
        
        // 2. LOGGED IN CUSTOMER DASHBOARD
        <div className="space-y-8">
          
          {/* Welcome Dashboard Header */}
          <div className="bg-white border border-neutral-200/60 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-800 px-3 py-1 uppercase tracking-[0.2em] font-bold">
                  Sovereign Client Club
                </span>
                <span className="text-[10px] bg-neutral-950 text-white px-2.5 py-1 uppercase tracking-[0.1em] font-bold">
                  VIP Elite
                </span>
              </div>
              <h1 className="font-sans text-2xl sm:text-3xl font-black uppercase text-neutral-900 tracking-wider">
                Welcome, {currentUser.fullName}
              </h1>
              <p className="text-xs text-neutral-400 font-light">
                Manage your orders, dispatch tracks, couture wishlist, and VIP concierge profile settings.
              </p>
            </div>
            <button
              onClick={onLogoutUser}
              className="px-5 py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-red-700 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Of Portal</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-100 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/5 text-amber-800 flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Total Purchases</p>
                <p className="text-2xl font-semibold mt-0.5">{customerOrders.length} Orders</p>
              </div>
            </div>
            <div className="bg-white border border-neutral-100 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-50 text-neutral-800 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Wishlist Size</p>
                <p className="text-2xl font-semibold mt-0.5">{wishlistedProducts.length} Items</p>
              </div>
            </div>
            <div className="bg-white border border-neutral-100 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/5 text-emerald-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">VIP Privileges</p>
                <p className="text-xs font-bold text-emerald-800 mt-1 uppercase">Active • Sizing Customisable</p>
              </div>
            </div>
          </div>

          {/* Main Dashboard layout: Tabs Navigation */}
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
              className={`py-3.5 px-6 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'orders' ? 'border-amber-600 text-amber-900 bg-white' : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Package className="w-4 h-4" /> My Orders & Tracking ({customerOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`py-3.5 px-6 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'wishlist' ? 'border-amber-600 text-amber-900 bg-white' : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Heart className="w-4 h-4" /> My Curated Wishlist ({wishlistedProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3.5 px-6 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'profile' ? 'border-amber-600 text-amber-900 bg-white' : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <User className="w-4 h-4" /> Atelier VIP Card
            </button>
          </div>

          {/* Content Block */}
          <div className="bg-white border border-neutral-200/50 p-6 sm:p-8">
            
            {/* TAB A: MY ORDERS & LIVE TRACKING */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                
                {/* Visualizing specific order details & live tracking bar */}
                {selectedOrder ? (
                  <div className="space-y-8 animate-fadeIn">
                    
                    {/* Return to orders list button */}
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-xs text-neutral-500 hover:text-black uppercase tracking-widest font-bold flex items-center gap-1"
                    >
                      ← Back to All Orders
                    </button>

                    <div className="border border-amber-600/15 bg-[#FAF9F6] p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Order Reference Identifier</p>
                          <h3 className="font-mono text-lg font-black text-amber-900">{selectedOrder.orderId}</h3>
                          <p className="text-xs text-neutral-500 font-light mt-0.5">Placed on {new Date(selectedOrder.date).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider font-bold">Status:</span>
                          <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold ${
                            selectedOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            selectedOrder.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                            selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {selectedOrder.status}
                          </span>
                        </div>
                      </div>

                      {/* LIVE VISUAL TRACKING PROGRESS BAR */}
                      <div className="pt-6 border-t border-neutral-200/50">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-6">
                          Live Dispatch Timeline tracking
                        </p>

                        {selectedOrder.status === 'Cancelled' ? (
                          <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>This order has been cancelled. If this is a mistake, contact our Atelier Concierge.</span>
                          </div>
                        ) : (
                          <div className="relative">
                            
                            {/* Connector line background */}
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 -translate-y-1/2 z-0" />
                            
                            {/* Connector line active filler */}
                            <div 
                              className="absolute top-1/2 left-0 h-1 bg-amber-600 -translate-y-1/2 z-0 transition-all duration-1000"
                              style={{ 
                                width: selectedOrder.status === 'Delivered' ? '100%' :
                                       selectedOrder.status === 'Dispatched' ? '50%' :
                                       '15%'
                              }}
                            />

                            <div className="relative z-10 flex justify-between">
                              {/* Step 1: Registered */}
                              <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                                  getStatusStep(selectedOrder.status) >= 1
                                    ? 'bg-amber-600 border-amber-600 text-white'
                                    : 'bg-white border-neutral-300 text-neutral-400'
                                }`}>
                                  1
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-bold mt-2 text-neutral-800 block">Ordered</span>
                                <span className="text-[8px] text-neutral-400 max-w-[80px] hidden sm:block">Awaiting validation</span>
                              </div>

                              {/* Step 2: Dispatched */}
                              <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                                  getStatusStep(selectedOrder.status) >= 2
                                    ? 'bg-amber-600 border-amber-600 text-white'
                                    : 'bg-white border-neutral-300 text-neutral-400'
                                }`}>
                                  2
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-bold mt-2 text-neutral-800 block">Dispatched</span>
                                <span className="text-[8px] text-neutral-400 max-w-[80px] hidden sm:block">In transit with Blue Dart</span>
                              </div>

                              {/* Step 3: Delivered */}
                              <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                                  getStatusStep(selectedOrder.status) >= 3
                                    ? 'bg-amber-600 border-amber-600 text-white'
                                    : 'bg-white border-neutral-300 text-neutral-400'
                                }`}>
                                  3
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-bold mt-2 text-neutral-800 block">Delivered</span>
                                <span className="text-[8px] text-neutral-400 max-w-[80px] hidden sm:block">Received beautifully</span>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>

                      {/* AWB Courier Details if available */}
                      {selectedOrder.status !== 'Cancelled' && (
                        <div className="mt-4 p-4 bg-white border border-neutral-200/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold">Courier Logistics Partner</p>
                            <p className="font-bold text-neutral-800 flex items-center gap-1 mt-0.5">
                              <Truck className="w-4 h-4 text-amber-700" />
                              <span>{selectedOrder.trackingCourier || 'Blue Dart Express (VIP Cargo)'}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold">Consignment Airway Bill (AWB)</p>
                            <p className="font-mono font-bold text-neutral-800 mt-0.5 flex items-center justify-between">
                              <span className="select-all">{selectedOrder.trackingAWB || 'BD-VIP-KEE202607'}</span>
                              <span className="text-[9px] bg-amber-500/10 text-amber-900 border border-amber-100 px-1.5 py-0.5 rounded-full uppercase">
                                Real-time Tracked
                              </span>
                            </p>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Financial details & items list in order */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Items */}
                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="font-sans text-xs uppercase tracking-widest text-neutral-900 font-bold border-b border-neutral-100 pb-2">
                          Ordered Masterpieces ({selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)})
                        </h4>
                        
                        <div className="divide-y divide-neutral-100">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 py-3 first:pt-0">
                              <div className="w-12 aspect-[3/4] bg-[#FAF9F6] border border-neutral-100 overflow-hidden shrink-0">
                                <img src={item.product.images[0]} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 text-xs">
                                <h5 className="font-bold text-neutral-900 hover:underline cursor-pointer" onClick={() => onSelectProduct(item.product)}>
                                  {item.product.name}
                                </h5>
                                <p className="text-[10px] text-neutral-500 mt-0.5">
                                  Size: <strong>{item.selectedSize}</strong> • Color: <strong>{item.selectedColor.name}</strong> • Qty: <strong>{item.quantity}</strong>
                                </p>
                                <p className="font-bold text-neutral-900 mt-1">{formattedPrice(item.product.price * item.quantity)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ship details & pricing */}
                      <div className="lg:col-span-5 bg-[#FAF9F6] border border-neutral-200/50 p-6 space-y-6 text-xs">
                        
                        <div className="space-y-3">
                          <h4 className="font-sans text-xs uppercase tracking-widest text-neutral-900 font-bold border-b border-neutral-100 pb-2 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-amber-700" />
                            <span>Delivery Destination</span>
                          </h4>
                          <div className="space-y-1 font-light text-neutral-600 leading-relaxed">
                            <p className="font-bold text-neutral-950">{selectedOrder.customer.fullName}</p>
                            <p>{selectedOrder.customer.address}</p>
                            <p>{selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.zipCode}</p>
                            <p className="pt-1 text-[10px]">📞 {selectedOrder.customer.phone} | ✉️ {selectedOrder.customer.email}</p>
                          </div>
                        </div>

                        <div className="space-y-2.5 pt-4 border-t border-neutral-200/50">
                          <h4 className="font-sans text-xs uppercase tracking-widest text-neutral-900 font-bold">
                            Financial Summary
                          </h4>
                          <div className="flex justify-between text-neutral-500">
                            <span>Subtotal:</span>
                            <span className="font-semibold text-neutral-900">{formattedPrice(selectedOrder.pricing.subtotal)}</span>
                          </div>
                          {selectedOrder.pricing.discountAmount > 0 && (
                            <div className="flex justify-between text-red-700 bg-red-50 p-1 px-1.5 font-medium">
                              <span>Promo applied ({selectedOrder.pricing.appliedCoupon}):</span>
                              <span>-{formattedPrice(selectedOrder.pricing.discountAmount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-neutral-500">
                            <span>VIP Shipping:</span>
                            <span className="font-semibold text-emerald-800">
                              {selectedOrder.pricing.deliveryCharge === 0 ? 'Complimentary' : formattedPrice(selectedOrder.pricing.deliveryCharge)}
                            </span>
                          </div>
                          <div className="flex justify-between text-neutral-950 font-bold pt-2 border-t border-neutral-200 text-sm">
                            <span>Grand Total Amount:</span>
                            <span className="text-amber-900 font-black">{formattedPrice(selectedOrder.pricing.grandTotal)}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-white border border-neutral-200 space-y-1">
                          <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Verified Payment via</p>
                          <p className="font-bold text-neutral-800 uppercase tracking-wider">
                            {selectedOrder.payment.method === 'upi' ? `Manual UPI Reference` : selectedOrder.payment.method}
                          </p>
                          {selectedOrder.payment.upiRefNo && (
                            <p className="font-mono text-[10px] text-neutral-500 truncate">Ref: {selectedOrder.payment.upiRefNo}</p>
                          )}
                        </div>

                      </div>

                    </div>

                  </div>
                ) : (
                  
                  // Orders list view
                  <div className="space-y-4">
                    {customerOrders.length === 0 ? (
                      <div className="text-center py-16 space-y-4">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                          <ShoppingBag className="w-7 h-7" />
                        </div>
                        <h3 className="font-sans text-sm uppercase tracking-widest font-bold text-neutral-800">
                          No orders captured yet
                        </h3>
                        <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                          Your administrative client archive has no active acquisitions. Explore our limited series capsule drop to place your first KEE! order.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-neutral-100">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-neutral-950 text-white uppercase tracking-wider text-[10px]">
                              <th className="p-4 font-semibold">Order ID</th>
                              <th className="p-4 font-semibold">Acquisitions Date</th>
                              <th className="p-4 font-semibold">Total Cost</th>
                              <th className="p-4 font-semibold">Logistics Status</th>
                              <th className="p-4 font-semibold text-right">Concierge Trace</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {customerOrders.map((order) => (
                              <tr key={order.orderId} className="hover:bg-neutral-50/60 transition-colors">
                                <td className="p-4 font-mono font-bold text-amber-800">{order.orderId}</td>
                                <td className="p-4 text-neutral-500">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-neutral-900">{formattedPrice(order.pricing.grandTotal)}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-full ${
                                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                                    order.status === 'Dispatched' ? 'bg-blue-50 text-blue-800 border border-blue-100' :
                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-800 border border-red-100' :
                                    'bg-amber-50 text-amber-800 border border-amber-100'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-3 py-1 bg-neutral-900 hover:bg-amber-800 text-white text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 ml-auto"
                                  >
                                    <span>Track</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                )}

              </div>
            )}

            {/* TAB B: CURATED WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                      <Heart className="w-6 h-6 text-neutral-300" />
                    </div>
                    <h3 className="font-sans text-sm uppercase tracking-widest font-bold text-neutral-800">
                      Curated Wishlist is Empty
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                      Tap the heart icons while browsing our collection to accumulate and catalog your desired masterpieces.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {wishlistedProducts.map((product) => {
                      const isSoldOut = product.stock === 0;
                      return (
                        <div key={product.id} className="group flex flex-col relative border border-neutral-100 bg-[#FAF9F6]">
                          
                          {/* Image Box */}
                          <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                              {isSoldOut && (
                                <span className="text-[8px] bg-neutral-950 text-white font-bold tracking-widest px-2 py-0.5 uppercase">
                                  Sold Out
                                </span>
                              )}
                              {!isSoldOut && product.stock <= 3 && (
                                <span className="text-[8px] bg-red-600 text-white font-bold tracking-widest px-2 py-0.5 uppercase">
                                  Low Stock
                                </span>
                              )}
                            </div>

                            {/* Remove Heart Trigger */}
                            <button
                              onClick={() => onToggleWishlist(product.id)}
                              className="absolute top-2 right-2 p-1.5 bg-white text-red-600 shadow-xs rounded-full hover:scale-105 transition-transform"
                              title="Remove from Wishlist"
                            >
                              <Heart className="w-4 h-4 fill-red-600 text-red-600" />
                            </button>
                          </div>

                          {/* Details */}
                          <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                            <div onClick={() => onSelectProduct(product)} className="cursor-pointer space-y-1">
                              <p className="text-[9px] uppercase tracking-widest font-semibold text-neutral-400">{product.collection}</p>
                              <h4 className="font-sans text-xs font-bold text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-1">{product.name}</h4>
                              <p className="font-bold text-xs text-neutral-950">{formattedPrice(product.price)}</p>
                            </div>

                            {/* Action buy now/add */}
                            {!isSoldOut && (
                              <div className="pt-2.5 flex gap-1.5 mt-auto">
                                <button
                                  onClick={() => onAddToCart(product, 'M', product.colors[0], 1, true)}
                                  className="flex-1 py-1.5 bg-white border border-neutral-950 hover:bg-neutral-50 text-[9px] uppercase tracking-widest font-bold text-black"
                                >
                                  + Cart
                                </button>
                                <button
                                  onClick={() => onBuyNow(product, 'M')}
                                  className="flex-1 py-1.5 bg-[#D4AF37] hover:bg-amber-500 text-[9px] uppercase tracking-widest font-black text-neutral-950"
                                >
                                  Buy
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB C: VIP PROFILE CARD */}
            {activeTab === 'profile' && (
              <div className="max-w-md mx-auto border border-neutral-200/60 p-6 space-y-6 text-xs bg-[#FAF9F6]">
                <div className="text-center pb-4 border-b border-neutral-200">
                  <h4 className="font-sans text-sm uppercase tracking-[0.25em] text-[#D4AF37] font-black">
                    KEE! ROYAL CLUB
                  </h4>
                  <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-0.5">VIP CLIENT ARCHIVE ID CARD</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-neutral-200">
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Client Name:</span>
                    <span className="font-bold text-neutral-900 text-right">{currentUser.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-neutral-200">
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Atelier Email:</span>
                    <span className="font-bold text-neutral-900 text-right select-all">{currentUser.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-neutral-200">
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px]">VIP Contact No:</span>
                    <span className="font-bold text-neutral-900 text-right">{currentUser.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Status Class:</span>
                    <span className="font-black text-amber-800 uppercase tracking-widest bg-amber-500/10 border border-amber-300 px-2 py-0.5 text-[9px]">
                      Sovereign Sizing Privileged
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-neutral-200 space-y-1.5">
                  <p className="font-bold text-[10px] uppercase text-neutral-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Exclusive Concierge Support</span>
                  </p>
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-light">
                    As an official VIP club client, your shipping is permanently complimentary on purchases exceeding ₹1,500. You may consult with our head designer via WhatsApp for tailor-made fit adjustments to any Raw Silk Kurtis or Co-ord sets.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
