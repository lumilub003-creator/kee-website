export interface ColorOption {
  name: string;
  value: string; // hex code or Tailwind class name
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  collection: 'Kurtis' | 'Raw Silk Kurtis' | 'Maxi Dresses' | 'Co-ord Sets' | 'Western Wear';
  price: number; // in INR
  originalPrice?: number; // for displaying discount
  images: string[]; // array of image URLs
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  colors: ColorOption[];
  fabric: string;
  washCare: string;
  stock: number; // 0 means Sold Out
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviews: Review[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CartItem {
  product: Product;
  selectedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  selectedColor: ColorOption;
  quantity: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaView: string; // 'shop' | 'about' | 'contact' etc.
  ctaArg?: string; // collection name etc.
  isActive: boolean;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface Order {
  orderId: string;
  items: CartItem[];
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
    method: 'upi' | 'razorpay' | 'cod';
    upiRefNo: string;
    receiptName: string | null;
  };
  date: string;
  status: 'Pending' | 'Dispatched' | 'Delivered' | 'Cancelled';
  estimatedDelivery: string;
  trackingAWB?: string;
  trackingCourier?: string;
}
