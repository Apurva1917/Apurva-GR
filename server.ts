import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Generate Product Description for Home Cooks
app.post('/api/ai/generate-description', async (req, res) => {
  try {
    const { productName, ingredients, category, weight } = req.body;

    if (!productName || !ingredients) {
      return res.status(400).json({
        error: 'Product name and ingredients are required to generate description.',
      });
    }

    const ai = getAIClient();
    if (!ai) {
      // Fallback description if no API key
      return res.json({
        description: `Handcrafted with traditional care using ${ingredients}. Freshly prepared at home in small batches for authentic homemade taste and crispness, with zero preservatives.`,
        keyHighlights: ['100% Homemade', 'Small Batch Prepared', 'Zero Preservatives'],
      });
    }

    const prompt = `
You are helping an Indian homemaker or home cook create an appetizing, warm, and natural product description for their homemade food item on GharSe, a hyperlocal marketplace.

Product Name: ${productName}
Category: ${category || 'Homemade Food'}
Ingredients: ${ingredients}
Portion/Weight: ${weight || 'Fresh batch'}

Instructions:
1. Write a short, appetizing, natural food description (2 to 3 sentences, roughly 40-70 words).
2. Emphasize home-style preparation, authentic family recipe, fresh preparation today, and zero artificial preservatives.
3. Keep the tone warm, welcoming, and grounded in Indian home kitchen traditions.
4. STRICT RULE: DO NOT generate unsupported health, medicinal, or therapeutic claims (e.g. do NOT claim it cures diabetes, burns fat, boosts immunity miraculously, or heals illnesses).
5. Also provide 3 short catchy highlight tags (e.g., "Stone-ground spices", "Hand-rolled with love", "Pure cold-pressed oil").
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: 'Appetizing, natural 2-3 sentence description of the homemade dish.',
            },
            keyHighlights: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: '3 short highlight tags.',
            },
          },
          required: ['description', 'keyHighlights'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating description with Gemini:', error);
    return res.status(500).json({
      error: 'Failed to generate description with AI.',
      details: error.message,
    });
  }
});

// API: AI Listing Check (Audit listing completeness and safety)
app.post('/api/ai/audit-listing', async (req, res) => {
  try {
    const { name, category, description, ingredients, allergens, price, quantity, weight, prepDate } = req.body;

    const ai = getAIClient();
    if (!ai) {
      // Rule-based fallback if AI is not configured
      const missing: string[] = [];
      if (!name) missing.push('Product name');
      if (!ingredients) missing.push('Ingredients');
      if (!price) missing.push('Price');
      if (!quantity) missing.push('Quantity');
      if (!allergens) missing.push('Allergen information');
      if (!prepDate) missing.push('Preparation date');
      if (!description) missing.push('Product description');

      return res.json({
        score: Math.max(20, 100 - missing.length * 15),
        isReadyToPublish: missing.length === 0,
        missingFields: missing,
        feedback: missing.length === 0
          ? 'Excellent! Your homemade listing includes all essential customer safety and freshness details.'
          : `You still need to fill in ${missing.join(', ')} to give nearby customers full transparency.`,
        checklist: [
          { field: 'Product Name', status: name ? 'complete' : 'missing', note: name ? 'Clear name provided' : 'Add dish name' },
          { field: 'Ingredients', status: ingredients ? 'complete' : 'missing', note: ingredients ? 'Ingredients listed' : 'List all raw ingredients' },
          { field: 'Price', status: price ? 'complete' : 'missing', note: price ? `₹${price}` : 'Specify price per pack' },
          { field: 'Quantity Available', status: quantity ? 'complete' : 'missing', note: quantity ? `${quantity} packs` : 'Specify available batch size' },
          { field: 'Allergen Information', status: allergens ? 'complete' : 'missing', note: allergens ? allergens : 'Mention nuts, gluten, dairy or "No common allergens"' },
          { field: 'Preparation Date & Time', status: prepDate ? 'complete' : 'missing', note: prepDate ? prepDate : 'Add when this batch is prepared' },
          { field: 'Product Description', status: description ? 'complete' : 'missing', note: description ? 'Description present' : 'Describe the homemade taste' },
        ],
      });
    }

    const auditPrompt = `
You are the AI Quality & Transparency Assistant for GharSe, an Indian homemade food marketplace.
Review the following product listing submitted by a home cook:

Listing Data:
- Product Name: ${name || '[NOT PROVIDED]'}
- Category: ${category || '[NOT PROVIDED]'}
- Description: ${description || '[NOT PROVIDED]'}
- Ingredients: ${ingredients || '[NOT PROVIDED]'}
- Allergen Information: ${allergens || '[NOT PROVIDED]'}
- Price (INR): ${price ? '₹' + price : '[NOT PROVIDED]'}
- Quantity Available: ${quantity || '[NOT PROVIDED]'}
- Weight/Pack size: ${weight || '[NOT PROVIDED]'}
- Preparation Date: ${prepDate || '[NOT PROVIDED]'}

Requirements to evaluate:
Identify if any of these specific mandatory fields are missing:
1. ingredients
2. price
3. quantity
4. allergen information (e.g. nuts, dairy, gluten, or explicitly "None")
5. preparation date (when it was made or being prepared today)
6. product description

Also check:
- Ensure there are NO unsupported health or medical claims (e.g. no claims of curing illnesses).
- Calculate a readiness score from 0 to 100.
- Provide warm, constructive suggestions for the home cook.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: auditPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: 'Readiness score from 0 to 100.',
            },
            isReadyToPublish: {
              type: Type.BOOLEAN,
              description: 'True if all 6 core fields are sufficiently populated.',
            },
            missingFields: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exact list of missing mandatory fields from: ingredients, price, quantity, allergen information, preparation date, product description.',
            },
            feedback: {
              type: Type.STRING,
              description: 'Warm and encouraging review summary tailored for Indian homemakers.',
            },
            checklist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  field: { type: Type.STRING },
                  status: { type: Type.STRING, description: 'complete, missing, or needs_improvement' },
                  note: { type: Type.STRING },
                },
                required: ['field', 'status', 'note'],
              },
            },
          },
          required: ['score', 'isReadyToPublish', 'missingFields', 'feedback', 'checklist'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error auditing listing with Gemini:', error);
    return res.status(500).json({
      error: 'Failed to audit listing with AI.',
      details: error.message,
    });
  }
});

// Setup Vite or static serving
const startServer = async () => {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GharSe server running on http://0.0.0.0:${PORT}`);
  });
};

startServer();
