const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Satyam0745',
  database: 'cms'
});

// Get all criminals
router.get('/', (req, res) => {
  db.query('SELECT * FROM criminals', (err, results) => {
    if (err) {
      console.error('Error fetching criminals:', err);
      return res.status(500).json({ message: 'Error fetching criminals' });
    }
    res.json(results);
  });
});

// Add a new criminal
router.post('/', (req, res) => {
  const { name, crime, crime_date } = req.body;

  if (!name || !crime || !crime_date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO criminals (name, crime, crime_date) VALUES (?, ?, ?)';
  db.query(sql, [name.trim(), crime.trim(), crime_date], (err, result) => {
    if (err) {
      console.error('Error adding criminal:', err);
      return res.status(500).json({ message: 'Error adding criminal' });
    }
    res.status(201).json({ message: 'Criminal added successfully', id: result.insertId });
  });
});

// Delete a criminal by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM criminals WHERE criminals_id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting criminal:', err);
      return res.status(500).json({ message: 'Error deleting criminal' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Criminal not found' });
    }

    res.json({ message: 'Criminal deleted successfully' });
  });
});

module.exports = router;
