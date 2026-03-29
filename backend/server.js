import express from 'express';
import cors from 'cors';
import {createServer} from 'http';
import {Server} from 'socket.io';
import codeExecutionRoutes from './routes/codeExecution.js';
import proctoringRoutes from './routes/proctoring.js';
import quizRoutes from './routes/quiz.js';
import frameworkRoutes from './routes/framework.js';
import telemetryRoutes from './routes/telemetry.js';
import {setupSocketHandlers} from './socket/handlers.js';

const app=express();
const httpServer=createServer(app);
const FRONTEND_URL=(process.env.FRONTEND_URL||'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174').split(',').map(v => v.trim()).filter(Boolean);
const allowedOrigins=new Set(FRONTEND_URL);

const corsOptions={
  origin: (origin, callback) =>
  {
    if (!origin)
    {
      callback(null, true);
      return;
    }

    if (allowedOrigins.has(origin)||/^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))
    {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({status: 'ok'}));
app.use('/api/code-execution', codeExecutionRoutes);
app.use('/api/proctoring', proctoringRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/framework', frameworkRoutes);
app.use('/api/telemetry', telemetryRoutes);

const io=new Server(httpServer, {
  cors: {origin: FRONTEND_URL, methods: ['GET', 'POST'], credentials: true},
});
setupSocketHandlers(io);

const PORT=process.env.PORT||5000;
httpServer.listen(PORT, () =>
{
  console.log(`Backend running at http://localhost:${PORT}`);
});
