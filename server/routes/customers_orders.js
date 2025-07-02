const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const pool = require('../routes/db');

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'e-commerce-db1',
// });

router.get('/', (req, res) => {
  db.query('SELECT customer_id, customer_name FROM customers', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
