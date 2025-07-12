const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../routes/db');

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// GET /api/feedback - fetch paginated feedback with optional rating filter and search
router.get('/', authenticateToken, (req, res) => {
  const { store_id, user_type } = req.user;
  if (user_type !== 'shop_owner') return res.status(403).json({ message: 'Access denied' });

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const ratingFilter = req.query.rating ? parseInt(req.query.rating) : null;
  const search = req.query.search ? `%${req.query.search.toLowerCase()}%` : null;

  let countSql = `SELECT COUNT(*) AS total FROM feedback f
                  JOIN customers c ON f.customer_id = c.customer_id
                  JOIN products p ON f.product_id = p.product_id
                  WHERE f.store_id = ?`;
  let dataSql = `
    SELECT f.feedback_id, f.review_date, f.rating, f.review_description,
           c.customer_name, p.product_name
    FROM feedback f
    JOIN customers c ON f.customer_id = c.customer_id
    JOIN products p ON f.product_id = p.product_id
    WHERE f.store_id = ?`;

  const params = [store_id];

  if (ratingFilter) {
    countSql += ` AND f.rating = ?`;
    dataSql += ` AND f.rating = ?`;
    params.push(ratingFilter);
  }

  if (search) {
    countSql += ` AND (LOWER(c.customer_name) LIKE ? OR LOWER(p.product_name) LIKE ? OR LOWER(f.review_description) LIKE ?)`;
    dataSql += ` AND (LOWER(c.customer_name) LIKE ? OR LOWER(p.product_name) LIKE ? OR LOWER(f.review_description) LIKE ?)`;
    params.push(search, search, search);
  }

  dataSql += ` ORDER BY f.review_date DESC LIMIT ? OFFSET ?`;
  params.push(pageSize, offset);

  // Get total count for pagination
  pool.query(countSql, params.slice(0, params.length - 2), (countErr, countResult) => {
    if (countErr) {
      console.error('❌ Error fetching count:', countErr);
      return res.status(500).json({ error: 'Error fetching feedback count' });
    }

    const total = countResult[0].total;

    // Get actual paginated data
    pool.query(dataSql, params, (err, results) => {
      if (err) {
        console.error('❌ Error fetching feedback:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({
        total,
        page,
        pageSize,
        feedbacks: results
      });
    });
  });
});

module.exports = router;
