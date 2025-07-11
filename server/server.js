const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Import route handlers
const criminalRoutes = require('./routes/criminal');
const victimRoutes = require('./routes/victim');
const judgeRoutes = require('./routes/judge');
const crimeRoutes = require('./routes/crime');

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Satyam0745',
  database: 'cms'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// ✅ Serve static files from ../public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Make DB available in routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/criminals', criminalRoutes);
app.use('/victims', victimRoutes);
app.use('/judges', judgeRoutes);
app.use('/crime', crimeRoutes);

// HTML page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

app.get('/criminal', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'criminal.html'));
});

app.get('/crime', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'crime.html'));
});

app.get('/judge', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'judge.html'));
});

app.get('/victim', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'victim.html'));
});

// Signup
app.post('/login/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';

  db.query(sql, [username, password], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('Username already exists.');
      }
      console.error('Signup error:', err);
      return res.status(500).send('Signup failed.');
    }
    res.status(201).send('Signup successful.');
  });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).send('Login failed.');
    }
    if (results.length > 0) {
      res.send('Login successful.');
    } else {
      res.status(401).send('Invalid credentials.');
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = db;
