import express from 'express';
import requestLogger from './middleware/requestLogger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import itemsRouter from './routes/items.js';

const app = express();

// 1. Custom logging middleware (runs first so every request is logged)
app.use(requestLogger);

// 2. Built-in JSON body parser
app.use(express.json());

// 3. Routes
app.get('/', (req, res) => {
  res.json({
    name: 'Indie Game Backlog API',
    endpoints: [
      'GET    /api/items',
      'GET    /api/items/:id',
      'POST   /api/items',
      'DELETE /api/items/:id',
      'GET    /api/error-test  (deliberately triggers a 500)'
    ]
  });
});

app.use('/api/items', itemsRouter);

// Deliberate failure used to demonstrate the 500 handler
app.get('/api/error-test', () => {
  throw new Error('Simulated unhandled server exception');
});

// 4. Centralized error handling (must stay at the bottom)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
