const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Satyam0745',
  database: 'cms'
});

// Get all judges
router.get('/', (req, res) => {
  db.query('SELECT * FROM judges', (err, results) => {
    if (err) {
      console.error('Error fetching judges:', err);
      return res.status(500).json({ message: 'Error fetching judges' });
    }
    res.json(results);
  });
});

// Add a judge
router.post('/', (req, res) => {
  const { name, court_name, experience } = req.body;

  if (!name || !court_name || experience === undefined) {
    return res.status(400).json({ message: 'Name, court_name, and experience are required' });
  }

  const sql = 'INSERT INTO judges (name, court_name, experience) VALUES (?, ?, ?)';
  db.query(sql, [name.trim(), court_name.trim(), experience], (err, result) => {
    if (err) {
      console.error('Error adding judge:', err);
      return res.status(500).json({ message: 'Error adding judge' });
    }
    res.status(201).json({ message: 'Judge added successfully', id: result.insertId });
  });
});

// Delete a judge by ID
router.delete('/:judges_id', (req, res) => {
  const judges_id = req.params.judges_id;

  db.query('DELETE FROM judges WHERE judges_id = ?', [judges_id], (err, result) => {
    if (err) {
      console.error('Error deleting judge:', err);
      return res.status(500).json({ message: 'Error deleting judge' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Judge not found' });
    }

    res.json({ message: 'Judge deleted successfully' });
  });
});

module.exports = router;
