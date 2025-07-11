const express = require('express');
const router = express.Router();
const db = require('../database'); // Make sure this path is correct

// POST - Add new victim
router.post('/', (req, res) => {
  const { name, city, state, mobile, incident_date } = req.body;

  // Basic validation
  if (!name || !name.trim() || !incident_date) {
    return res.status(400).json({ message: 'Name and incident date are required' });
  }

  const sql = 'INSERT INTO victims (name, city, state, mobile, incident_date) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name.trim(), city || null, state || null, mobile || null, incident_date], (err, result) => {
    if (err) {
      console.error('Error inserting victim:', err);
      return res.status(500).json({ message: 'Error saving victim' });
    }
    res.status(201).json({ message: 'Victim added successfully', id: result.insertId });
  });
});

module.exports = router;
