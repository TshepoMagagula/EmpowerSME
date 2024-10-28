function onboardForm() {
    return {
        name: '',
        email: '',
        phone: '',
        skills: '',
        experience: null,
        message: '',

        async submitForm() {
            const data = {
                name: this.name,
                email: this.email,
                phone: this.phone,
                skills: this.skills,
                experience: parseInt(this.experience),
            };

            try {
                const response = await fetch('https://empowersme.onrender.com/api/professionals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                this.message = result.message;

                // Clear form inputs after submission
                this.name = '';
                this.email = '';
                this.phone = '';
                this.skills = '';
                this.experience = null;
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
        contactEmail: '',
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
            formData.append('contactEmail', this.contactEmail);
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

                // Clear form inputs after submission
                this.smeName = '';
                this.industry = '';
                this.address = '';
                this.contactPerson = '';
                this.contactEmail = '';
                this.contactPhone = '';
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
        }
    };
};

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
        }
    };
};

