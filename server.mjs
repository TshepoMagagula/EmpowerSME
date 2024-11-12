import express from 'express';
import cors from 'cors';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());

const  db = await sqlite.open({
    filename:  './database/professionals.db',
    driver:  sqlite3.Database
});

const router = express.Router();

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
    const { smeName, industry, address, contactPerson, contactPhone } = req.body;
    const companyRegistration = req.files.companyRegistration ? req.files.companyRegistration[0].path : null;
    const businessTaxNumber = req.files.businessTaxNumber ? req.files.businessTaxNumber[0].path : null;

    try {
        await db.run(`
            INSERT INTO smes (smeName, industry, address, contactPerson, contactPhone, companyRegistration, businessTaxNumber)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [smeName, industry, address, contactPerson, contactPhone, companyRegistration, businessTaxNumber]
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
]), (req, res) => {
    const { name, phone, skills, experience } = req.body;
   
    const idDocumentPath = req.files['idDocument'] ? req.files['idDocument'][0].path : null;
    const qualificationPath = req.files['qualification'] ? req.files['qualification'][0].path : null;
    const matricPath = req.files['matric'] ? req.files['matric'][0].path : null;

    const sql = `INSERT INTO professionals (name, phone, skills, experience, idDocument, qualification, matric) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, phone, skills, experience, idDocumentPath, qualificationPath, matricPath];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.json({ message: 'Professional onboarded successfully!', id: this.lastID });
        }
    });
});
export default router;

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

// Job Posting Endpoint
app.post('/api/post-job', (req, res) => {
    const { title, description, location, requirements, salary } = req.body;
    const sql = `INSERT INTO jobs (title, description, location, requirements, salary) VALUES (?, ?, ?, ?, ?)`;
    const params = [title, description, location, requirements, salary];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error posting job:', err);
            res.status(500).json({ message: 'Failed to post job.' });
        } else {
            res.json({ message: 'Job posted successfully', jobId: this.lastID });
        }
    });
});

//search professionals endpoint
app.get('/api/search-professionals', (req, res) => {
    const { skills, experience } = req.query;
    const sql = `
        SELECT * FROM professionals 
        WHERE skills LIKE ? AND experience >= ?
    `;
    const params = [`%${skills}%`, experience || 0];

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error fetching professionals:', err);
            res.status(500).json([]);
        } else {
            res.json(rows);
        }
    });
});

// Route to search for jobs
app.get('/api/jobs/search', async (req, res) => {
    const searchQuery = req.query.query;

    try {
        const sql = `
            SELECT * FROM jobs
            WHERE title LIKE ? OR description LIKE ? OR requirements LIKE ?;
        `;
        const params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
        const [jobs] = await db.execute(sql, params);
        
        if (jobs.length) {
            res.json({ success: true, jobs });
        } else {
            res.json({ success: false, message: 'No jobs found' });
        }
    } catch (error) {
        console.error('Error searching for jobs:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


