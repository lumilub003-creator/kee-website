import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Printer, MessageSquare, ArrowRight, ShieldCheck, ShoppingBag, MapPin, Sparkles, Phone, Mail } from 'lucide-react';
import { Product } from '../types';

interface OrderConfirmationViewProps {
  orderDetails: {
    orderId: string;
    items: any[];
    customer: {
      fullName: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
    };
    pricing: {
      subtotal: number;
      deliveryCharge: number;
      discountAmount: number;
      grandTotal: number;
      appliedCoupon: string | null;
    };
    payment: {
      method: string;
      upiRefNo: string;
      receiptName: string | null;
    };
    date: string;
    estimatedDelivery: string;
  };
  onContinueShopping: () => void;
  whatsappNumber?: string;
}

export default function OrderConfirmationView({
  orderDetails,
  onContinueShopping,
  whatsappNumber = '919999999999',
}: OrderConfirmationViewProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  // Helper to compile order details and open WhatsApp
  const handleWhatsAppNotify = () => {
    let itemsText = orderDetails.items
      .map((item) => `• ${item.product.name} (${item.selectedSize}/${item.selectedColor.name}) x${item.quantity}`)
      .join('\n');

    const whatsappMessage = 
      `⚜️ *KEE! Luxury Order Confirmed* ⚜️\n\n` +
      `Dearest KEE! team, I have completed my sovereign checkout. Please verify my payment receipt:\n\n` +
      `⚜️ *Order Reference ID*: ${orderDetails.orderId}\n` +
      `⚜️ *Customer Name*: ${orderDetails.customer.fullName}\n` +
      `⚜️ *Contact*: ${orderDetails.customer.phone}\n` +
      `⚜️ *Delivery Coordinates*:\n${orderDetails.customer.address}, ${orderDetails.customer.city}, ${orderDetails.customer.state} - ${orderDetails.customer.zipCode}\n\n` +
      `⚜️ *Garments Purchased*:\n${itemsText}\n\n` +
      `⚜️ *Subtotal*: ${formattedPrice(orderDetails.pricing.subtotal)}\n` +
      `⚜️ *Promo Coupon*: ${orderDetails.pricing.appliedCoupon || 'None'}\n` +
      `⚜️ *Grand Total Paid*: ${formattedPrice(orderDetails.pricing.grandTotal)}\n` +
      `⚜️ *UPI Ref / Reference ID*: ${orderDetails.payment.upiRefNo}\n\n` +
      `Please confirm dispatch details soon. Thank you!`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Upper Success Badge */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-600 mb-5">
          <CheckCircle className="w-10 h-10 animate-pulse" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 block mb-1">
          ⚜️ Sovereign Checkout Successful
        </span>
        <h1 className="font-sans text-3xl font-extralight text-neutral-950 uppercase tracking-wide">
          Thank you for your order
        </h1>
        <p className="text-xs text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
          Your payment has been logged. Our design atelier has received your sizing coordinates and is preparing your bespoke parcel.
        </p>
      </div>

      {/* Main Printable Card */}
      <div 
        ref={printAreaRef}
        className="bg-white border border-neutral-200/75 p-6 md:p-10 shadow-lg space-y-8 print:border-none print:shadow-none"
      >
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-6">
          <div>
            <h2 className="font-sans text-2xl font-black tracking-widest text-black">
              KEE<span className="text-[#D4AF37]">!</span>
            </h2>
            <p className="text-[8px] tracking-[0.3em] text-neutral-400 uppercase font-bold">
              ELEGANCE IN EVERY THREAD
            </p>
          </div>
          <div className="text-left sm:text-right text-xs">
            <p className="text-neutral-400">Order Reference</p>
            <p className="font-mono text-base font-bold text-neutral-950 select-all">{orderDetails.orderId}</p>
            <p className="text-neutral-400 mt-1">Date: {new Date(orderDetails.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
          </div>
        </div>

        {/* Client & Shipping coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs border-b border-neutral-100 pb-6">
          <div className="space-y-2">
            <h3 className="font-sans uppercase tracking-widest font-bold text-neutral-400 text-[10px]">
              Customer Information
            </h3>
            <p className="font-semibold text-neutral-900 text-sm">{orderDetails.customer.fullName}</p>
            <p className="text-neutral-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-neutral-400" /> {orderDetails.customer.phone}</p>
            <p className="text-neutral-600 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-neutral-400" /> {orderDetails.customer.email}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-sans uppercase tracking-widest font-bold text-neutral-400 text-[10px]">
              Shipping Coordinates
            </h3>
            <p className="text-neutral-900 font-medium leading-relaxed flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                {orderDetails.customer.address}, <br />
                {orderDetails.customer.city}, {orderDetails.customer.state} - {orderDetails.customer.zipCode}
              </span>
            </p>
          </div>
        </div>

        {/* Ordered items listing table */}
        <div>
          <h3 className="font-sans uppercase tracking-widest font-bold text-neutral-400 text-[10px] mb-4">
            Bespoke Selections
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-neutral-100">
              <thead>
                <tr className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 font-semibold">Item & Details</th>
                  <th className="pb-3 font-semibold text-center">Size</th>
                  <th className="pb-3 font-semibold text-center">Color</th>
                  <th className="pb-3 font-semibold text-center">Qty</th>
                  <th className="pb-3 font-semibold text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orderDetails.items.map((item, idx) => (
                  <tr key={idx} className="text-neutral-800">
                    <td className="py-3.5 font-medium text-neutral-950 flex items-center gap-3">
                      <div className="w-9 aspect-[3/4] bg-neutral-50 overflow-hidden shrink-0 border border-neutral-100">
                        <img src={item.product.images[0]} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold block">{item.product.name}</span>
                        <span className="text-[10px] text-neutral-400 uppercase">{item.product.collection}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center font-bold text-neutral-900">{item.selectedSize}</td>
                    <td className="py-3.5 text-center text-neutral-500">{item.selectedColor.name}</td>
                    <td className="py-3.5 text-center font-semibold text-neutral-900">{item.quantity}</td>
                    <td className="py-3.5 text-right font-bold text-neutral-950">{formattedPrice(item.product.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial recap ledger */}
        <div className="border-t border-neutral-100 pt-6 flex flex-col md:flex-row justify-between gap-6 text-xs">
          {/* Payment status & information */}
          <div className="space-y-3 max-w-sm">
            <div className="p-3 bg-[#FAF9F6] border border-amber-600/10 rounded-xs">
              <span className="text-[9px] uppercase tracking-wider font-bold text-amber-950 block mb-1">
                Payment Record
              </span>
              <p className="text-neutral-700 leading-normal text-[11px]">
                Paid via <strong className="text-neutral-900">Manual UPI</strong>. <br />
                Transaction Ref No: <strong className="text-neutral-900 font-mono text-xs">{orderDetails.payment.upiRefNo}</strong>
              </p>
              {orderDetails.payment.receiptName && (
                <p className="text-[10px] text-emerald-800 font-semibold mt-1">
                  ✓ Receipt Attached: {orderDetails.payment.receiptName}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified VIP Customer Invoice</span>
            </div>
          </div>

          {/* Ledger calculations */}
          <div className="space-y-2 text-neutral-500 text-xs w-full md:w-72">
            <div className="flex justify-between">
              <span>Subtotal Amount:</span>
              <span className="font-semibold text-neutral-900">{formattedPrice(orderDetails.pricing.subtotal)}</span>
            </div>

            {orderDetails.pricing.discountAmount > 0 && (
              <div className="flex justify-between text-red-700">
                <span>Promo Coupon Discount ({orderDetails.pricing.appliedCoupon}):</span>
                <span>-{formattedPrice(orderDetails.pricing.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Boutique Packing & Delivery:</span>
              <span className="font-semibold text-neutral-900">
                {orderDetails.pricing.deliveryCharge === 0 ? (
                  <span className="text-emerald-800 uppercase tracking-widest text-[9px] font-bold">Complimentary</span>
                ) : (
                  formattedPrice(orderDetails.pricing.deliveryCharge)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-950">
              <span>Grand Total Paid:</span>
              <span className="text-base text-amber-900 font-black">{formattedPrice(orderDetails.pricing.grandTotal)}</span>
            </div>

            <div className="text-[10px] text-neutral-400 italic text-right pt-1.5">
              Estimated Delivery: {orderDetails.estimatedDelivery}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleWhatsAppNotify}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2.5 shadow-md shrink-0 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" /> 
          <span>Share details on WhatsApp</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-6 py-3.5 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>

        <button
          onClick={onContinueShopping}
          className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-900 text-white text-xs uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
