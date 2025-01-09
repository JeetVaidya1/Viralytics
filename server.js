require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');

// Express app setup
const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate Ad Text
app.post('/generate-ad', async (req, res) => {
  const { product, tone = 'professional', audience = 'general', length = 'short' } = req.body;

  const prompt = `
    Write a ${length} ad in a ${tone} tone targeting ${audience} customers.
    Highlight benefits and end with a strong call-to-action for ${product}.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });
    res.json({ ad: response.choices[0].message.content });
  } catch (err) {
    console.error('Ad Generation Error:', err.message);
    res.status(500).json({ message: 'Error generating ad.' });
  }
});

// Generate Multiple Images (Fix)
app.post('/generate-image', async (req, res) => {
  const { description, style = 'modern and cinematic', count = 3 } = req.body;

  try {
    const imageUrls = [];

    // Loop to generate multiple images
    for (let i = 0; i < count; i++) {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `${description}, ${style}, cinematic lighting, high quality.`,
        n: 1, // DALL-E 3 only supports 1 image per call
        size: '1024x1024',
      });

      // Collect the generated image URL
      imageUrls.push(response.data[0].url);
    }

    // Return multiple image URLs
    res.json({ imageUrls });
  } catch (err) {
    console.error('Image Generation Error:', err.message);
    res.status(500).json({ message: 'Error generating images.' });
  }
});


// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
