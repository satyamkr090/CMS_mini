const mysql = require('mysql2');

// Create and export the database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Satyam0745',  // Your MySQL password
  database: 'cms'          // Your database name
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1); // Exit app if DB connection fails
  } else {
    console.log('Connected to MySQL database "cms"');
  }
});

module.exports = db;
