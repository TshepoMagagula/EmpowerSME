CREATE TABLE IF NOT EXISTS professionals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    /* email TEXT NOT NULL UNIQUE, */
    phone TEXT,
    skills TEXT,
    experience INTEGER,
    idDocument TEXT,
    qualification TEXT,
    matric TEXT
);
