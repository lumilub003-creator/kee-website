import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SizeChartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeChart({ isOpen, onClose }: SizeChartProps) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const measurements = [
    { size: 'XS', bust: { in: '32', cm: '81' }, waist: { in: '25', cm: '64' }, hips: { in: '35', cm: '89' }, length: { in: '44', cm: '112' } },
    { size: 'S', bust: { in: '34', cm: '86' }, waist: { in: '27', cm: '69' }, hips: { in: '37', cm: '94' }, length: { in: '44.5', cm: '113' } },
    { size: 'M', bust: { in: '36', cm: '91' }, waist: { in: '29', cm: '74' }, hips: { in: '39', cm: '99' }, length: { in: '45', cm: '114' } },
    { size: 'L', bust: { in: '38', cm: '97' }, waist: { in: '31', cm: '79' }, hips: { in: '41', cm: '104' }, length: { in: '45.5', cm: '115' } },
    { size: 'XL', bust: { in: '40', cm: '102' }, waist: { in: '33', cm: '84' }, hips: { in: '43', cm: '109' }, length: { in: '46', cm: '117' } },
    { size: 'XXL', bust: { in: '42', cm: '107' }, waist: { in: '35', cm: '89' }, hips: { in: '45', cm: '114' }, length: { in: '46', cm: '117' } }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl bg-[#FAF9F6] text-neutral-900 p-6 md:p-8 rounded-none border border-neutral-200/60 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black transition-colors"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Atelier Guideline</span>
              <h2 className="font-sans text-2xl font-light tracking-[0.1em] text-neutral-900 mt-1 uppercase">KEE! Size Guide</h2>
              <div className="w-12 h-[1px] bg-amber-600/60 mx-auto mt-3" />
            </div>

            {/* Selector */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-neutral-100 p-1 border border-neutral-200/40">
                <button
                  onClick={() => setUnit('in')}
                  className={`px-4 py-1.5 text-xs uppercase tracking-wider transition-all duration-300 ${
                    unit === 'in' ? 'bg-black text-white shadow' : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-4 py-1.5 text-xs uppercase tracking-wider transition-all duration-300 ${
                    unit === 'cm' ? 'bg-black text-white shadow' : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            {/* Grid/Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-widest text-neutral-500 text-left">Size</th>
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Bust</th>
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Waist</th>
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Hips</th>
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Standard Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/75">
                  {measurements.map((m) => (
                    <tr key={m.size} className="hover:bg-neutral-100/50 transition-colors">
                      <td className="py-4 px-4 text-sm font-semibold text-neutral-950 text-left">{m.size}</td>
                      <td className="py-4 px-4 text-sm text-neutral-600">{unit === 'in' ? m.bust.in : m.bust.cm}</td>
                      <td className="py-4 px-4 text-sm text-neutral-600">{unit === 'in' ? m.waist.in : m.waist.cm}</td>
                      <td className="py-4 px-4 text-sm text-neutral-600">{unit === 'in' ? m.hips.in : m.hips.cm}</td>
                      <td className="py-4 px-4 text-sm text-neutral-600">{unit === 'in' ? m.length.in : m.length.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note */}
            <div className="mt-8 bg-neutral-50 border-l-2 border-amber-500/80 p-4">
              <p className="text-xs leading-relaxed text-neutral-600">
                <strong className="text-neutral-800 uppercase tracking-wide text-[10px] block mb-1">Tailor Note:</strong>
                Each KEE! garment is individually stitched by our handloom master weavers. Subtle 0.5-inch variances are normal and reflect the hand-crafted luxury nature of the dress. For custom fits, our WhatsApp concierge will assist with bespoke sizing.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
