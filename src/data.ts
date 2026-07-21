import { Product, FAQItem, Banner } from './types';

export const IMAGES = {
  hero: '/src/assets/images/raw_silk_hero_1783959059618.jpg',
  kurtis: '/src/assets/images/raw_silk_hero_1783959059618.jpg',
  maxis: '/src/assets/images/raw_silk_hero_1783959059618.jpg',
  coords: '/src/assets/images/raw_silk_hero_1783959059618.jpg',
};

export const COLLECTIONS = [
  {
    id: 'kurtis',
    name: 'Kurtis',
    tagline: 'Imperial Slub & Raw Silk',
    description: 'Expertly tailored straight-cut and A-line kurtis featuring traditional handloom raw silk, detailed with exquisite zari borders and hand-embroidery.',
    image: IMAGES.kurtis,
    path: '/collections/kurtis'
  },
  {
    id: 'maxis',
    name: 'Maxi Dresses',
    tagline: 'Sartorial Flow & Grandeur',
    description: 'Spectacular, floor-sweeping silhouettes made with heavy-gauge premium raw silk that drapes with weight and royal majesty.',
    image: IMAGES.maxis,
    path: '/collections/maxi-dresses'
  },
  {
    id: 'coords',
    name: 'Co-ord Sets',
    tagline: 'Modern Atelier Tailoring',
    description: 'Clean-lined, matching tunic and trouser ensembles tailored from crisp raw silk, perfect for the modern elite Indian woman.',
    image: IMAGES.coords,
    path: '/collections/co-ord-sets'
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'THE RAW SILK COUTURE EDITION',
    subtitle: 'Rich textures. Regal drapes. Masterfully tailored raw silk ensembles for the modern Indian connoisseur.',
    image: IMAGES.hero,
    ctaText: 'Explore Collection',
    ctaView: 'shop',
    isActive: true
  },
  {
    id: 'banner-2',
    title: 'ELEGANCE IN EVERY THREAD',
    subtitle: 'Bespoke tailoring, custom hand-guided embroidery, and premium heritage natural fibers.',
    image: IMAGES.kurtis,
    ctaText: 'View Royal Kurtis',
    ctaView: 'shop',
    ctaArg: 'Kurtis',
    isActive: true
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'KEE-RS01',
    name: 'Royal Emerald Hand-Embroidered Raw Silk Kurti',
    tagline: 'Gilded motifs on pristine natural slub silk',
    collection: 'Kurtis',
    price: 4899,
    originalPrice: 5999,
    images: [
      IMAGES.kurtis,
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Imperial Emerald', value: '#0F52BA' },
      { name: 'Royal Gold', value: '#D4AF37' }
    ],
    fabric: '100% Premium Pure Raw Silk with fine cotton-malmal inner lining for sweat-free breathing comfort.',
    washCare: 'Dry Clean Only. Steam iron gently inside out. Store in muslin bags to protect natural slub fibers.',
    stock: 12,
    description: 'Bask in premium luxury with our signature Emerald Raw Silk Kurti. Adorned with delicate, hand-guided gold Zardosi embroidery around the split neckline and cuffs. Features a highly refined straight-cut profile that complements all body frames with absolute poise.',
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviews: [
      {
        id: 'rev-1',
        author: 'Priyah R. Iyer',
        rating: 5,
        date: '2026-07-01',
        comment: 'The slub raw silk texture is incredibly rich and premium. Drapes with a heavy weight that looks very regal!'
      },
      {
        id: 'rev-2',
        author: 'Meera Shah',
        rating: 5,
        date: '2026-07-05',
        comment: 'I requested a minor size modification over WhatsApp and the concierge team was super accommodating. Best luxury service in India.'
      }
    ]
  },
  {
    id: 'KEE-RS02',
    name: 'Gilded Amber Ivory Raw Silk Kurti',
    tagline: 'Timeless handloom heritage in pristine ivory',
    collection: 'Kurtis',
    price: 4599,
    images: [
      IMAGES.maxis,
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Ivory Gold', value: '#F9F6EE' },
      { name: 'Sand Beige', value: '#E5D3B3' }
    ],
    fabric: 'Fine slub Chanderi Raw Silk blend with premium gold-weave borders.',
    washCare: 'Dry Clean Only. Hand press under damp cloth on low heat.',
    stock: 8,
    description: 'A magnificent blend of ivory raw silk slub texture and heritage Indian detailing. Detailed with subtle golden vertical pintucks and heavy silk borders, giving you a slender, dignified, and incredibly elegant presence.',
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviews: [
      {
        id: 'rev-3',
        author: 'Anjali Deshmukh',
        rating: 5,
        date: '2026-06-15',
        comment: 'Beautiful ivory shade, matches perfectly with gold jewelry. Fabric feels extremely high-end!'
      }
    ]
  },
  {
    id: 'KEE-RS03',
    name: 'Maharani Gold Zari Raw Silk Maxi',
    tagline: 'A breathtaking floor-sweeping modern masterpiece',
    collection: 'Maxi Dresses',
    price: 7299,
    originalPrice: 8499,
    images: [
      IMAGES.maxis,
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Champagne Ivory', value: '#F4EAE1' },
      { name: 'Antique Gold', value: '#C5A059' }
    ],
    fabric: 'Heavyweight handloom mulberry raw silk with pure zari woven borders.',
    washCare: 'Dry Clean Only. Professional steam finish recommended.',
    stock: 5,
    description: 'Command immediate attention in our Maharani Maxi Dress. Crafted from heavy-gauge luxury raw silk, this dress exhibits an elegant, fluid flare that catches the light beautifully with your gait. Adorned with delicate gold zari embroidery on the waist and shoulder drapes.',
    isNew: true,
    isBestSeller: true,
    rating: 5.0,
    reviews: [
      {
        id: 'rev-4',
        author: 'Dr. Shalini Mehta',
        rating: 5,
        date: '2026-07-08',
        comment: 'This is high fashion at its peak. The drape behavior is pure luxury. Perfect for a grand reception!'
      }
    ]
  },
  {
    id: 'KEE-RS04',
    name: 'Deep Crimson Royal Raw Silk Maxi',
    tagline: 'Vibrant majesty in classic Indian hues',
    collection: 'Maxi Dresses',
    price: 6899,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Crimson Pink', value: '#990F02' },
      { name: 'Vermilion Red', value: '#E34234' }
    ],
    fabric: 'Premium Bhagalpuri Raw Silk slub with fine cotton lining.',
    washCare: 'Dry Clean Only. Keep away from direct perfumes.',
    stock: 0, // SOLD OUT BADGE TEST
    description: 'Inspired by royal heritage courtyards, this crimson maxi dress features a modern, structured high collar, elegant front button detailing with handcrafted potli buttons, and a tiered flared skirt.',
    isNew: false,
    isBestSeller: false,
    rating: 4.7,
    reviews: [
      {
        id: 'rev-5',
        author: 'Devika S.',
        rating: 4,
        date: '2026-06-20',
        comment: 'Stunning but sold out before I could get a second size for my cousin! Please bring back stock quickly.'
      }
    ]
  },
  {
    id: 'KEE-RS05',
    name: 'Avant-Garde Emerald Tailored Co-ord Set',
    tagline: 'Modern architectural silhouettes in raw silk',
    collection: 'Co-ord Sets',
    price: 6499,
    originalPrice: 7299,
    images: [
      IMAGES.coords,
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Emerald Forest', value: '#0A5C36' },
      { name: 'Rich Charcoal', value: '#1E1E1E' }
    ],
    fabric: 'Supreme Royal Gaji Raw Silk with premium brass-coated metal buttons.',
    washCare: 'Dry Clean Only. Hand-iron on medium setting inside out.',
    stock: 7,
    description: 'An immaculate pairing of contemporary fashion and heritage raw silk. This high-end co-ord set features an asymmetrical overlapping tunic top with structured shoulders and sleek, wide-legged tailored trousers.',
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviews: [
      {
        id: 'rev-6',
        author: 'Gayatri Sen',
        rating: 5,
        date: '2026-07-09',
        comment: 'Absolutely immaculate fit. The trousers have pockets too! It has a gorgeous understated golden sheen.'
      }
    ]
  },
  {
    id: 'KEE-RS06',
    name: 'Atelier Royal Amethyst Co-ord Set',
    tagline: 'Crisp slub raw silk for effortless elegance',
    collection: 'Co-ord Sets',
    price: 5999,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Royal Amethyst', value: '#4B0082' },
      { name: 'Liquid Ochre', value: '#CC7722' }
    ],
    fabric: '100% Traditional Handloom Slub Raw Silk',
    washCare: 'Dry Clean Only. Flat dry in shade.',
    stock: 3,
    description: 'Exude effortless prestige in our Atelier Amethyst Lounge Set. Features a crisp, high-standing collar, tailored sleeve cuffs with custom gold piping, and wide-leg trousers. Designed to keep its majestic, structured silhouette throughout the day.',
    isNew: false,
    isBestSeller: false,
    rating: 4.6,
    reviews: []
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'How do I place an order with KEE!?',
    answer: 'Browse our luxurious raw silk collections, select your desired color and size, and click on "Order on WhatsApp". This opens WhatsApp immediately with a pre-filled message outlining your selection. Our VIP concierge team will immediately guide you through sizing confirmation and secure dispatch.'
  },
  {
    question: 'What payment options do you support?',
    answer: 'To ensure maximum trust and bespoke security, we currently support direct UPI payments (GPay, PhonePe, Paytm), Net Banking, and Bank Transfers. Simply share your confirmation on WhatsApp, and our team will guide you. We are fully prepared for card-based online payment gateways (including Razorpay) and Cash on Delivery (COD) which will be activated in our next release.'
  },
  {
    question: 'How do I determine my correct raw silk size?',
    answer: 'Raw silk has a beautiful, rich body but does not stretch. We provide an exact premium size guide from XS to XXL. If you are between sizes, we recommend sizing up, or asking our WhatsApp concierge for a custom tailored fit at no extra charge.'
  },
  {
    question: 'Do you offer custom tailoring / bespoke adjustments?',
    answer: 'Yes, absolutely. Since we are a high-fashion atelier, our design concierge can make custom modifications (e.g. kurti length, sleeve variations, waist cinch adjustments) specifically for your order. Simply initiate your order via WhatsApp.'
  },
  {
    question: 'Can I connect a custom domain like keeofficial.in?',
    answer: 'Yes! KEE! has been built with an adaptable relative-path architecture. Pointing your domain keeofficial.in to our Cloud Run container via your domain provider DNS settings will connect it immediately without requiring you to compile or rebuild any files.'
  }
];

export const INSTAGRAM_POSTS = [
  { id: 'insta-1', image: IMAGES.hero, likes: '3.4k' },
  { id: 'insta-2', image: IMAGES.kurtis, likes: '2.8k' },
  { id: 'insta-3', image: IMAGES.maxis, likes: '4.1k' },
  { id: 'insta-4', image: IMAGES.coords, likes: '3.9k' },
  { id: 'insta-5', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80', likes: '5.2k' },
  { id: 'insta-6', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80', likes: '3.7k' }
];

export const REVIEWS = [
  {
    id: 'r-1',
    name: 'Gayatri Sen',
    location: 'Mumbai, MH',
    rating: 5,
    text: 'KEE! has redefined raw silk luxury. The Emerald Kurti drapes with a heavy weight and gold zari detail that looks incredibly grand. Beautiful craftsmanship.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    id: 'r-2',
    name: 'Dr. Shalini Mehta',
    location: 'New Delhi, DL',
    rating: 5,
    text: 'The co-ord sets fit like a glove! Their natural raw silk is pure indulgence. True to their slogan, "Elegance in every thread" indeed.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    id: 'r-3',
    name: 'Anjali Deshmukh',
    location: 'Bangalore, KA',
    rating: 5,
    text: 'Stunning champagne maxi dress. Ordered on WhatsApp and they verified my measurements first. Impeccable designer hospitality!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
  }
];
