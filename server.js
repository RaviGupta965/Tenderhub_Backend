import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'
import createTenders from './routes/tender.routes.js'
import application from './routes/application.routes.js'
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:8080",
  "https://tenderhub-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', createTenders);
app.use('/api/application', application);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});