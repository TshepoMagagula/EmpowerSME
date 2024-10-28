const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/professionals.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the professionals database.');
});

db.run(`CREATE TABLE IF NOT EXISTS professionals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    skills TEXT,
    experience INTEGER
)`);

module.exports = db;
