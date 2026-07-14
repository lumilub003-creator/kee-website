import React, { useState } from 'react';
import { Mail, ArrowRight, Instagram, MessageSquare, Shield, HelpCircle, FileText, ArrowUp, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, arg?: any) => void;
  onOpenPolicy: (policy: 'privacy' | 'shipping' | 'returns') => void;
  whatsappNumber?: string;
}

export default function Footer({
  onNavigate,
  onOpenPolicy,
  whatsappNumber = '919999999999',
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 font-light border-t border-neutral-900">
      
      {/* 1. Newsletter Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 border-b border-neutral-900 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <div className="lg:col-span-5 space-y-2">
          <span className="text-[10px] text-amber-500 font-bold tracking-[0.3em] uppercase">Join the Atelier</span>
          <h3 className="font-sans text-xl sm:text-2xl font-light text-white uppercase tracking-wider">
            Subscribe to Private Previews
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-md">
            Be the first to secure access to our limited-edition capsule collections, artisan restocks, and exclusive invitations to offline runway showcases.
          </p>
        </div>
        <div className="lg:col-span-7">
          <form onSubmit={handleSubscribe} className="relative max-w-lg lg:ml-auto w-full">
            <div className="flex border-b border-neutral-700 focus-within:border-white transition-colors py-1.5 items-center">
              <Mail className="w-4 h-4 text-neutral-500 shrink-0 mr-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-transparent border-none text-xs placeholder-neutral-600 text-white outline-hidden focus:ring-0 py-1"
              />
              <button
                type="submit"
                className="p-1 text-amber-500 hover:text-white transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            {isSubscribed && (
              <p className="absolute bottom-[-24px] left-0 text-[10px] text-amber-500 font-medium tracking-wide">
                Welcome to KEE! VIP Club. Access details are on their way.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* 2. Main Footer Directory Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column A: Brand Bio */}
        <div className="space-y-5">
          <div className="cursor-pointer" onClick={() => onNavigate('home')}>
            <img
              src="/assets/logo.jpeg"
              alt="KEE! Luxury"
              width="120"
              height="32"
              referrerPolicy="no-referrer"
              className="h-8 w-auto object-contain py-0.5"
            />
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
            KEE! represents the zenith of modern handcrafted luxury women's attire. Each curve, hemline, and embroidery stitch is conceptualized to deliver supreme dignity, grace, and confidence.
          </p>
          <div className="space-y-3.5 text-xs pt-2">
            <a
              href="mailto:shopkeeofficial@gmail.com"
              className="flex items-center gap-2.5 text-neutral-500 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>shopkeeofficial@gmail.com</span>
            </a>
            <a
              href="https://instagram.com/kee.official__"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-neutral-500 hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>@kee.official__</span>
            </a>
            <div className="flex items-center gap-2.5 text-neutral-500">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Online Store – Namakkal, Tamil Nadu, India</span>
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => window.open('https://instagram.com/kee.official__', '_blank')}
              className="p-2 border border-neutral-900 rounded-full hover:border-neutral-700 hover:text-white transition-all text-neutral-500"
              aria-label="Instagram Link"
            >
              <Instagram className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
              className="p-2 border border-neutral-900 rounded-full hover:border-neutral-700 hover:text-white transition-all text-neutral-500"
              aria-label="WhatsApp Link"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Column B: Shop & Collections Directory */}
        <div className="space-y-4">
          <h4 className="font-sans text-xs uppercase tracking-[0.25em] text-white font-semibold">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => onNavigate('shop', 'Kurtis')}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                Kurtis
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('shop', 'Maxi Dresses')}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                Maxi Dresses
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('shop', 'Co-ord Sets')}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                Co-ord Sets
              </button>
            </li>
          </ul>
        </div>

        {/* Column C: Assistance & Guidelines */}
        <div className="space-y-4">
          <h4 className="font-sans text-xs uppercase tracking-[0.25em] text-white font-semibold">
            Customer Assistance
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                About Our Atelier
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('faq')}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                Help & FAQs
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('contact')}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                Reach Our Concierge
              </button>
            </li>
            <li>
              <button
                onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
                className="text-neutral-500 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> WhatsApp Direct Link
              </button>
            </li>
            <li className="pt-2 border-t border-neutral-900">
              <button
                onClick={() => onNavigate('admin')}
                className="text-amber-500 hover:text-amber-400 font-semibold transition-colors flex items-center gap-1.5 uppercase text-[10px] tracking-wider"
              >
                Atelier Admin Portal 🔒
              </button>
            </li>
          </ul>
        </div>

        {/* Column D: Client Policies (Required) */}
        <div className="space-y-4">
          <h4 className="font-sans text-xs uppercase tracking-[0.25em] text-white font-semibold">
            Brand Governance
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => onOpenPolicy('privacy')}
                className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 opacity-60 text-amber-500" /> Privacy Charter
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPolicy('shipping')}
                className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 opacity-60 text-amber-500" /> Shipping Guidelines
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPolicy('returns')}
                className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 opacity-60 text-amber-500" /> Refund & Cancellations
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Legal License Block */}
      <div className="bg-black py-8 border-t border-neutral-900/60 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-semibold">
            © {new Date().getFullYear()} KEE! LUXURY FASHION. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 border border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white transition-all text-xs uppercase tracking-widest font-bold flex items-center gap-1 bg-neutral-900/40"
              aria-label="Back to top"
            >
              <span>Atop</span> <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
