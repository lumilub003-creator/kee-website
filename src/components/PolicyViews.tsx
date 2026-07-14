import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface PolicyViewProps {
  onBack: () => void;
  activePolicy: 'privacy' | 'shipping' | 'returns';
}

export default function PolicyViews({ onBack, activePolicy }: PolicyViewProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-6 py-12 md:py-20"
    >
      <button
        onClick={onBack}
        className="mb-8 text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-black flex items-center gap-2 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Boutique
      </button>

      {activePolicy === 'privacy' && (
        <div id="privacy-policy" className="space-y-8 text-neutral-800">
          <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
            <div className="p-3 bg-amber-50 rounded-full text-amber-700">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-sans text-3xl font-medium tracking-tight text-neutral-950">Privacy Policy</h1>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">KEE! luxury brand standard</p>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none space-y-6 text-sm leading-relaxed">
            <p>
              At <strong>KEE!</strong> (Elegance in every thread), we prioritize the protection and confidentiality of our esteemed clientele. This Privacy Policy details how we manage personal information shared with our concierge service during custom ordering and browsing sessions.
            </p>

            <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900 mt-8">1. Information We Collect</h3>
            <p>
              When you interact with our brand, inquire about garments, or click the <em>Order on WhatsApp</em> option, we receive standard messaging details which include your mobile number, name, shipping coordinates, and order preferences.
            </p>

            <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900">2. How Your Information is Utilized</h3>
            <p>
              We process your details exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Coordinate bespoke sizing and fulfill tailored apparel orders with our tailoring atelier.</li>
              <li>Provide digital invoices and secure UPI payment verification via our WhatsApp Concierge.</li>
              <li>Arrange elite shipping and doorstep parcel deliveries.</li>
              <li>Notify you of capsule collections, VIP private previews, or restock events (only if explicitly opted-in).</li>
            </ul>

            <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900">3. Absolute Confidentiality</h3>
            <p>
              Your data is completely private. We never sell, lease, or license our customer rosters to third-party advertisers. Information is disclosed solely to verified luxury logistics operators (e.g., DHL, BlueDart) to execute flawless deliveries.
            </p>

            <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900">4. Client Security Controls</h3>
            <p>
              You maintain full authority over your data. At any moment, you can request full erasure of your order histories or contact logs by sending a direct note to our WhatsApp concierge.
            </p>
          </div>
        </div>
      )}

      {activePolicy === 'shipping' && (
        <div id="shipping-policy" className="space-y-8 text-neutral-800">
          <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
            <div className="p-3 bg-amber-50 rounded-full text-amber-700">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-sans text-3xl font-medium tracking-tight text-neutral-950">Shipping & Delivery</h1>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">Global & domestic premium logistics</p>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none space-y-6 text-sm leading-relaxed">
            <p>
              Each KEE! masterpiece is wrapped in signature linen-textured luxury packaging, layered with dust-covers, and handled with extreme care to arrive pristine at your door.
            </p>

            <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900 mt-8">1. Processing Timelines</h3>
            <p>
              As we emphasize premium artisan sewing and hand-embroidery, products marked under <em>New Arrivals</em> or <em>Best Sellers</em> are processed within <strong>24 to 48 hours</strong> of payment verification. Custom size modifications may require an additional 2-3 business days.
            </p>

            <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900">2. Shipping Timelines & Charges</h3>
            <div className="overflow-x-auto my-6">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="py-2 uppercase tracking-wider font-semibold text-neutral-900">Destination</th>
                    <th className="py-2 uppercase tracking-wider font-semibold text-neutral-900">Courier Partner</th>
                    <th className="py-2 uppercase tracking-wider font-semibold text-neutral-900">Expected Time</th>
                    <th className="py-2 uppercase tracking-wider font-semibold text-neutral-900">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-3 font-medium text-neutral-900">Metro Cities (India)</td>
                    <td className="py-3 text-neutral-500">BlueDart / Delhivery VIP</td>
                    <td className="py-3 text-neutral-500">2 - 4 Business Days</td>
                    <td className="py-3 font-medium text-amber-700">Complimentary</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-neutral-900">Rest of India</td>
                    <td className="py-3 text-neutral-500">Premium Express Air</td>
                    <td className="py-3 text-neutral-500">3 - 5 Business Days</td>
                    <td className="py-3 font-medium text-amber-700">Complimentary</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-neutral-900">International (Global)</td>
                    <td className="py-3 text-neutral-500">DHL Express / FedEx Priority</td>
                    <td className="py-3 text-neutral-500">6 - 10 Business Days</td>
                    <td className="py-3 font-medium text-neutral-900">₹1,999 (Flat Rate)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900">3. Tracking & Transit Safety</h3>
            <p>
              A high-end tracking link is shared with your registered mobile and email coordinates immediately upon dispatch. Every parcel is fully insured during transit to protect your luxury garment.
            </p>
          </div>
        </div>
      )}

      {activePolicy === 'returns' && (
        <div id="refund-policy" className="space-y-8 text-neutral-800">
          <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
            <div className="p-3 bg-amber-50 rounded-full text-amber-700">
              <RotateCcw className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-sans text-3xl font-medium tracking-tight text-neutral-950">Returns & Refunds</h1>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">Our commitment to absolute luxury satisfaction</p>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none space-y-6 text-sm leading-relaxed">
            <p>
              We want you to hold absolute adoration for your KEE! collection. If you find a size suboptimal or change your mind, we are pleased to offer a highly streamlined exchange or refund service.
            </p>

            <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900 mt-8">1. 7-Day Luxury Window</h3>
            <p>
              We welcome returns and requests for exchanges within <strong>7 calendar days</strong> of parcel receipt. The garment must remain in original, brand-new condition, with its security tags intact and accompanied by its protective fabric bags.
            </p>

            <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900">2. Quick Exchanges & UPI Refunds</h3>
            <p>
              To initiate a return or exchange:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Message our WhatsApp Concierge with your Order ID and photo of the tag.</li>
              <li>Our team will arrange a complimentary pick-up courier from your address.</li>
              <li>Once our quality team inspects the garment, your size replacement is shipped instantly.</li>
              <li>If a refund is preferred, we issue instant UPI transfers or direct bank refunds to your chosen account details.</li>
            </ol>

            <h3 className="text-base font-semibold uppercase tracking-wider text-neutral-900">3. Non-Returnable Items</h3>
            <p>
              Bespoke, custom-tailored sizes, altered garments, or pieces ordered with customized embroidery variations cannot be returned or refunded unless there is an absolute structural defect in the textile fabric.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
