CREATE TABLE IF NOT EXISTS smes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    sme_name TEXT NOT NULL,
    industry TEXT,
    address TEXT,
    contact_person TEXT NOT NULL,
    contact_email TEXT UNIQUE NOT NULL,
    contact_phone TEXT,
    company_registration BLOB,  -- Stores a document as binary data
    tax_number BLOB,             -- Stores a tax document as binary data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
