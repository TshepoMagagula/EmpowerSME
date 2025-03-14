function onboardForm() {
    return {
        name: '',
        /* email: '', */
        phone: '',
        skills: '',
        experience: '',
        idDocument: null,
        qualification: null,
        matric: null,
        message: '',

        handleFileUpload(event, field) {
            this[field] = event.target.files[0];
        },

        async submitForm() {
            const data = new FormData();
            data.append('name', this.name);
            /* data.append('email', this.email); */
            data.append('phone', this.phone);
            data.append('skills', this.skills);
            data.append('experience', this.experience);
            data.append('idDocument', this.idDocument);
            data.append('qualification', this.qualification);
            data.append('matric', this.matric);

            try {
                const response = await fetch('https://empowersme.onrender.com/api/professionals', {
                    method: 'POST',
                    body: data,
                });

                const result = await response.json();
                
                if (result.success) {
                    this.message = 'Professional onboarded successfully!';
                } else {
                    this.message = 'Failed to onboard professional. Please try again.';
                }

                setTimeout(() => {
                    this.name = '';
                    /* this.email = ''; */
                    this.phone = '';
                    this.skills = '';
                    this.experience = '';
                    this.idDocument = null;
                    this.qualification = null;
                    this.matric = null;
                    window.location.href = 'job_search.html';
                }, 5000);

             
            } catch (error) {
                console.error('Error:', error);
                this.message = 'Error submitting the form. Please try again.';
            }
        },
    };
};

function onboardSMEForm() {
    return {
        smeName: '',
        industry: '',
        address: '',
        contactPerson: '',
        /* contactEmail: '', */
        contactPhone: '',
        companyRegistration: null,
        businessTaxNumber: null,
        smeMessage: '',

        handleFileUpload(event, fieldName) {
            this[fieldName] = event.target.files[0];
        },

        async submitSMEForm() {
            const formData = new FormData();
            formData.append('smeName', this.smeName);
            formData.append('industry', this.industry);
            formData.append('address', this.address);
            formData.append('contactPerson', this.contactPerson);
            /* formData.append('contactEmail', this.contactEmail); */
            formData.append('contactPhone', this.contactPhone);
            formData.append('companyRegistration', this.companyRegistration);
            formData.append('businessTaxNumber', this.businessTaxNumber);
            
            try {
                const response = await fetch('https://empowersme.onrender.com/api/sme/onboard', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                this.smeMessage = result.message;

                setTimeout(() => {
                    this.smeName = '';
                    this.industry = '';
                    this.address = '';
                    this.contactPerson = '';
                    /* this.contactEmail = ''; */
                    this.contactPhone = '';
                    window.location.href = 'job_portal.html';
                }, 5000);

            } catch (error) {
                console.error('Error:', error);
                this.smeMessage = 'Error submitting the SME form. Please try again.';
            }
        },
    };
};

function loginForm() {
    return {
        email: '',
        password: '',
        role: 'professional',
        message: '',

        async submitLogin() {
            const data = { email: this.email, password: this.password };

            try {
                const response = await fetch('https://empowersme.onrender.com/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                
                if (result.role === 'professional') {
                    window.location.href = 'professionals_landing.html';
                } else if (result.role === 'sme') {
                    window.location.href = 'sme_landing.html';
                } else if (result.role === 'admin') {
                    window.location.href = 'admin.html';
                }
            } catch (error) {
                console.error('Error:', error);
                this.message = 'Login failed. Please try again.';
            }
        },

        clearInputs() {
            if (this.role) {
                this.email = '';
                this.password = '';
            }
        }
    };
}

function registerForm() {
    return {
        name: '',
        email: '',
        password: '',
        role: 'professional',
        message: '',

        async submitRegister() {
            const data = {
                name: this.name,
                email: this.email,
                password: this.password,
                role: this.role,
            };

            try {
                const response = await fetch('https://empowersme.onrender.com/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    // Registration successful
                    this.message = 'Registration successful! You can now log in.';
                    // Optionally, redirect to login page
                    window.location.href = 'index.html';
                } else {
                    // Registration failed
                    this.message = result.error || 'Registration failed. Please try again.';
                }
            } catch (error) {
                console.error('Error:', error);
                this.message = 'An error occurred. Please try again.';
            }
        },

        clearInputs() {
            if (this.role) {
                this.name = '';
                this.email = '';
                this.password = '';
            }
        }
    };
};

function jobPostingForm() {
    return {
        jobTitle: '',
        jobDescription: '',
        location: '',
        requirements: '',
        salary: '',
        jobMessage: '',

        async submitJobPost() {
            const jobData = {
                title: this.jobTitle,
                description: this.jobDescription,
                location: this.location,
                requirements: this.requirements,
                salary: this.salary
            };

            try {
                const response = await fetch('https://empowersme.onrender.com/api/post-job', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(jobData)
                });

                const result = await response.json();
                this.jobMessage = result.message;
            } catch (error) {
                console.error('Error posting job:', error);
                this.jobMessage = 'Failed to post job. Please try again.';
            }
        }
    };
}

function professionalSearch() {
    return {
        searchSkills: '',
        minExperience: 0,
        professionals: [],

        async searchProfessionals() {
            try {
                const response = await fetch(`https://empowersme.onrender.com/api/search-professionals?skills=${this.searchSkills}&experience=${this.minExperience}`);
                const results = await response.json();
                this.professionals = results;
            } catch (error) {
                console.error('Error searching professionals:', error);
            }
        }
    };
}

function jobSearch() {
    return {
        searchQuery: '',
        jobs: [],
        message: '',
        
        async fetchJobs() {
            try {
                const response = await fetch(`https://empowersme.onrender.com/api/jobs/search?query=${this.searchQuery}`);
                const data = await response.json();
                if (data.success) {
                    this.jobs = data.jobs;
                    this.message = '';
                } else {
                    this.message = 'No jobs found for your search query.';
                }
            } catch (error) {
                console.error(error);
                this.message = 'An error occurred while searching for jobs. Please try again.';
            }
        }
    };
}



