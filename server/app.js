const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// ---- Security & parsing middleware ----
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ---- CORS configuration ----
// CLIENT_URL may contain a comma-separated list of allowed origins
// (e.g. local dev server + deployed Vercel URL).
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ---- Rate limiting on auth routes to mitigate brute force ----
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/auth', authLimiter);

// ---- Health check (useful for Render) ----
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'PennyPath API is running', timestamp: new Date().toISOString() });
});

// ---- API Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/reports', reportRoutes);

// ---- Error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
