const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../routes/db');

// Middleware to verify JWT token
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

// GET /api/feedback - fetch paginated + filtered feedback
router.get('/', authenticateToken, async (req, res) => {
  const { store_id, user_type } = req.user;
  if (user_type !== 'shop_owner') return res.status(403).json({ message: 'Access denied' });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const rating = req.query.rating;
  const search = req.query.search?.toLowerCase();

  // Base query
  let baseWhere = 'WHERE f.store_id = ?';
  const values = [store_id];

  if (rating && rating !== 'all') {
    baseWhere += ' AND f.rating = ?';
    values.push(parseInt(rating));
  }

  if (search) {
    baseWhere += ` AND (
      LOWER(c.customer_name) LIKE ? OR
      LOWER(p.product_name) LIKE ? OR
      LOWER(f.review_description) LIKE ?
    )`;
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  try {
    // Total count query
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM feedback f
      JOIN customers c ON f.customer_id = c.customer_id
      JOIN products p ON f.product_id = p.product_id
      ${baseWhere}
    `;
    const [countRows] = await pool.query(countQuery, values);
    const total = countRows[0].total;

    // Main data query
    const dataQuery = `
      SELECT f.feedback_id, f.review_date, f.rating, f.review_description,
             c.customer_name, p.product_name
      FROM feedback f
      JOIN customers c ON f.customer_id = c.customer_id
      JOIN products p ON f.product_id = p.product_id
      ${baseWhere}
      ORDER BY f.review_date DESC
      LIMIT ? OFFSET ?
    `;
    const [dataRows] = await pool.query(dataQuery, [...values, limit, offset]);

    res.json({
      total,
      page,
      pageSize: limit,
      feedbacks: dataRows
    });
  } catch (err) {
    console.error('❌ Feedback route error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
