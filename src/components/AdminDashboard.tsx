import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Tag,
  Settings,
  Layers,
  Star,
  MessageSquare,
  LogOut,
  Lock,
  Unlock,
  Save,
  Undo,
  Eye,
  Check,
  X,
  PlusCircle,
  TrendingUp,
  Sliders,
  DollarSign,
  AlertCircle,
  Globe,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Package,
  Truck
} from 'lucide-react';
import { Product, ColorOption, Review, Banner, Order } from '../types';

interface AdminDashboardProps {
  productsList: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  bannersList: Banner[];
  onUpdateBanners: (banners: Banner[]) => void;
  onClose: () => void;
  ordersList: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], awb?: string, courier?: string) => void;
  whatsappNumber: string;
  onUpdateWhatsappNumber: (phone: string) => void;
}

const PREMIUM_STOCK_IMAGES = [
  { name: 'Gilded Amber Ivory Slub', url: '/src/assets/images/raw_silk_maxi_1783959109466.jpg' },
  { name: 'Imperial Emerald Slub', url: '/src/assets/images/raw_silk_coord_1783959093525.jpg' },
  { name: 'Magenta Zardosi Catalog', url: '/src/assets/images/raw_silk_kurti_1783959076424.jpg' },
  { name: 'Royal Gold Gown Campaign', url: '/src/assets/images/raw_silk_hero_1783959059618.jpg' },
  { name: 'Unsplash Velvet Rust', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Unsplash Amber Drapery', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Unsplash Gold Silk Sheen', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80' }
];

export default function AdminDashboard({
  productsList,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  bannersList,
  onUpdateBanners,
  onClose,
  ordersList,
  onUpdateOrderStatus,
  whatsappNumber,
  onUpdateWhatsappNumber,
}: AdminDashboardProps) {
  // Authentication State
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('kee_admin_auth') === 'true';
  });
  const [authError, setAuthError] = useState('');

  // Dashboard Navigation
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'banners' | 'reviews' | 'settings'>('products');

  // Order Management States
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<Order | null>(null);
  const [orderTrackingAWB, setOrderTrackingAWB] = useState('');
  const [orderTrackingCourier, setOrderTrackingCourier] = useState('');
  const [adminOrderFilter, setAdminOrderFilter] = useState<'All' | 'Pending' | 'Dispatched' | 'Delivered' | 'Cancelled'>('All');

  // Website custom branding states
  const [whatsappInput, setWhatsappInput] = useState(whatsappNumber || '919999999999');

  React.useEffect(() => {
    setWhatsappInput(whatsappNumber || '919999999999');
  }, [whatsappNumber]);

  // Product CRUD States
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: '',
    name: '',
    tagline: '',
    collection: 'Kurtis',
    price: 3999,
    originalPrice: undefined,
    images: [''],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Imperial Gold', value: '#D4AF37' }],
    fabric: '100% Pure Raw Silk',
    washCare: 'Dry Clean Only. Hand press under damp cloth on low heat.',
    stock: 10,
    description: '',
    isNew: true,
    isBestSeller: false,
    rating: 5.0,
    reviews: []
  });

  // Color option form helpers
  const [newColorName, setNewColorName] = useState('');
  const [newColorValue, setNewColorValue] = useState('#D4AF37');

  // Banner CRUD States
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    id: '',
    title: '',
    subtitle: '',
    image: '',
    ctaText: 'Explore',
    ctaView: 'shop',
    ctaArg: '',
    isActive: true
  });

  // Domain Config State (Persisted in localStorage for domain mapping demo)
  const [domainConfig, setDomainConfig] = useState(() => {
    return localStorage.getItem('kee_domain_config') || 'keeofficial.in';
  });
  const [domainStatus, setDomainStatus] = useState('Connected & Active');

  // Razorpay Gateway Settings
  const [razorpayKey, setRazorpayKey] = useState(() => localStorage.getItem('kee_razorpay_key') || 'rzp_live_KeeAtelier2026');
  const [isRazorpaySandbox, setIsRazorpaySandbox] = useState(true);

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'kee-atelier-2026') {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('kee_admin_auth', 'true');
    } else {
      setAuthError('Incorrect Atelier Passcode. Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kee_admin_auth');
  };

  // Product Form Handlers
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.id || !productForm.name || !productForm.price) {
      window.showToast?.('Please fill out Product ID, Name and Price.', 'warning');
      return;
    }

    const submission: Product = {
      id: productForm.id,
      name: productForm.name,
      tagline: productForm.tagline || '',
      collection: productForm.collection as any,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      images: productForm.images?.filter(url => url.trim() !== '') || [],
      sizes: productForm.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: productForm.colors || [],
      fabric: productForm.fabric || '100% Premium Raw Silk',
      washCare: productForm.washCare || 'Dry Clean Only',
      stock: Number(productForm.stock),
      description: productForm.description || '',
      isNew: !!productForm.isNew,
      isBestSeller: !!productForm.isBestSeller,
      rating: productForm.rating || 5.0,
      reviews: productForm.reviews || []
    };

    if (editingProductId) {
      onUpdateProduct(submission);
    } else {
      // Check duplicate ID
      if (productsList.some(p => p.id === submission.id)) {
        window.showToast?.('A product with this ID already exists. Please use a unique SKU.', 'error');
        return;
      }
      onAddProduct(submission);
    }

    resetProductForm();
  };

  const startEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({ ...product });
    setIsEditingProduct(true);
  };

  const handleDeleteProductClick = (productId: string) => {
    if (window.confirm(`Are you absolutely sure you want to retire product ${productId}? This action cannot be undone.`)) {
      onDeleteProduct(productId);
    }
  };

  const resetProductForm = () => {
    setIsEditingProduct(false);
    setEditingProductId(null);
    setProductForm({
      id: '',
      name: '',
      tagline: '',
      collection: 'Kurtis',
      price: 3999,
      originalPrice: undefined,
      images: [''],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'Imperial Gold', value: '#D4AF37' }],
      fabric: '100% Pure Raw Silk',
      washCare: 'Dry Clean Only. Hand press under damp cloth on low heat.',
      stock: 10,
      description: '',
      isNew: true,
      isBestSeller: false,
      rating: 5.0,
      reviews: []
    });
  };

  // Image Array helpers
  const handleAddImageUrlField = () => {
    setProductForm(prev => ({
      ...prev,
      images: [...(prev.images || []), '']
    }));
  };

  const handleImageUrlChange = (index: number, val: string) => {
    const updatedImages = [...(productForm.images || [])];
    updatedImages[index] = val;
    setProductForm(prev => ({ ...prev, images: updatedImages }));
  };

  const handleSelectStockImage = (index: number, url: string) => {
    const updatedImages = [...(productForm.images || [])];
    updatedImages[index] = url;
    setProductForm(prev => ({ ...prev, images: updatedImages }));
  };

  const handleRemoveImageUrlField = (index: number) => {
    if ((productForm.images || []).length <= 1) return;
    const updatedImages = (productForm.images || []).filter((_, i) => i !== index);
    setProductForm(prev => ({ ...prev, images: updatedImages }));
  };

  // Color helper functions
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const updatedColors = [...(productForm.colors || []), { name: newColorName, value: newColorValue }];
    setProductForm(prev => ({ ...prev, colors: updatedColors }));
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    const updatedColors = (productForm.colors || []).filter((_, i) => i !== index);
    setProductForm(prev => ({ ...prev, colors: updatedColors }));
  };

  const handleToggleSize = (size: any) => {
    const currentSizes = productForm.sizes || [];
    let updatedSizes;
    if (currentSizes.includes(size)) {
      updatedSizes = currentSizes.filter(s => s !== size);
    } else {
      updatedSizes = [...currentSizes, size];
    }
    setProductForm(prev => ({ ...prev, sizes: updatedSizes as any }));
  };

  // Banner Handlers
  const handleBannerSubmit = (banner: Banner) => {
    const updatedBanners = bannersList.map(b => b.id === banner.id ? banner : b);
    onUpdateBanners(updatedBanners);
    setEditingBannerId(null);
    window.showToast?.('Banner updated successfully!', 'success');
  };

  const handleToggleBannerActive = (bannerId: string) => {
    const updated = bannersList.map(b => b.id === bannerId ? { ...b, isActive: !b.isActive } : b);
    onUpdateBanners(updated);
  };

  // Review Moderator Handlers
  const handleDeleteReview = (productId: string, reviewId: string) => {
    if (window.confirm('Delete this customer review permanently?')) {
      const prod = productsList.find(p => p.id === productId);
      if (prod) {
        const updatedReviews = prod.reviews.filter(r => r.id !== reviewId);
        // Recalculate average rating
        let newAvg = 5.0;
        if (updatedReviews.length > 0) {
          const total = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
          newAvg = parseFloat((total / updatedReviews.length).toFixed(1));
        }
        onUpdateProduct({
          ...prod,
          reviews: updatedReviews,
          rating: newAvg
        });
        window.showToast?.('Review deleted successfully.', 'info');
      }
    }
  };

  const handleSaveDomain = () => {
    localStorage.setItem('kee_domain_config', domainConfig);
    window.showToast?.(`Domain settings for ${domainConfig} updated successfully!`, 'success');
  };

  const handleSaveRazorpay = () => {
    localStorage.setItem('kee_razorpay_key', razorpayKey);
    window.showToast?.('Razorpay credentials stored successfully.', 'success');
  };

  // Aggregate all reviews across products for easy moderation
  const aggregatedReviews: { product: Product; review: Review }[] = [];
  productsList.forEach(p => {
    p.reviews.forEach(r => {
      aggregatedReviews.push({ product: p, review: r });
    });
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 pt-6 pb-24 px-4 sm:px-6 lg:px-8">
      {/* 1. LOCK SCREEN */}
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-neutral-900 border border-amber-900/40 p-8 max-w-md w-full shadow-2xl relative text-center flex flex-col items-center"
            >
              <div className="w-14 h-14 bg-amber-950/40 border border-amber-500/30 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-amber-500 animate-pulse" />
              </div>
              <img src="/assets/logo.jpeg" alt="KEE! Brand" width="240" height="64" referrerPolicy="no-referrer" className="h-16 w-auto object-contain mb-4" />
              <p className="text-[9px] tracking-[0.35em] text-amber-500 uppercase font-bold mb-8">
                Secured Administrative Vault
              </p>

              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div>
                  <label className="block text-left text-[9px] uppercase tracking-widest font-bold text-neutral-400 mb-2">
                    Access Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Private Atelier Passcode"
                    className="w-full bg-neutral-950 border border-neutral-800 text-sm text-center tracking-[0.2em] font-semibold text-white focus:outline-hidden focus:border-amber-500 py-3 rounded-none placeholder:text-neutral-700 placeholder:tracking-normal"
                  />
                  <p className="text-[10px] text-neutral-500 text-left mt-2 italic">
                    Hint: Use standard developer code <code className="text-amber-500 font-mono bg-black px-1 py-0.5 rounded-xs">kee-atelier-2026</code> to log in.
                  </p>
                </div>

                {authError && (
                  <div className="text-xs text-red-500 font-medium tracking-wide flex items-center gap-1 bg-red-950/20 p-2 border border-red-900/30">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#D4AF37] hover:bg-amber-500 text-neutral-950 text-xs uppercase tracking-widest font-black transition-colors"
                  >
                    Authenticate
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN ADMIN BOARD (Visible once authenticated) */}
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Block */}
          <div className="bg-white border border-neutral-200/60 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="text-center md:text-left">
              <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-800 px-3 py-1 uppercase tracking-[0.2em] font-bold">
                Luxury Administration Portal
              </span>
              <div className="flex items-center gap-3.5 mt-3">
                <img src="/assets/logo.jpeg" alt="KEE! Brand" width="160" height="40" referrerPolicy="no-referrer" className="h-10 w-auto object-contain" />
                <span className="font-sans text-lg font-black tracking-widest text-neutral-900 uppercase">ATELIER HUB</span>
              </div>
              <p className="text-xs text-neutral-400 font-light mt-1">
                Curate products, manage premium hero campaigns, moderate customer reviews, and coordinate domains.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] uppercase tracking-widest font-bold flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-amber-500" /> View Website
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-black text-[11px] uppercase tracking-widest font-semibold flex items-center gap-1.5"
                title="Secure logout"
              >
                <LogOut className="w-4 h-4 text-red-500" /> Exit Portal
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-100 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center text-neutral-800">
                <Layers className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Total Catalog</p>
                <p className="text-2xl font-semibold mt-0.5">{productsList.length} Products</p>
              </div>
            </div>
            <div className="bg-white border border-neutral-100 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 flex items-center justify-center text-red-800">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Sold Out Status</p>
                <p className="text-2xl font-semibold mt-0.5 text-red-700">
                  {productsList.filter(p => p.stock === 0).length} Ensembles
                </p>
              </div>
            </div>
            <div className="bg-white border border-neutral-100 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center text-emerald-800">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Total Orders</p>
                <p className="text-2xl font-semibold mt-0.5 text-neutral-900">
                  {ordersList.length} Acquisitions
                </p>
              </div>
            </div>
            <div className="bg-white border border-neutral-100 p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 flex items-center justify-center text-blue-800">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Custom Domain</p>
                <p className="text-sm font-bold mt-1 text-emerald-600 truncate">{domainConfig || 'keeofficial.in'}</p>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => { setActiveTab('products'); resetProductForm(); }}
              className={`py-3 px-6 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'products' ? 'border-amber-600 text-amber-900 bg-white' : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Sliders className="w-4 h-4" /> Products Catalog ({productsList.length})
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setSelectedAdminOrder(null); }}
              className={`py-3 px-6 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'orders' ? 'border-amber-600 text-amber-900 bg-white' : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Package className="w-4 h-4" /> Customer Orders ({ordersList.length})
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`py-3 px-6 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'banners' ? 'border-amber-600 text-amber-900 bg-white' : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Banners Campaign
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-6 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'reviews' ? 'border-amber-600 text-amber-900 bg-white' : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Star className="w-4 h-4" /> Customer Reviews ({aggregatedReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 px-6 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'settings' ? 'border-amber-600 text-amber-900 bg-white' : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Settings className="w-4 h-4" /> Website Settings
            </button>
          </div>

          {/* Tab View Contents */}
          <div className="bg-white border border-neutral-200/50 p-6 sm:p-8 shadow-xs">
            
            {/* TAB A: PRODUCTS ATELIER */}
            {activeTab === 'products' && (
              <div className="space-y-10">
                
                {/* Form Toggle button */}
                <div className="flex justify-between items-center">
                  <h3 className="font-sans text-lg uppercase tracking-wider font-semibold">
                    {isEditingProduct ? (editingProductId ? '✏️ Edit Luxury Ensemble' : '✨ Add New Luxury Ensemble') : '⚜️ Product Masterlist'}
                  </h3>
                  {!isEditingProduct && (
                    <button
                      onClick={() => setIsEditingProduct(true)}
                      className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-neutral-950 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Premium Ensemble
                    </button>
                  )}
                </div>

                {/* Form layout (visible when editing/adding) */}
                {isEditingProduct && (
                  <form onSubmit={handleProductSubmit} className="bg-[#FAF9F6] border border-neutral-200/80 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Product SKU ID */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                          SKU ID (e.g. KEE-RS07) *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={!!editingProductId}
                          value={productForm.id}
                          onChange={(e) => setProductForm(prev => ({ ...prev, id: e.target.value.toUpperCase() }))}
                          placeholder="Unique ID SKU"
                          className="w-full bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden focus:border-amber-600 disabled:bg-neutral-100 text-neutral-900"
                        />
                      </div>

                      {/* Name */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                          Masterpiece Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Royal Ivory Hand-Cut Raw Silk Tunic"
                          className="w-full bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden focus:border-amber-600 text-neutral-900"
                        />
                      </div>

                      {/* Tagline */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                          Elegant Tagline
                        </label>
                        <input
                          type="text"
                          value={productForm.tagline}
                          onChange={(e) => setProductForm(prev => ({ ...prev, tagline: e.target.value }))}
                          placeholder="Intricate handwoven gold zari motifs on slub silk"
                          className="w-full bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden focus:border-amber-600 text-neutral-900"
                        />
                      </div>

                      {/* Collection */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                          Collection Category *
                        </label>
                        <select
                          value={productForm.collection}
                          onChange={(e) => setProductForm(prev => ({ ...prev, collection: e.target.value as any }))}
                          className="w-full bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden focus:border-amber-600 text-neutral-900"
                        >
                          <option value="Kurtis">Kurtis</option>
                          <option value="Maxi Dresses">Maxi Dresses</option>
                          <option value="Co-ord Sets">Co-ord Sets</option>
                        </select>
                      </div>

                      {/* Price (INR) */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                          Luxury Price (INR) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400 text-xs font-semibold">₹</span>
                          <input
                            type="number"
                            required
                            min="0"
                            value={productForm.price || ''}
                            onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                            placeholder="4500"
                            className="w-full bg-white border border-neutral-200 p-2.5 pl-6 text-xs focus:outline-hidden focus:border-amber-600 text-neutral-900 font-bold"
                          />
                        </div>
                      </div>

                      {/* Original Price */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                          Original Price (Optional - for discount badge)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-400 text-xs">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={productForm.originalPrice || ''}
                            onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value ? Number(e.target.value) : undefined }))}
                            placeholder="5999"
                            className="w-full bg-white border border-neutral-200 p-2.5 pl-6 text-xs focus:outline-hidden focus:border-amber-600 text-neutral-950 font-light"
                          />
                        </div>
                      </div>

                      {/* Stock Inventory */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                          Stock Inventory (0 triggers SOLD OUT badge)
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={productForm.stock ?? 10}
                          onChange={(e) => setProductForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                          placeholder="10"
                          className="w-full bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden focus:border-amber-600 text-neutral-900 font-bold"
                        />
                      </div>

                    </div>

                    {/* Fabric and Washcare */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                          Fabric Details
                        </label>
                        <input
                          type="text"
                          value={productForm.fabric}
                          onChange={(e) => setProductForm(prev => ({ ...prev, fabric: e.target.value }))}
                          placeholder="100% Traditional Handloom Slub Raw Silk"
                          className="w-full bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden focus:border-amber-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                          Wash Care Instructions
                        </label>
                        <input
                          type="text"
                          value={productForm.washCare}
                          onChange={(e) => setProductForm(prev => ({ ...prev, washCare: e.target.value }))}
                          placeholder="Dry Clean Only. Cool iron inside out."
                          className="w-full bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden focus:border-amber-600"
                        />
                      </div>
                    </div>

                    {/* Multiple Images Upload Handler */}
                    <div className="border-t border-neutral-200 pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                          📷 Curate Multiple Product Images
                        </label>
                        <button
                          type="button"
                          onClick={handleAddImageUrlField}
                          className="text-[10px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 uppercase"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Add Another Image Slot
                        </button>
                      </div>

                      <div className="space-y-4">
                        {(productForm.images || []).map((imgUrl, idx) => (
                          <div key={idx} className="bg-white border border-neutral-200 p-4 space-y-3 shadow-2xs">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-neutral-400 font-bold font-mono">#{idx + 1}</span>
                              <input
                                type="text"
                                value={imgUrl}
                                onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                                placeholder="Paste image URL here"
                                className="flex-1 bg-neutral-50 border border-neutral-200 p-2 text-xs focus:outline-hidden focus:border-amber-600"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImageUrlField(idx)}
                                className="p-2 text-red-500 hover:bg-red-50"
                                title="Remove slot"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Luxury Stock Presets */}
                            <div>
                              <p className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 mb-1">
                                Quick Option: Choose a generated luxury fashion asset
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {PREMIUM_STOCK_IMAGES.map((preset) => (
                                  <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => handleSelectStockImage(idx, preset.url)}
                                    className={`text-[9px] px-2.5 py-1 border transition-all ${
                                      imgUrl === preset.url
                                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                                        : 'border-neutral-200 hover:border-neutral-400 text-neutral-600'
                                    }`}
                                  >
                                    {preset.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Preview thumbnail */}
                            {imgUrl && (
                              <div className="w-20 h-24 border border-neutral-200 overflow-hidden bg-neutral-100">
                                <img
                                  src={imgUrl}
                                  alt="Preview"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Colors curation */}
                    <div className="border-t border-neutral-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2">
                          🎨 Color Presets Available
                        </label>
                        <div className="bg-white border border-neutral-200 p-4 space-y-3">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={newColorName}
                              onChange={(e) => setNewColorName(e.target.value)}
                              placeholder="Color name (e.g. Royal Indigo)"
                              className="flex-1 bg-neutral-50 border border-neutral-200 p-2 text-xs focus:outline-hidden"
                            />
                            <input
                              type="color"
                              value={newColorValue}
                              onChange={(e) => setNewColorValue(e.target.value)}
                              className="w-9 h-9 border border-neutral-200 cursor-pointer p-0 bg-transparent"
                            />
                            <button
                              type="button"
                              onClick={handleAddColor}
                              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-bold"
                            >
                              Add
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {(productForm.colors || []).map((col, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 px-2 py-1 bg-neutral-50 border border-neutral-200 text-xs"
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                                  style={{ backgroundColor: col.value }}
                                />
                                <span>{col.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveColor(idx)}
                                  className="text-neutral-400 hover:text-red-500 font-bold ml-1"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Sizes selection */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2">
                          📐 Tailored Sizes (XS to XXL required)
                        </label>
                        <div className="bg-white border border-neutral-200 p-4 flex flex-wrap gap-2">
                          {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => {
                            const isSelected = (productForm.sizes || []).includes(sz);
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => handleToggleSize(sz)}
                                className={`w-10 h-10 border text-xs font-bold transition-all ${
                                  isSelected
                                    ? 'border-neutral-950 bg-neutral-950 text-white'
                                    : 'border-neutral-200 hover:border-neutral-400 text-neutral-400'
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Long Description */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                        Designer Narrative Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Crafted to celebrate raw textures..."
                        className="w-full bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden focus:border-amber-600 text-neutral-900 leading-relaxed"
                      />
                    </div>

                    {/* Quick Badges Toggles */}
                    <div className="flex flex-wrap gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={!!productForm.isNew}
                          onChange={(e) => setProductForm(prev => ({ ...prev, isNew: e.target.checked }))}
                          className="w-4 h-4 accent-amber-500"
                        />
                        <span>Feature "NEW" Badge</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={!!productForm.isBestSeller}
                          onChange={(e) => setProductForm(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                          className="w-4 h-4 accent-amber-500"
                        />
                        <span>Feature "BEST SELLER" Badge</span>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-neutral-200 pt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="px-5 py-2.5 border border-neutral-300 text-neutral-600 hover:bg-neutral-50 hover:text-black text-xs uppercase tracking-widest font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-neutral-950 text-white hover:bg-neutral-900 text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4 text-amber-500" /> Save Masterpiece
                      </button>
                    </div>
                  </form>
                )}

                {/* Table List of Existing Products */}
                <div className="overflow-x-auto border border-neutral-100">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-900 text-white uppercase tracking-wider text-[10px]">
                        <th className="p-4 font-semibold">Ensemble Code</th>
                        <th className="p-4 font-semibold">Thumbnail</th>
                        <th className="p-4 font-semibold">Product Name</th>
                        <th className="p-4 font-semibold">Collection</th>
                        <th className="p-4 font-semibold">Price</th>
                        <th className="p-4 font-semibold">Stock status</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {productsList.map((p) => {
                        const isSoldOut = p.stock === 0;
                        return (
                          <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="p-4 font-mono font-bold text-amber-800">{p.id}</td>
                            <td className="p-4">
                              <div className="w-10 h-12 bg-neutral-100 overflow-hidden border border-neutral-200">
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>
                            <td className="p-4 font-medium">
                              <div>
                                <p className="text-neutral-900 font-semibold">{p.name}</p>
                                <p className="text-[10px] text-neutral-400 italic font-light">{p.tagline}</p>
                              </div>
                            </td>
                            <td className="p-4 font-semibold uppercase text-[10px] tracking-wider">{p.collection}</td>
                            <td className="p-4 font-bold text-neutral-900">
                              ₹{p.price.toLocaleString('en-IN')}
                              {p.originalPrice && (
                                <span className="text-[10px] text-neutral-400 line-through block font-light">
                                  ₹{p.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              {isSoldOut ? (
                                <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 font-bold uppercase text-[9px] tracking-wider rounded-xs">
                                  Sold Out (0)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[9px] tracking-wider rounded-xs">
                                  In Stock ({p.stock})
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => startEditProduct(p)}
                                className="p-1.5 border border-neutral-200 hover:border-black hover:bg-white text-neutral-600 hover:text-black"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProductClick(p.id)}
                                className="p-1.5 border border-red-100 hover:border-red-500 hover:bg-red-50 text-red-500"
                                title="Retire / Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB B: CUSTOMER ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-sans text-lg uppercase tracking-wider font-semibold">📦 Client Acquisitions & Order Tracking</h3>
                  <p className="text-xs text-neutral-400">View customer purchases, verify manual UPI transaction details, and update Blue Dart delivery statuses.</p>
                </div>

                {selectedAdminOrder ? (
                  <div className="border border-neutral-200 p-6 bg-[#FAF9F6] space-y-6 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
                      <div>
                        <button
                          onClick={() => setSelectedAdminOrder(null)}
                          className="text-xs text-amber-800 font-bold uppercase tracking-widest hover:underline mb-2 block"
                        >
                          ← Back to Master Order list
                        </button>
                        <h4 className="font-mono text-base font-black text-neutral-900">
                          ORDER REF: {selectedAdminOrder.orderId}
                        </h4>
                        <p className="text-xs text-neutral-500">Placed on {new Date(selectedAdminOrder.date).toLocaleString()}</p>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold mb-1">Current Status</span>
                        <span className={`px-3 py-1 text-xs uppercase tracking-widest font-black ${
                          selectedAdminOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          selectedAdminOrder.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                          selectedAdminOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedAdminOrder.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left Column: Update Status Controls */}
                      <div className="lg:col-span-4 bg-white border border-neutral-200 p-5 space-y-4 shadow-2xs">
                        <h5 className="font-sans text-xs uppercase tracking-widest text-neutral-900 font-bold border-b border-neutral-100 pb-2">
                          Update Logistics Tracking
                        </h5>

                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                              Logistics Status
                            </label>
                            <select
                              value={selectedAdminOrder.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as Order['status'];
                                setSelectedAdminOrder({ ...selectedAdminOrder, status: newStatus });
                              }}
                              className="w-full bg-neutral-50 border border-neutral-200 p-2 text-xs font-bold text-neutral-900"
                            >
                              <option value="Pending">Pending Verification</option>
                              <option value="Dispatched">Dispatched / In Transit</option>
                              <option value="Delivered">Delivered Safely</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                              Logistics Courier Partner
                            </label>
                            <input
                              type="text"
                              value={orderTrackingCourier}
                              onChange={(e) => setOrderTrackingCourier(e.target.value)}
                              placeholder="e.g. Blue Dart Express"
                              className="w-full bg-neutral-50 border border-neutral-200 p-2 text-xs text-neutral-900"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                              Airway Bill Number (AWB)
                            </label>
                            <input
                              type="text"
                              value={orderTrackingAWB}
                              onChange={(e) => setOrderTrackingAWB(e.target.value)}
                              placeholder="e.g. BD-VIP-KEE2026..."
                              className="w-full bg-neutral-50 border border-neutral-200 p-2 text-xs font-mono text-neutral-900"
                            />
                          </div>

                          <button
                            onClick={() => {
                              onUpdateOrderStatus(
                                selectedAdminOrder.orderId,
                                selectedAdminOrder.status,
                                orderTrackingAWB,
                                orderTrackingCourier
                              );
                              // Refresh current selection
                              setSelectedAdminOrder({
                                ...selectedAdminOrder,
                                trackingAWB: orderTrackingAWB,
                                trackingCourier: orderTrackingCourier
                              });
                            }}
                            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
                          >
                            <Save className="w-4 h-4 text-amber-500" />
                            <span>Save Tracking Status</span>
                          </button>
                        </div>
                      </div>

                      {/* Middle Column: Client Address & Payment Proof */}
                      <div className="lg:col-span-4 bg-white border border-neutral-200 p-5 space-y-4 shadow-2xs text-xs">
                        <h5 className="font-sans text-xs uppercase tracking-widest text-neutral-900 font-bold border-b border-neutral-100 pb-2">
                          Client Shipping Card
                        </h5>
                        
                        <div className="space-y-1 text-neutral-700 leading-relaxed">
                          <p className="font-bold text-neutral-950 text-sm">{selectedAdminOrder.customer.fullName}</p>
                          <p>{selectedAdminOrder.customer.address}</p>
                          <p>{selectedAdminOrder.customer.city}, {selectedAdminOrder.customer.state} - {selectedAdminOrder.customer.zipCode}</p>
                          <p className="pt-2 font-semibold">📞 Phone: {selectedAdminOrder.customer.phone}</p>
                          <p className="font-semibold">✉️ Email: {selectedAdminOrder.customer.email}</p>
                        </div>

                        <div className="pt-4 border-t border-neutral-100 space-y-2">
                          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Payment verification</p>
                          <div className="p-3 bg-[#FAF9F6] border border-neutral-200">
                            <p className="font-semibold text-neutral-800">Method: <span className="uppercase text-neutral-900">{selectedAdminOrder.payment.method}</span></p>
                            {selectedAdminOrder.payment.method === 'upi' && (
                              <p className="font-mono text-[10px] text-amber-900 mt-1 select-all font-bold">
                                UPI Ref No: {selectedAdminOrder.payment.upiRefNo || 'None specified'}
                              </p>
                            )}
                            {selectedAdminOrder.payment.receiptName && (
                              <p className="text-[10px] text-neutral-500 italic mt-0.5">
                                Receipt Ref: {selectedAdminOrder.payment.receiptName}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Ordered Masterpieces & Total */}
                      <div className="lg:col-span-4 bg-white border border-neutral-200 p-5 space-y-4 shadow-2xs text-xs">
                        <h5 className="font-sans text-xs uppercase tracking-widest text-neutral-900 font-bold border-b border-neutral-100 pb-2">
                          Ensembles Ordered
                        </h5>

                        <div className="divide-y divide-neutral-100 max-h-[160px] overflow-y-auto">
                          {selectedAdminOrder.items.map((item, index) => (
                            <div key={index} className="flex gap-3 py-2 first:pt-0">
                              <img src={item.product.images[0]} alt={item.product.name} referrerPolicy="no-referrer" className="w-8 aspect-[3/4] object-cover border border-neutral-100" />
                              <div className="flex-1 text-[11px]">
                                <p className="font-bold text-neutral-900 line-clamp-1">{item.product.name}</p>
                                <p className="text-[9px] text-neutral-500">
                                  Size: {item.selectedSize} • Color: {item.selectedColor.name} • Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-neutral-100 space-y-1 text-right text-[11px] text-neutral-500">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-semibold text-neutral-900">₹{selectedAdminOrder.pricing.subtotal.toLocaleString('en-IN')}</span>
                          </div>
                          {selectedAdminOrder.pricing.discountAmount > 0 && (
                            <div className="flex justify-between text-red-700 bg-red-50 px-1 font-medium">
                              <span>Discount:</span>
                              <span>-₹{selectedAdminOrder.pricing.discountAmount.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-neutral-950 font-black text-xs pt-1 border-t border-dashed border-neutral-200">
                            <span>Grand Total:</span>
                            <span className="text-amber-900">₹{selectedAdminOrder.pricing.grandTotal.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    
                    {/* Status filtering bar */}
                    <div className="flex gap-2 border-b border-neutral-100 pb-3 overflow-x-auto">
                      {(['All', 'Pending', 'Dispatched', 'Delivered', 'Cancelled'] as const).map((filter) => {
                        const count = filter === 'All' ? ordersList.length : ordersList.filter(o => o.status === filter).length;
                        return (
                          <button
                            key={filter}
                            onClick={() => setAdminOrderFilter(filter)}
                            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border transition-colors ${
                              adminOrderFilter === filter
                                ? 'bg-neutral-950 text-white border-neutral-950'
                                : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:text-black'
                            }`}
                          >
                            {filter} ({count})
                          </button>
                        );
                      })}
                    </div>

                    {/* Table of Orders */}
                    <div className="overflow-x-auto border border-neutral-100">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-neutral-900 text-white uppercase tracking-wider text-[10px]">
                            <th className="p-4 font-semibold">Order ID</th>
                            <th className="p-4 font-semibold">Client Name</th>
                            <th className="p-4 font-semibold">Acquisition Date</th>
                            <th className="p-4 font-semibold">Grand Total</th>
                            <th className="p-4 font-semibold">Payment Info</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Acquire Control</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {ordersList
                            .filter(o => adminOrderFilter === 'All' || o.status === adminOrderFilter)
                            .map((order) => (
                              <tr key={order.orderId} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="p-4 font-mono font-bold text-amber-800">{order.orderId}</td>
                                <td className="p-4">
                                  <div>
                                    <p className="font-bold text-neutral-900">{order.customer.fullName}</p>
                                    <p className="text-[10px] text-neutral-400 font-light">{order.customer.email}</p>
                                  </div>
                                </td>
                                <td className="p-4 text-neutral-500">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-neutral-900">₹{order.pricing.grandTotal.toLocaleString('en-IN')}</td>
                                <td className="p-4">
                                  <span className="uppercase text-[10px] font-semibold text-neutral-600 block">{order.payment.method}</span>
                                  {order.payment.upiRefNo && (
                                    <span className="font-mono text-[9px] text-amber-900 bg-amber-50 px-1 py-0.5 font-bold block mt-0.5 truncate max-w-[120px]" title={order.payment.upiRefNo}>
                                      Ref: {order.payment.upiRefNo}
                                    </span>
                                  )}
                                </td>
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
                                    onClick={() => {
                                      setSelectedAdminOrder(order);
                                      setOrderTrackingAWB(order.trackingAWB || '');
                                      setOrderTrackingCourier(order.trackingCourier || '');
                                    }}
                                    className="px-3 py-1.5 bg-neutral-900 hover:bg-amber-800 text-white text-[10px] uppercase tracking-widest font-black flex items-center gap-1 ml-auto"
                                  >
                                    <span>Manage</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          {ordersList.filter(o => adminOrderFilter === 'All' || o.status === adminOrderFilter).length === 0 && (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-neutral-400">
                                No orders captured under this logistics status.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB C: BANNERS CAMPAIGN */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-sans text-lg uppercase tracking-wider font-semibold">⚜️ Homepage Banners Campaign</h3>
                    <p className="text-xs text-neutral-400">Configure visual slider slides on the landing hero section.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {bannersList.map((banner) => {
                    const isEditing = editingBannerId === banner.id;
                    return (
                      <div key={banner.id} className="border border-neutral-200 p-6 bg-[#FAF9F6] flex flex-col md:flex-row gap-6 shadow-2xs">
                        
                        <div className="w-full md:w-1/3 space-y-3">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Campaign Preview</p>
                          <div className="aspect-[16/9] border border-neutral-300 overflow-hidden relative bg-neutral-900 flex items-center justify-center">
                            {banner.image ? (
                              <img
                                src={banner.image}
                                alt={banner.title}
                                referrerPolicy="no-referrer"
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                              />
                            ) : (
                              <div className="text-neutral-500 text-xs">No image uploaded</div>
                            )}
                            <div className="relative text-center p-3 text-white">
                              <p className="text-[9px] uppercase tracking-widest font-bold text-amber-500">{banner.subtitle}</p>
                              <p className="text-xs font-bold uppercase mt-1 leading-tight">{banner.title}</p>
                              <span className="inline-block mt-3 px-3 py-1 bg-amber-500 text-[8px] uppercase tracking-widest text-neutral-950 font-black">
                                {banner.ctaText}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-neutral-700">Display Status:</span>
                            <button
                              onClick={() => handleToggleBannerActive(banner.id)}
                              className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold border rounded-xs ${
                                banner.isActive
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                              }`}
                            >
                              {banner.isActive ? '● Live on Site' : '○ Paused'}
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">{banner.id.toUpperCase()}</span>
                            {!isEditing && (
                              <button
                                onClick={() => {
                                  setEditingBannerId(banner.id);
                                  setBannerForm({ ...banner });
                                }}
                                className="text-xs uppercase tracking-widest font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> Edit Banner Copy
                              </button>
                            )}
                          </div>

                          {isEditing ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleBannerSubmit(bannerForm as Banner);
                              }}
                              className="space-y-4 text-xs"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Banner Title</label>
                                  <input
                                    type="text"
                                    required
                                    value={bannerForm.title || ''}
                                    onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-white border border-neutral-200 p-2 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Subtitle / Body</label>
                                  <input
                                    type="text"
                                    required
                                    value={bannerForm.subtitle || ''}
                                    onChange={(e) => setBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                                    className="w-full bg-white border border-neutral-200 p-2 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">CTA Button Text</label>
                                  <input
                                    type="text"
                                    required
                                    value={bannerForm.ctaText || ''}
                                    onChange={(e) => setBannerForm(prev => ({ ...prev, ctaText: e.target.value }))}
                                    className="w-full bg-white border border-neutral-200 p-2 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Campaign Image URL</label>
                                  <input
                                    type="text"
                                    required
                                    value={bannerForm.image || ''}
                                    onChange={(e) => setBannerForm(prev => ({ ...prev, image: e.target.value }))}
                                    className="w-full bg-white border border-neutral-200 p-2 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setEditingBannerId(null)}
                                  className="px-4 py-2 border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-neutral-950 text-white hover:bg-neutral-900 font-bold"
                                >
                                  Save Updates
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-neutral-900">{banner.title}</p>
                              <p className="text-xs text-neutral-500 font-light">{banner.subtitle}</p>
                              <div className="text-[11px] text-neutral-400 pt-2 space-y-1">
                                <p>🔗 Action Destination: <strong className="font-semibold text-neutral-700">View: {banner.ctaView} {banner.ctaArg && `(${banner.ctaArg})`}</strong></p>
                                <p className="truncate">🖼️ Asset Path: <span className="font-mono">{banner.image}</span></p>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB C: CLIENT REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-sans text-lg uppercase tracking-wider font-semibold">✨ Customer Reviews moderation</h3>
                  <p className="text-xs text-neutral-400">Approve or remove customer reviews submitted on individual luxury items.</p>
                </div>

                <div className="overflow-x-auto border border-neutral-100">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-900 text-white uppercase tracking-wider text-[10px]">
                        <th className="p-4 font-semibold">Ensemble SKU</th>
                        <th className="p-4 font-semibold">Reviewer</th>
                        <th className="p-4 font-semibold">Rating</th>
                        <th className="p-4 font-semibold">Comment</th>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold text-right">Moderation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {aggregatedReviews.map(({ product, review }) => (
                        <tr key={review.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="p-4 font-mono text-amber-800 font-bold">{product.id}</td>
                          <td className="p-4">
                            <div>
                              <p className="font-bold text-neutral-900">{review.author}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                              ))}
                            </div>
                          </td>
                          <td className="p-4 italic text-neutral-600 max-w-sm font-light">
                            "{review.comment}"
                          </td>
                          <td className="p-4 text-neutral-400 font-light">{review.date}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteReview(product.id, review.id)}
                              className="px-3 py-1.5 border border-red-100 hover:border-red-500 text-red-500 hover:bg-red-50 font-semibold uppercase tracking-wider text-[10px]"
                            >
                              Remove perm
                            </button>
                          </td>
                        </tr>
                      ))}
                      {aggregatedReviews.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-neutral-400">
                            No reviews have been submitted on any luxury items yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB D: DOMAIN & INTEGRATIONS */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                
                {/* 1. Custom Domain Section */}
                <div className="bg-[#FAF9F6] border border-neutral-200 p-6 space-y-4">
                  <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
                    <Globe className="w-6 h-6 text-amber-600" />
                    <div>
                      <h4 className="font-sans text-sm uppercase tracking-wider font-bold">Custom Domain Mapping</h4>
                      <p className="text-xs text-neutral-400">Point your luxury address keeofficial.in here immediately.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="max-w-md">
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                        Domain Name Configuration
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={domainConfig}
                          onChange={(e) => setDomainConfig(e.target.value.toLowerCase().trim())}
                          placeholder="keeofficial.in"
                          className="flex-1 bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden focus:border-amber-600 font-mono"
                        />
                        <button
                          onClick={handleSaveDomain}
                          className="px-4 py-2.5 bg-neutral-950 text-white hover:bg-neutral-900 text-xs uppercase tracking-widest font-bold"
                        >
                          Save Mapping
                        </button>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white border border-neutral-200/60 p-4 space-y-3">
                      <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">🔒 DNS Pointer Records (CNAME) Instructions</p>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        To activate <code className="text-amber-800 font-mono font-semibold bg-neutral-50 px-1">{domainConfig}</code> without rebuilds, login to your registrar panel (GoDaddy, Namecheap, etc.) and create these records:
                      </p>
                      <div className="font-mono text-[11px] bg-neutral-900 text-neutral-300 p-3 space-y-1 rounded-none border border-neutral-800">
                        <p className="text-amber-400"># TYPE  | HOST | POINTS TO</p>
                        <p>CNAME   | @    | ais-dev-buzdxbo53vjebf23ohtit2-298600030916.asia-southeast1.run.app</p>
                        <p>CNAME   | www  | ais-dev-buzdxbo53vjebf23ohtit2-298600030916.asia-southeast1.run.app</p>
                      </div>
                      <p className="text-[10px] text-neutral-400 italic">
                        * Note: Cloud Run container automatically intercepts headers for {domainConfig} and presents SSL/TLS certificate. Zero downtime.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Luxury WhatsApp Concierge Number Section (NEW!) */}
                <div className="bg-[#FAF9F6] border border-neutral-200 p-6 space-y-4">
                  <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
                    <MessageSquare className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h4 className="font-sans text-sm uppercase tracking-wider font-bold">💬 Luxury WhatsApp Concierge Number</h4>
                      <p className="text-xs text-neutral-400">Set the recipient phone number for all Buy on WhatsApp & Concierge Consult triggers.</p>
                    </div>
                  </div>

                  <div className="max-w-md space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                        WhatsApp Phone Number (With Country Code, No spaces/plus, e.g. 919999999999)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={whatsappInput}
                          onChange={(e) => setWhatsappInput(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="919999999999"
                          className="flex-1 bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden font-mono text-neutral-900 font-bold"
                        />
                        <button
                          onClick={() => {
                            if (whatsappInput.length < 10) {
                              window.showToast?.('Please specify a valid numeric country-coded mobile number.', 'error');
                              return;
                            }
                            onUpdateWhatsappNumber(whatsappInput);
                            window.showToast?.('WhatsApp concierge link successfully updated!', 'success');
                          }}
                          className="px-4 py-2.5 bg-neutral-950 text-white hover:bg-neutral-900 text-xs uppercase tracking-widest font-bold"
                        >
                          Save Concierge
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                      All direct inquiries, bespoke sizing, custom order summaries, and VIP chat interactions will route instantly to this specified number.
                    </p>
                  </div>
                </div>

                {/* 4. Razorpay Gateway Section */}
                <div className="bg-[#FAF9F6] border border-neutral-200 p-6 space-y-4">
                  <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
                    <CreditCard className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h4 className="font-sans text-sm uppercase tracking-wider font-bold">Future Online checkout Gateways (Razorpay / UPI / COD)</h4>
                      <p className="text-xs text-neutral-400">Pre-configure live keys for future instant activation.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                          Razorpay API Live Key ID
                        </label>
                        <input
                          type="text"
                          value={razorpayKey}
                          onChange={(e) => setRazorpayKey(e.target.value)}
                          placeholder="rzp_live_..."
                          className="w-full bg-white border border-neutral-200 p-2.5 text-xs focus:outline-hidden font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sandbox_mode"
                          checked={isRazorpaySandbox}
                          onChange={(e) => setIsRazorpaySandbox(e.target.checked)}
                          className="w-4 h-4 accent-amber-500"
                        />
                        <label htmlFor="sandbox_mode" className="text-xs font-semibold cursor-pointer text-neutral-700">
                          Sandbox Test Mode Enabled
                        </label>
                      </div>

                      <button
                        onClick={handleSaveRazorpay}
                        className="px-4 py-2 bg-neutral-950 text-white hover:bg-neutral-900 text-xs uppercase tracking-widest font-bold"
                      >
                        Secure Gateway Credentials
                      </button>
                    </div>

                    <div className="bg-white border border-neutral-200/60 p-4 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider px-2 py-0.5 border border-emerald-200">
                          Future Readiness Checklist
                        </span>
                        <h5 className="font-sans text-xs font-bold uppercase tracking-wider pt-1.5">Launch Phase Integrations</h5>
                        <ul className="text-xs space-y-2 text-neutral-500 font-light">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span><strong>WhatsApp Ordering</strong>: Active & Operational</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span><strong>UPI Payments (Direct QR)</strong>: Design Ready</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-neutral-300 shrink-0" />
                            <span><strong>Razorpay Gateway</strong>: Backend skeleton prepared</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-neutral-300 shrink-0" />
                            <span><strong>Cash On Delivery (COD)</strong>: Dispatch rules prepared</span>
                          </li>
                        </ul>
                      </div>
                      <p className="text-[10px] text-neutral-400 italic">
                        Once checkout is enabled, client views will immediately render credit card, netbanking, and UPI wallets seamlessly.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
