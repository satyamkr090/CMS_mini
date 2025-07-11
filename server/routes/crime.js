const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust path if necessary

// Get all crimes with joined info (works even if no crime is recorded yet)
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      criminals.criminals_id AS criminal_id,
      criminals.name AS criminal_name,
      criminals.crime,
      criminals.crime_date,
      crimes.crimes_id AS crime_id,
      crimes.crime_type,
      crimes.description,
      crimes.judgement_date,
      judges.name AS judge_name,
      judges.court_name,
      judges.experience
    FROM criminals
    LEFT JOIN crimes ON criminals.criminals_id = crimes.criminal_id
    LEFT JOIN judges ON crimes.judge_id = judges.judges_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching crimes:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Search crimes by criminal name or ID
router.get('/search', (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  const isNumeric = /^\d+$/.test(query);

  const sql = `
    SELECT 
      criminals.criminals_id AS criminal_id,
      criminals.name AS criminal_name,
      criminals.crime,
      criminals.crime_date,
      crimes.crimes_id AS crime_id,
      crimes.crime_type,
      crimes.description,
      crimes.judgement_date,
      judges.name AS judge_name,
      judges.court_name,
      judges.experience
    FROM criminals
    LEFT JOIN crimes ON criminals.criminals_id = crimes.criminal_id
    LEFT JOIN judges ON crimes.judge_id = judges.judges_id
    WHERE ${isNumeric ? 'criminals.criminals_id = ?' : 'criminals.name LIKE ?'}
  `;

  const params = isNumeric ? [query] : [`%${query}%`];

  console.log("Search query received:", query);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error during crime search:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      console.log(`No records found for query: ${query}`);
      return res.json([]);
    }

    res.json(results);
  });
});

// Add new crime
router.post('/add', (req, res) => {
  const { criminal_id, judge_id, victim_id, crime_type, description, judgement_date } = req.body;
  const sql = `
    INSERT INTO crimes (criminal_id, judge_id, victim_id, crime_type, description, judgement_date) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [criminal_id, judge_id, victim_id, crime_type, description, judgement_date], (err, result) => {
    if (err) {
      console.error('Error adding crime:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Crime added successfully', crimeId: result.insertId });
  });
});

// Update crime by crimes_id
router.put('/update/:crimes_id', (req, res) => {
  const { crimes_id } = req.params;
  const { criminal_id, judge_id, victim_id, crime_type, description, judgement_date } = req.body;
  const sql = `
    UPDATE crimes 
    SET criminal_id = ?, judge_id = ?, victim_id = ?, crime_type = ?, description = ?, judgement_date = ?
    WHERE crimes_id = ?
  `;
  db.query(sql, [criminal_id, judge_id, victim_id, crime_type, description, judgement_date, crimes_id], (err, result) => {
    if (err) {
      console.error('Error updating crime:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Crime updated successfully' });
  });
});

// Delete crime by crimes_id
router.delete('/delete/:crimes_id', (req, res) => {
  const { crimes_id } = req.params;
  const sql = 'DELETE FROM crimes WHERE crimes_id = ?';
  db.query(sql, [crimes_id], (err, result) => {
    if (err) {
      console.error('Error deleting crime:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Crime deleted successfully' });
  });
});

module.exports = router;
