import express from 'express';
import axios from 'axios';

const router = express.Router();

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Generating image for prompt: ${prompt}`);

    // Send request to Hugging Face API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer', // To receive binary image data
      }
    );

    // Check if response is HTML (indicating an error)
    const isHTML = (data) => {
      return data.toString().startsWith('<');
    };

    if (isHTML(response.data)) {
      throw new Error('Hugging Face returned an HTML response – check the API key or model status.');
    }

    // Convert binary data to Base64
    const image = Buffer.from(response.data).toString('base64');
  res.status(200).json({ photo: `data:image/png;base64,${image}` });
  
  } catch (error) {
    console.error('Error generating image:', error.message);

    if (error.response) {
      console.error('Full Error Response:', error.response.data);
      res.status(error.response.status).json({
        error: error.response.data.error || 'Failed to generate image',
      });
    } else {
      res.status(500).json({ error: 'Failed to generate image' });
    }
  }
});

export default router;
