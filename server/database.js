const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Satyam0745', // Replace with your MySQL password
  database: 'cms'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1); // Exit if connection fails
  } else {
    console.log('Connected to MySQL database "cms"');
  }
});

module.exports = db;
