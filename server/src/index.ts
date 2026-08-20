import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import campaignRoutes from './routes/campaign.routes';
import claimRoutes from './routes/claim.routes';
import { authMiddleware } from './middleware/auth.middleware';
import { globalRateLimit } from './middleware/rateLimit.middleware';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(globalRateLimit);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/claims', claimRoutes);

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
