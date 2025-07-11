-- Users table for login
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Criminals table
CREATE TABLE criminals (
  criminals_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  crime VARCHAR(255) NOT NULL ,
  crime_date DATE NOT NULL DEFAULT '2025-01-01'
);

-- Judges table
CREATE TABLE judges (
  judges_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  court_name VARCHAR(100) NOT NULL,
  experience INT NOT NULL
);

-- Victims table
CREATE TABLE victims (
  victims_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  mobile VARCHAR(15),
  incident_date DATE
);

-- Crimes table referencing other tables
CREATE TABLE crimes (
  crimes_id INT AUTO_INCREMENT PRIMARY KEY,
  criminal_id INT NOT NULL,
  judge_id INT,
  victim_id INT,
  crime_type VARCHAR(100),
  description TEXT,
  judgement_date DATE,
  FOREIGN KEY (criminal_id) REFERENCES criminals(criminals_id),
  FOREIGN KEY (judge_id) REFERENCES judges(judges_id),
  FOREIGN KEY (victim_id) REFERENCES victims(victims_id)
);