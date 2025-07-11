const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err, result) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ message: 'User creation failed' });
        }
        res.status(200).json({ message: 'User created successfully' });
      }
    );
  } catch (error) {
    console.error('Hashing error:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});


// Login route
router.post('/', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send('DB error');
    if (results.length === 0) return res.status(401).send('User not found');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid credentials');

    res.send('Login successful');
  });
});

module.exports = router;
