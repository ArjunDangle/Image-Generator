import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type'],
  }));
  
app.use(express.json({limit : '50mb' }));

// Define routes after CORS
app.use('/api/v1/post', postRoutes)
app.use('/api/v1/huggingface', dalleRoutes)

app.get('/', async(req, res) => {
    res.send('Hello from Dall-E!');
});

const startServer = async() =>{
    try {
        connectDB(process.env.MONGODB_URI);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
          })
    } catch (error) {
        console.log(error);
    }
}

startServer();
