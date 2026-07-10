import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { groupsRouter } from './routes/groups';

const PORT = Number(process.env.PORT ?? 4100);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/groups', groupsRouter);

app.listen(PORT, () => {
  console.log(`KineticPeak server listening on port ${PORT}`);
});
