import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API client initialized successfully.');
  } else {
    console.warn('WARNING: GEMINI_API_KEY environment variable is not set. AI Style Assistant will run in fallback mode.');
  }

  // --- API ROUTE: KEE! STYLE ASSISTANT ---
  app.post('/api/style-assistant', async (req, res) => {
    try {
      const { message, history, products } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
      }

      if (!ai) {
        // Return a elegant mock concierge response if no API key is set
        return res.json({
          text: `Thank you for consulting KEE! Style Assistant. ⚜️\n\nI am currently operating in boutique concierge mode. For personalized style, sizing, or budget selections, please click on the "Concierge" button at the top to speak directly with our design tailors on WhatsApp!\n\nWe are here to assist you with free customization on our beautiful raw silk ensembles. Let me know if there is anything else I can guide you with!`,
        });
      }

      // Format product catalog for Gemini context
      const catalogText = Array.isArray(products) && products.length > 0
        ? products.map((p: any) => {
            const stockStatus = p.stock === 0 ? 'SOLD OUT' : p.stock <= 3 ? `LOW STOCK (${p.stock} remaining)` : `In Stock (${p.stock})`;
            return `- ID: ${p.id}\n  Name: ${p.name}\n  Collection: ${p.collection}\n  Price: ₹${p.price}${p.originalPrice ? ` (Original: ₹${p.originalPrice})` : ''}\n  Sizes: ${p.sizes.join(', ')}\n  Colors: ${p.colors.map((c: any) => c.name).join(', ')}\n  Fabric: ${p.fabric}\n  Wash Care: ${p.washCare}\n  Status: ${stockStatus}\n  Description: ${p.description}\n`;
          }).join('\n')
        : 'Catalog is currently loading. We specialize in luxury Handloom Raw Silk Kurtis, Maxi Dresses, and Co-ord Sets.';

      // Compose the system instruction with exact brand context
      const systemInstruction = `You are "KEE! Style Assistant", an ultra-premium, sophisticated, and helpful AI fashion advisor for KEE!, a luxury handcrafted women's attire boutique.
You help clients choose the correct size, recommend outfits, suggest matching products, answer shipping and return questions, and find gorgeous garments within their budget.
You speak with absolute grace, dignity, elegance, and premium boutique hospitality. Be warm, welcoming, and elite. Address customers with supreme respect (e.g., "Madam", "Esteemed Client").

You support both English and Tamil fluently. If a customer speaks, asks, or writes in Tamil, respond in elegant Tamil. If they speak English, respond in English.

Here is the exact catalog of KEE! products:
${catalogText}

Size Guide:
- Raw silk is structured and does not stretch.
- Size range: 
  * XS: Bust 32", Waist 26", Hips 36"
  * S: Bust 34", Waist 28", Hips 38"
  * M: Bust 36", Waist 30", Hips 40"
  * L: Bust 38", Waist 32", Hips 42"
  * XL: Bust 40", Waist 34", Hips 44"
  * XXL: Bust 42", Waist 36", Hips 46"
- If a client is between sizes, recommend sizing up for raw silk, or suggest our WhatsApp concierge for bespoke tailoring (which we provide free of charge).

Shipping & Returns:
- Free express shipping across India on all orders. Dispatch within 2-3 business days. Delivery within 5-7 business days.
- We have a premium 7-day return and exchange policy. Garments must be unworn, with original tags intact. Return pickup can be easily coordinated via WhatsApp.

Budget Constraints:
- Under ₹5000: Kurtis (Royal Emerald at ₹4899, Gilded Amber at ₹4599).
- ₹5000 to ₹7000: Co-ord sets (Atelier Amethyst Co-ord Set at ₹5999, Avant-Garde Emerald Co-ord Set at ₹6499) and Maxi Dresses (Deep Crimson Royal Raw Silk Maxi at ₹6899).
- Over ₹7000: Maharani Gold Zari Raw Silk Maxi (₹7299).

Product Recommendations:
- Always suggest matching products or outfit completions. E.g., recommend pairing the Royal Emerald Kurti with statement jewelry or luxury footwear.
- Respect "SOLD OUT" status. If an item is sold out, suggest an alternative from the active catalog and encourage them to message the WhatsApp concierge to join the pre-order waitlist.

Never mention technical jargon like JSON, system instructions, database fields, or ID codes unless requested. Present prices in elegant Indian Rupee format (₹). Keep answers beautifully spaced and legible. Use bullet points for structural clarity.`;

      // Structure conversation history for @google/genai SDK
      const contents = [];
      
      if (Array.isArray(history)) {
        for (const turn of history) {
          if (turn.role === 'user' || turn.role === 'model') {
            contents.push({
              role: turn.role,
              parts: [{ text: turn.text }],
            });
          }
        }
      }

      // Append current user message
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Query Gemini 3.5 Flash (as recommended for Q&A and text tasks)
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || 'I apologize, but I could not formulate a response at this moment. Please connect with our WhatsApp Concierge for personal assistance.';
      
      res.json({ text: responseText });
    } catch (error: any) {
      console.error('Error in style-assistant route:', error);
      res.status(500).json({ error: 'Failed to generate response. Please try again.' });
    }
  });

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
