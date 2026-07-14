import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail, 
  User, 
  Tag, 
  Percent, 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Upload, 
  Trash2, 
  Minus, 
  Plus, 
  Truck, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { CartItem, ColorOption, Product } from '../types';

interface CheckoutViewProps {
  cartList: CartItem[];
  onUpdateQty: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onNavigateBack: () => void;
  onOrderCompleted: (orderDetails: any) => void;
  whatsappNumber?: string;
}

export default function CheckoutView({
  cartList,
  onUpdateQty,
  onRemoveItem,
  onNavigateBack,
  onOrderCompleted,
  whatsappNumber = '919999999999',
}: CheckoutViewProps) {
  // Address Form States
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'percent' | 'flat'; value: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Payment Option state: 'upi' | 'razorpay' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay' | 'cod'>('upi');

  // UPI Transaction Form States
  const [upiRefNo, setUpiRefNo] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Formatting helper
  const formattedPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  // Calculations
  const subtotal = cartList.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCharge = subtotal >= 3000 ? 0 : 150;

  // Coupon calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round(subtotal * (appliedCoupon.value / 100));
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = appliedCoupon.value;
    }
  }

  const grandTotal = subtotal + deliveryCharge - discountAmount;

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone.trim())) {
      errors.phone = 'Please provide a valid phone number';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }
    if (!formData.address.trim()) errors.address = 'Detailed shipping address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP / Postal Code is required';
    } else if (!/^[0-9]{5,6}$/.test(formData.zipCode.trim())) {
      errors.zipCode = 'Please provide a valid ZIP code';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Apply Coupon Code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (code === 'KEE10') {
      setAppliedCoupon({ code: 'KEE10', type: 'percent', value: 10 });
      setCouponSuccess('Sovereign Grace Coupon applied! 10% discount has been subtracted.');
    } else if (code === 'KEEGOLD') {
      if (subtotal < 4000) {
        setCouponError('Coupon KEEGOLD requires a minimum purchase of ₹4,000.');
      } else {
        setAppliedCoupon({ code: 'KEEGOLD', type: 'flat', value: 500 });
        setCouponSuccess('Luxury Gold Coupon applied! ₹500 discount has been subtracted.');
      }
    } else if (code === 'LUXURY20') {
      if (subtotal < 8000) {
        setCouponError('Coupon LUXURY20 requires a minimum purchase of ₹8,000.');
      } else {
        setAppliedCoupon({ code: 'LUXURY20', type: 'percent', value: 20 });
        setCouponSuccess('Empress VIP Coupon applied! 20% discount has been subtracted.');
      }
    } else {
      setCouponError('Invalid coupon code. Try KEE10, KEEGOLD, or LUXURY20.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponCode('');
  };

  // Mock Receipt Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 25;
        });
      }, 150);
    }
  };

  // Drag and drop receipt upload handlers
  const [isDragOver, setIsDragOver] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setReceiptFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 25;
        });
      }, 150);
    }
  };

  // Place Order Action
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartList.length === 0) {
      window.showToast?.('Your boutique shopping cart is empty.', 'error');
      return;
    }

    if (!validateForm()) {
      const firstErrorElement = document.querySelector('.text-red-500');
      firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.showToast?.('Please correct the validation errors on the form.', 'warning');
      return;
    }

    if (paymentMethod === 'upi') {
      if (!upiRefNo.trim() && !receiptFile) {
        window.showToast?.('Please provide your UPI Transaction Reference ID or upload a payment receipt screenshot.', 'warning');
        return;
      }
    } else {
      window.showToast?.('The selected payment gateway is under integration. Please choose Manual UPI for now.', 'info');
      return;
    }

    // Process order details object
    const orderId = `KEE-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderDetails = {
      orderId,
      items: cartList,
      customer: formData,
      pricing: {
        subtotal,
        deliveryCharge,
        discountAmount,
        grandTotal,
        appliedCoupon: appliedCoupon?.code || null,
      },
      payment: {
        method: paymentMethod,
        upiRefNo: upiRefNo.trim() || 'Uploaded Receipt',
        receiptName: receiptFile?.name || null,
      },
      date: new Date().toISOString(),
      estimatedDelivery: '3 to 5 Business Days'
    };

    onOrderCompleted(orderDetails);
  };

  // WhatsApp bypass order inquiry
  const handleWhatsAppBypassInquiry = () => {
    if (cartList.length === 0) return;

    let itemsText = cartList.map((item) => {
      return `• ${item.product.name} (${item.selectedSize}/${item.selectedColor.name}) x${item.quantity} - ${formattedPrice(item.product.price * item.quantity)}`;
    }).join('\n');

    const whatsappMessage = `Hello KEE! I would like to place a VIP order for the following items:\n\n` +
      `${itemsText}\n\n` +
      `⚜️ *Subtotal*: ${formattedPrice(subtotal)}\n` +
      `⚜️ *Delivery*: ${deliveryCharge === 0 ? 'Complimentary' : formattedPrice(deliveryCharge)}\n` +
      `⚜️ *Grand Total*: ${formattedPrice(grandTotal)}\n\n` +
      `Please verify stock and complete my order concierge assistance. Thank you!`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200/50">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Boutique</span>
        </button>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold hidden sm:block">
          ⚜️ Sovereign Checkout Protocol
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT SIDE: FORMS ================= */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            
            {/* Phase 1: Shipping Address */}
            <section className="bg-white p-6 md:p-8 border border-neutral-200/60 shadow-xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
                <MapPin className="w-5 h-5 text-amber-700" />
                <h2 className="font-sans text-base uppercase tracking-widest text-neutral-900 font-bold">
                  Shipping Address
                </h2>
              </div>

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5 flex justify-between">
                    <span>Full Delivery Name *</span>
                    {formErrors.fullName && <span className="text-red-500 font-medium">{formErrors.fullName}</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Lady Isabella Montgomery"
                      className={`w-full p-3 bg-[#FAF9F6] border text-xs text-neutral-900 outline-hidden focus:bg-white focus:border-black transition-all pl-10 ${
                        formErrors.fullName ? 'border-red-400' : 'border-neutral-200'
                      }`}
                    />
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Contact grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5 flex justify-between">
                      <span>Phone Number *</span>
                      {formErrors.phone && <span className="text-red-500 font-medium text-[9px]">{formErrors.phone}</span>}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 99999 99999"
                        className={`w-full p-3 bg-[#FAF9F6] border text-xs text-neutral-900 outline-hidden focus:bg-white focus:border-black transition-all pl-10 ${
                          formErrors.phone ? 'border-red-400' : 'border-neutral-200'
                        }`}
                      />
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5 flex justify-between">
                      <span>Email Address *</span>
                      {formErrors.email && <span className="text-red-500 font-medium text-[9px]">{formErrors.email}</span>}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="isabella@example.com"
                        className={`w-full p-3 bg-[#FAF9F6] border text-xs text-neutral-900 outline-hidden focus:bg-white focus:border-black transition-all pl-10 ${
                          formErrors.email ? 'border-red-400' : 'border-neutral-200'
                        }`}
                      />
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </div>

                {/* Detailed Address */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5 flex justify-between">
                    <span>Street Address & Landmark *</span>
                    {formErrors.address && <span className="text-red-500 font-medium">{formErrors.address}</span>}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Penthouse A, Silver Sands Residency, Near Taj Lands End"
                    className={`w-full p-3 bg-[#FAF9F6] border text-xs text-neutral-900 outline-hidden focus:bg-white focus:border-black transition-all resize-none ${
                      formErrors.address ? 'border-red-400' : 'border-neutral-200'
                    }`}
                  />
                </div>

                {/* Location Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5 flex justify-between">
                      <span>City *</span>
                      {formErrors.city && <span className="text-red-500 font-medium text-[9px]">{formErrors.city}</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Mumbai"
                      className={`w-full p-3 bg-[#FAF9F6] border text-xs text-neutral-900 outline-hidden focus:bg-white focus:border-black transition-all ${
                        formErrors.city ? 'border-red-400' : 'border-neutral-200'
                      }`}
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5 flex justify-between">
                      <span>State *</span>
                      {formErrors.state && <span className="text-red-500 font-medium text-[9px]">{formErrors.state}</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Maharashtra"
                      className={`w-full p-3 bg-[#FAF9F6] border text-xs text-neutral-900 outline-hidden focus:bg-white focus:border-black transition-all ${
                        formErrors.state ? 'border-red-400' : 'border-neutral-200'
                      }`}
                    />
                  </div>

                  {/* ZIP */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5 flex justify-between">
                      <span>ZIP / PIN Code *</span>
                      {formErrors.zipCode && <span className="text-red-500 font-medium text-[9px]">{formErrors.zipCode}</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="400050"
                      maxLength={6}
                      className={`w-full p-3 bg-[#FAF9F6] border text-xs text-neutral-900 outline-hidden focus:bg-white focus:border-black transition-all ${
                        formErrors.zipCode ? 'border-red-400' : 'border-neutral-200'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Phase 2: Payment Section */}
            <section className="bg-white p-6 md:p-8 border border-neutral-200/60 shadow-xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
                <CreditCard className="w-5 h-5 text-amber-700" />
                <h2 className="font-sans text-base uppercase tracking-widest text-neutral-900 font-bold">
                  Select Payment Option
                </h2>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 border flex flex-col items-center justify-center text-center transition-all duration-300 relative ${
                    paymentMethod === 'upi'
                      ? 'border-amber-600 bg-amber-50/10 scale-103'
                      : 'border-neutral-200 hover:border-black bg-[#FAF9F6] hover:bg-white'
                  }`}
                >
                  <QrCode className={`w-5 h-5 mb-1.5 ${paymentMethod === 'upi' ? 'text-amber-700' : 'text-neutral-500'}`} />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-900">Manual UPI</span>
                  <span className="text-[8px] text-emerald-800 font-semibold mt-0.5">Active Gateway</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3.5 border flex flex-col items-center justify-center text-center transition-all duration-300 relative ${
                    paymentMethod === 'razorpay'
                      ? 'border-amber-600 bg-amber-50/10 scale-103'
                      : 'border-neutral-200 hover:border-black bg-[#FAF9F6] hover:bg-white'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 mb-1.5 ${paymentMethod === 'razorpay' ? 'text-amber-700' : 'text-neutral-400'}`} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 line-through">Razorpay</span>
                  <span className="text-[7px] text-amber-700 bg-amber-50 border border-amber-100 px-1 font-semibold mt-1 rounded-full">Soon</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 border flex flex-col items-center justify-center text-center transition-all duration-300 relative ${
                    paymentMethod === 'cod'
                      ? 'border-amber-600 bg-amber-50/10 scale-103'
                      : 'border-neutral-200 hover:border-black bg-[#FAF9F6] hover:bg-white'
                  }`}
                >
                  <Truck className={`w-5 h-5 mb-1.5 ${paymentMethod === 'cod' ? 'text-amber-700' : 'text-neutral-400'}`} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 line-through">Cash on Delivery</span>
                  <span className="text-[7px] text-amber-700 bg-amber-50 border border-amber-100 px-1 font-semibold mt-1 rounded-full">Soon</span>
                </button>
              </div>

              {/* Payment details content */}
              {paymentMethod === 'upi' && (
                <div className="space-y-5 bg-[#FAF9F6] p-4 md:p-6 border border-neutral-200/50">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-bold">Manual UPI Reservation</span>
                    <h3 className="font-sans text-xs uppercase tracking-widest text-neutral-800 font-bold">
                      Direct UPI Transfer Details
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-xs text-neutral-700">
                    <div className="bg-amber-500/5 p-3 border border-dashed border-amber-600/10 text-[11px] text-neutral-600 leading-normal flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        Please make your payment of <strong className="text-neutral-900">{formattedPrice(grandTotal)}</strong> to our verified boutique UPI ID below. Your order items will be instantly reserved for 1 hour.
                      </span>
                    </div>

                    {/* VPA Copy Block */}
                    <div className="flex items-center justify-between bg-white border border-neutral-200 p-3 rounded-xs">
                      <div>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">Official UPI VPA ID</p>
                        <p className="font-mono text-sm font-bold text-neutral-900 select-all">kee.luxury@upi</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('kee.luxury@upi');
                          window.showToast?.('UPI ID kee.luxury@upi copied to clipboard!', 'success');
                        }}
                        className="px-3 py-1.5 bg-neutral-950 text-white hover:bg-amber-800 text-[9px] uppercase tracking-widest font-bold transition-all"
                      >
                        Copy
                      </button>
                    </div>

                    {/* QR Code Graphic Mockup */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center bg-white border border-neutral-200 p-4">
                      {/* Visual QR Code Placeholder with high premium styling */}
                      <div className="w-24 h-24 bg-neutral-900 p-2.5 flex items-center justify-center shrink-0 border-2 border-amber-500">
                        <div className="text-center text-[10px] text-white space-y-1.5 flex flex-col items-center">
                          <QrCode className="w-10 h-10 text-amber-500" />
                          <span className="text-[8px] tracking-wide font-mono text-neutral-300">SCAN QR</span>
                        </div>
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <p className="font-semibold text-neutral-900 text-xs">Scan using GPay, PhonePe, or Paytm</p>
                        <p className="text-[10px] text-neutral-500 leading-relaxed">
                          Your grand total amount of <strong className="text-neutral-800 font-bold">{formattedPrice(grandTotal)}</strong> is automatically supported. Kindly type your name in the payment description note.
                        </p>
                      </div>
                    </div>

                    {/* Verification input fields */}
                    <div className="pt-3 border-t border-neutral-200 space-y-4">
                      {/* Option A: Input Transaction ID */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
                          UPI Ref No. / Transaction ID *
                        </label>
                        <input
                          type="text"
                          value={upiRefNo}
                          onChange={(e) => setUpiRefNo(e.target.value)}
                          placeholder="e.g. 123456789012 (12-digit number)"
                          className="w-full p-2.5 bg-white border border-neutral-200 text-xs focus:border-black outline-hidden"
                        />
                        <p className="text-[9px] text-neutral-400 mt-1">Specify the 12-digit UPI transaction reference number for matching.</p>
                      </div>

                      {/* Option B: Upload receipt image (Drag & Drop) */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5">
                          Or Upload Screenshot of Payment Receipt *
                        </label>
                        
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-xs p-5 text-center cursor-pointer transition-colors relative ${
                            isDragOver ? 'border-amber-600 bg-amber-50/5' : 'border-neutral-200 bg-white hover:border-neutral-400'
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />

                          {receiptFile ? (
                            <div className="space-y-2 text-neutral-800 flex flex-col items-center">
                              <CheckCircle className="w-8 h-8 text-emerald-600" />
                              <div className="text-xs">
                                <span className="font-bold text-neutral-950 block">{receiptFile.name}</span>
                                <span className="text-[10px] text-neutral-500">{(receiptFile.size / 1024).toFixed(1)} KB • Upload complete</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReceiptFile(null);
                                }}
                                className="text-[10px] uppercase tracking-wider font-bold text-red-700 hover:underline mt-1"
                              >
                                Remove File
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2 text-neutral-500">
                              <Upload className="w-8 h-8 mx-auto text-neutral-300" />
                              <p className="text-xs">
                                <span className="font-bold text-neutral-900">Drag & drop</span> your screenshot here, or <span className="text-amber-800 font-bold underline">browse local files</span>
                              </p>
                              <p className="text-[9px] text-neutral-400">Accepts PNG, JPG, JPEG files from your camera roll</p>
                            </div>
                          )}

                          {isUploading && (
                            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center">
                              <div className="w-1/2 bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-amber-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                              </div>
                              <span className="text-[9px] text-neutral-500 mt-2 font-semibold">Encrypting attachment... {uploadProgress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'razorpay' && (
                <div className="p-6 bg-neutral-50 border border-neutral-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-800">Razorpay Gateway Integration</h3>
                    <p className="text-[11px] text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
                      Our engineering division is current finalizing API certification with Razorpay. Full credit card, netbanking, and automatic UPI popups will launch soon. Please utilize our manual UPI gateway in the interim.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-6 bg-neutral-50 border border-neutral-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-800">Cash on Delivery Verification</h3>
                    <p className="text-[11px] text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
                      To prevent boutique fraud, COD option requires a localized PIN verification check which is currently under development. Please utilize Manual UPI for instant garment reservations.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Place Order CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-4 bg-neutral-950 text-[#FAF9F6] hover:bg-amber-800 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md border border-neutral-900 text-center cursor-pointer"
              >
                Place Luxury Order & Confirm
              </button>
              
              <button
                type="button"
                onClick={handleWhatsAppBypassInquiry}
                className="py-4 px-6 border border-emerald-600 hover:bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <span>Bypass on WhatsApp</span>
              </button>
            </div>
          </form>
        </div>

        {/* ================= RIGHT SIDE: ORDER SUMMARY ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 border border-neutral-200/60 shadow-xs sticky top-32">
            <h2 className="font-sans text-sm uppercase tracking-widest text-neutral-900 font-bold mb-5 pb-3 border-b border-neutral-100">
              Boutique Order Summary
            </h2>

            {/* Scrollable list of checkout items */}
            <div className="max-h-60 overflow-y-auto space-y-4 mb-6 pr-1 divide-y divide-neutral-100">
              {cartList.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedSize}-${idx}`} className="flex gap-4 pt-3 first:pt-0">
                  {/* Item thumbnail */}
                  <div className="w-12 aspect-[3/4] bg-neutral-50 overflow-hidden shrink-0 border border-neutral-100">
                    <img src={item.product.images[0]} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0 text-xs">
                    <h3 className="font-semibold text-neutral-900 truncate">{item.product.name}</h3>
                    <div className="flex gap-2 text-[10px] text-neutral-500 mt-0.5">
                      <span>Size: <strong>{item.selectedSize}</strong></span>
                      <span>Color: <strong>{item.selectedColor.name}</strong></span>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-2">
                      {/* Small Quantity selector in checkout */}
                      <div className="flex items-center border border-neutral-200 rounded-xs bg-[#FAF9F6]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(idx, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-1.5 py-0.5 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors disabled:opacity-30"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-1.5 text-[11px] font-bold text-neutral-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(idx, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-1.5 py-0.5 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <span className="font-bold text-neutral-950 text-xs">{formattedPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>

                  {/* Remove in checkout */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(idx)}
                    className="p-1 text-neutral-300 hover:text-red-700 h-fit self-center"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Coupons section */}
            <div className="mb-6 pt-5 border-t border-neutral-100">
              <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5">
                Apply Boutique Promo Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950 uppercase">{appliedCoupon.code}</p>
                      <p className="text-[10px] text-emerald-800">
                        {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}% discount applied` : `₹${appliedCoupon.value} off applied`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[10px] text-red-700 hover:underline uppercase tracking-widest font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter KEE10, KEEGOLD etc."
                    className="flex-1 p-2.5 bg-[#FAF9F6] border border-neutral-200 text-xs uppercase tracking-wider text-neutral-800 focus:bg-white focus:border-black outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-neutral-900 text-white hover:bg-black text-[10px] uppercase tracking-widest font-bold transition-all"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[10px] text-red-600 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{couponError}</span>
                </p>
              )}
              {couponSuccess && (
                <p className="text-[10px] text-emerald-800 font-medium mt-1.5 flex items-center gap-1 bg-emerald-50/50 p-1 px-2 border border-emerald-100/55">
                  <CheckCircle className="w-3 h-3 shrink-0 text-emerald-600" />
                  <span>{couponSuccess}</span>
                </p>
              )}

              {/* Promo recommendation hint box */}
              {!appliedCoupon && (
                <div className="mt-3 p-2.5 bg-neutral-50/70 border border-neutral-200/50 space-y-1">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-amber-900">Available Promotions:</p>
                  <ul className="text-[9px] text-neutral-500 list-disc pl-3.5 space-y-0.5">
                    <li><strong className="text-neutral-700">KEE10</strong>: 10% Off Your Entire Order (No minimum)</li>
                    {subtotal < 4000 ? (
                      <li className="opacity-60"><strong className="text-neutral-700">KEEGOLD</strong>: ₹500 Off (Need ₹{4000 - subtotal} more)</li>
                    ) : (
                      <li><strong className="text-neutral-700">KEEGOLD</strong>: ₹500 Off (Eligible!)</li>
                    )}
                    {subtotal < 8000 ? (
                      <li className="opacity-60"><strong className="text-neutral-700">LUXURY20</strong>: 20% Off (Need ₹{8000 - subtotal} more)</li>
                    ) : (
                      <li><strong className="text-neutral-700">LUXURY20</strong>: 20% Off (Eligible!)</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Financial ledger details */}
            <div className="space-y-2 text-xs text-neutral-500 border-t border-neutral-100 pt-5">
              <div className="flex justify-between">
                <span>Boutique Item Subtotal:</span>
                <span className="font-semibold text-neutral-900">{formattedPrice(subtotal)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-700 font-medium bg-red-50 p-1 px-2">
                  <span>Promo Discount ({appliedCoupon?.code}):</span>
                  <span>-{formattedPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Complimentary Delivery:</span>
                <span className="font-semibold text-neutral-900">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-800 uppercase tracking-widest text-[9px] font-bold">Free Shipping</span>
                  ) : (
                    formattedPrice(deliveryCharge)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-950">
                <span>Grand Total Amount:</span>
                <span className="text-lg text-amber-900 font-black">{formattedPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Luxury dispatch notice banner */}
            <div className="mt-6 p-4 bg-[#FAF9F6] border border-amber-600/10 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-neutral-700">
                <Truck className="w-4 h-4 text-amber-700" />
                <span>VIP Priority Packaging</span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-relaxed">
                Every purchase from KEE! is double-verified, scented, and hand-wrapped in sovereign parchment with custom sizing cards. Dispatch occurs within 24 hours of UPI receipt verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
