# EmpowerSME

## Project Overview
EmpowerSME is a web application designed to support Small and Micro Enterprises (SMEs) by providing a platform for professional onboarding and job opportunities. The application facilitates seamless interaction between SMEs, professionals, and recruiters, enabling efficient job matching and document management.

## Features
- **SME and Professional Registration**: Users can register as SMEs or professionals to access tailored services.
- **Job Portal**: SMEs can post job opportunities, and professionals can search and apply for jobs.
- **Document Management**: SMEs and professionals can upload and manage necessary documents.
- **Admin Dashboard**: An interface for administrators to manage users and job listings.

## Project Structure
```
ts	hepomagagula-empowersme/
├── api.http                # HTTP request samples for testing API endpoints
├── package.json            # Project dependencies and scripts
├── server.mjs              # Express.js server setup
├── database/
│   ├── db.js               # Database connection and configuration
│   └── professionals.db    # SQLite database file
├── migrations/             # SQL migration files for database schema and seeding
│   ├── 001_create_users_table.sql
│   ├── 002_create_professionals_table.sql
│   ├── 003_create_smes_table.sql
│   ├── 004_add_sme_documents.sql
│   ├── 005_add_sme_documents.sql
│   ├── 006_create_jobs_table.sql
│   ├── 007_seed_users.sql
│   ├── 008_seed_jobs.sql
│   ├── 009_add_pro_documents.sql
│   ├── 010_add_pro_documents.sql
│   └── 011_add_pro_documents.sql
└── public/
    ├── Volunteer.css
    ├── admin.css
    ├── admin.html
    ├── app.js
    ├── index.html
    ├── job_portal.html
    ├── job_search.html
    ├── professionals_landing.html
    ├── professionals_profile.html
    ├── register.html
    ├── sme_landing.html
    ├── sme_profile.html
    ├── style.css
    └── images/
```

## Installation
### Prerequisites
- Node.js (>= 14.x)
- SQLite3

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/tshepomagagula/empowersme.git
   cd tshepomagagula-empowersme
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run database migrations:
   ```sh
   npm run migrate
   ```
4. Start the server:
   ```sh
   npm start
   ```

## Usage
- Open `http://localhost:3000` in a browser to access the web application.
- Register as an SME or a professional to explore features.
- Admins can access the dashboard via `admin.html`.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries, reach out via [GitHub](https://github.com/tshepomagagula).

