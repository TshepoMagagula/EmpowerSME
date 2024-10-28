const multer = require('multer');
const path = require('path');

// Configure storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure the 'uploads' directory exists
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
