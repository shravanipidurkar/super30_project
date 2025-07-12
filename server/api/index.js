// const app = require('../server');
// module.exports = app;
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productsRoute = require('./routes/products');
const customerRoute = require('./routes/customers');
const ordersRoute = require('./routes/orders');
const customerORoute = require('./routes/customers_orders');
const authRoute = require('./routes/auth');
const feedbackRoute = require('./routes/feedback');
const statisticsRoutes = require('./routes/statistics');
const overview = require('./routes/overview');
const stores_backup = require('./routes/stores_backup');
const customerAuthRoutes = require('./routes/cus_auth');

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  'https://super30-project-ob5u.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests (OPTIONS) globally
app.options('*', cors(corsOptions));

// ✅ Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/api/products', productsRoute);
app.use('/api/customers', customerRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/customers_orders', customerORoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/auth', authRoute);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/overview', overview);
app.use('/api/customer/auth', customerAuthRoutes);
app.use('/api', stores_backup);

// ✅ Run locally only
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// ✅ Export app for Vercel
module.exports = app;
