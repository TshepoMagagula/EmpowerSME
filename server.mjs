import express from 'express';
import cors from 'cors';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const  db = await sqlite.open({
    filename:  './database/professionals.db',
    driver:  sqlite3.Database
});

console.log('db initialized');

await db.migrate();

// GET endpoint to retrieve all professionals
app.get('/api/professionals', async function (req, res) {
    const sql = 'SELECT * FROM professionals';
    await db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ professionals: rows });
    });
});

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

// SME onboarding route with file uploads
app.post('/api/sme/onboard', upload.fields([
    { name: 'companyRegistration', maxCount: 1 },
    { name: 'businessTaxNumber', maxCount: 1 }
]), async (req, res) => {
    const { smeName, industry, address, contactPerson, contactEmail, contactPhone } = req.body;
    const companyRegistration = req.files.companyRegistration ? req.files.companyRegistration[0].path : null;
    const businessTaxNumber = req.files.businessTaxNumber ? req.files.businessTaxNumber[0].path : null;

    try {
        await db.run(`
            INSERT INTO smes (smeName, industry, address, contactPerson, contactEmail, contactPhone, companyRegistration, businessTaxNumber)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [smeName, industry, address, contactPerson, contactEmail, contactPhone, companyRegistration, businessTaxNumber]
        );

        res.json({ message: 'SME onboarded successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to onboard SME.' });
    }
});

// POST endpoint to onboard a new professional
app.post('/api/professionals', upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'qualification', maxCount: 1 },
    { name: 'matric', maxCount: 1 }
]), async function (req, res) {
    const { name, email, phone, skills, experience } = req.body;
   
    const idDocumentPath = req.files['idDocument'] ? req.files['idDocument'][0].path : null;
    const qualificationPath = req.files['qualification'] ? req.files['qualification'][0].path : null;
    const matricPath = req.files['matric'] ? req.files['matric'][0].path : null;

    const sql = `INSERT INTO professionals (name, email, phone, skills, experience, idDocument, qualification, matric) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, email, phone, skills, experience, idDocumentPath, qualificationPath, matricPath];

    await db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.json({ message: 'Professional onboarded successfully!', id: this.lastID });
        }
    });
});

import bcryptjs from 'bcryptjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

// Register new user
app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
                     [name, email, hashedPassword, role]);
        res.json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, 'your_secret_key');
        res.json({ message: 'Login successful!', role: user.role, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to login' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


