CREATE TABLE IF NOT EXISTS smes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    smeName TEXT NOT NULL,
    industry TEXT,
    address TEXT,
    contact_person TEXT NOT NULL,
    /* contact_email TEXT UNIQUE NOT NULL, */
    contact_phone TEXT,
    company_registration BLOB,  
    tax_number BLOB,             
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
