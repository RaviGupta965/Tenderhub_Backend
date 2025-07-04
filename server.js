import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'
import createTenders from './routes/tender.routes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:8080', // frontend origin
  credentials: true // only needed if you're using cookies
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', createTenders);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});