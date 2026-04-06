import express from 'express';
import cors from 'cors';
import { limiter } from './shared/config/rateLimit.js';
import helmet from 'helmet';

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(helmet()); // specific origins, CDNs, frontend assets, etc can be allowed later.

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;