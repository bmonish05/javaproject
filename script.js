// ===================== ADMIN SECRET KEY =====================
const ADMIN_SECRET_KEY = "admin@123";

// ===================== TOGGLE PASSWORD VISIBILITY =====================
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// ===================== VALIDATION FUNCTIONS =====================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateID(id) {
    return id.trim().length > 0;
}

// ===================== CLEAR ERRORS & SUCCESS MESSAGES =====================
function clearErrors() {
    // Clear all error messages and remove .show class
    document.querySelectorAll('.error-msg').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
    
    // Clear all success messages and remove .show class
    document.querySelectorAll('.success-msg').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

// ===================== STUDENT LOGIN HANDLER =====================
function handleStudentLogin(e) {
    e.preventDefault();
    clearErrors();

    const studentId = document.getElementById('studentLoginId').value.trim();
    const password = document.getElementById('studentLoginPassword').value;

    let hasError = false;

    if (!validateID(studentId)) {
        const errorEl = document.getElementById('loginIdError');
        if (errorEl) {
            errorEl.textContent = 'Student ID is required';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (!password) {
        const errorEl = document.getElementById('loginPasswordError');
        if (errorEl) {
            errorEl.textContent = 'Password is required';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (hasError) return;

    const students = JSON.parse(localStorage.getItem('students')) || {};

    if (!students[studentId]) {
        const errorEl = document.getElementById('loginIdError');
        if (errorEl) {
            errorEl.textContent = 'Student ID not found. Please create an account.';
            errorEl.classList.add('show');
        }
        return;
    }

    if (students[studentId].password !== password) {
        const errorEl = document.getElementById('loginPasswordError');
        if (errorEl) {
            errorEl.textContent = 'Incorrect password';
            errorEl.classList.add('show');
        }
        return;
    }

    const loginData = {
        role: 'student',
        userId: studentId,
        loginTime: new Date().toLocaleString()
    };

    localStorage.setItem('currentUser', JSON.stringify(loginData));
    const successEl = document.getElementById('loginSuccess');
    if (successEl) {
        successEl.textContent = 'Login successful! Redirecting...';
        successEl.classList.add('show');
    }
    setTimeout(() => window.location.href = 'success.html', 800);
}

// ===================== STUDENT SIGNUP HANDLER =====================
function handleStudentSignup(e) {
    e.preventDefault();
    clearErrors();

    const studentId = document.getElementById('studentSignupId').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const password = document.getElementById('studentSignupPassword').value;
    const confirmPassword = document.getElementById('studentConfirmPassword').value;

    let hasError = false;

    if (!validateID(studentId)) {
        const errorEl = document.getElementById('signupIdError');
        if (errorEl) {
            errorEl.textContent = 'Student ID is required';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (!validateEmail(email)) {
        const errorEl = document.getElementById('signupEmailError');
        if (errorEl) {
            errorEl.textContent = 'Please enter a valid email';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (!validatePassword(password)) {
        const errorEl = document.getElementById('signupPasswordError');
        if (errorEl) {
            errorEl.textContent = 'Password must be at least 6 characters';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (password !== confirmPassword) {
        const errorEl = document.getElementById('signupConfirmError');
        if (errorEl) {
            errorEl.textContent = 'Passwords do not match';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (hasError) return;

    const students = JSON.parse(localStorage.getItem('students')) || {};

    if (students[studentId]) {
        const errorEl = document.getElementById('signupIdError');
        if (errorEl) {
            errorEl.textContent = 'This Student ID is already registered';
            errorEl.classList.add('show');
        }
        return;
    }

    students[studentId] = {
        email: email,
        password: password,
        createdAt: new Date().toLocaleString()
    };

    localStorage.setItem('students', JSON.stringify(students));
    
    const successEl = document.getElementById('signupSuccess');
    if (successEl) {
        successEl.textContent = 'Account created successfully! Switching to login...';
        successEl.classList.add('show');
    }

    // Auto switch to login form
    setTimeout(() => {
        document.getElementById('studentSignupForm').classList.remove('active-form');
        document.getElementById('studentLoginForm').classList.add('active-form');
        document.getElementById('studentLoginForm').reset();
        clearErrors();
    }, 1200);
}

// ===================== ADMIN LOGIN HANDLER =====================
function handleAdminLogin(e) {
    e.preventDefault();
    clearErrors();

    const adminId = document.getElementById('adminLoginId').value.trim();
    const password = document.getElementById('adminLoginPassword').value;

    let hasError = false;

    if (!validateID(adminId)) {
        const errorEl = document.getElementById('adminLoginIdError');
        if (errorEl) {
            errorEl.textContent = 'Admin ID is required';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (!password) {
        const errorEl = document.getElementById('adminLoginPasswordError');
        if (errorEl) {
            errorEl.textContent = 'Password is required';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (hasError) return;

    const admins = JSON.parse(localStorage.getItem('admins')) || {};

    if (!admins[adminId]) {
        const errorEl = document.getElementById('adminLoginIdError');
        if (errorEl) {
            errorEl.textContent = 'Admin ID not found. Please create an account.';
            errorEl.classList.add('show');
        }
        return;
    }

    if (admins[adminId].password !== password) {
        const errorEl = document.getElementById('adminLoginPasswordError');
        if (errorEl) {
            errorEl.textContent = 'Incorrect password';
            errorEl.classList.add('show');
        }
        return;
    }

    const loginData = {
        role: 'admin',
        userId: adminId,
        loginTime: new Date().toLocaleString()
    };

    localStorage.setItem('currentUser', JSON.stringify(loginData));
    const successEl = document.getElementById('adminLoginSuccess');
    if (successEl) {
        successEl.textContent = 'Login successful! Redirecting...';
        successEl.classList.add('show');
    }
    setTimeout(() => window.location.href = 'success.html', 800);
}

// ===================== ADMIN SIGNUP HANDLER =====================
function handleAdminSignup(e) {
    e.preventDefault();
    clearErrors();

    const adminId = document.getElementById('adminSignupId').value.trim();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminSignupPassword').value;
    const confirmPassword = document.getElementById('adminConfirmPassword').value;
    const adminKey = document.getElementById('adminKey').value;

    let hasError = false;

    if (!validateID(adminId)) {
        const errorEl = document.getElementById('adminSignupIdError');
        if (errorEl) {
            errorEl.textContent = 'Admin ID is required';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (!validateEmail(email)) {
        const errorEl = document.getElementById('adminSignupEmailError');
        if (errorEl) {
            errorEl.textContent = 'Please enter a valid email';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (!validatePassword(password)) {
        const errorEl = document.getElementById('adminSignupPasswordError');
        if (errorEl) {
            errorEl.textContent = 'Password must be at least 6 characters';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (password !== confirmPassword) {
        const errorEl = document.getElementById('adminSignupConfirmError');
        if (errorEl) {
            errorEl.textContent = 'Passwords do not match';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (adminKey !== ADMIN_SECRET_KEY) {
        const errorEl = document.getElementById('adminKeyError');
        if (errorEl) {
            errorEl.textContent = 'Invalid Admin Secret Key';
            errorEl.classList.add('show');
        }
        hasError = true;
    }

    if (hasError) return;

    const admins = JSON.parse(localStorage.getItem('admins')) || {};

    if (admins[adminId]) {
        const errorEl = document.getElementById('adminSignupIdError');
        if (errorEl) {
            errorEl.textContent = 'This Admin ID is already registered';
            errorEl.classList.add('show');
        }
        return;
    }

    admins[adminId] = {
        email: email,
        password: password,
        createdAt: new Date().toLocaleString()
    };

    localStorage.setItem('admins', JSON.stringify(admins));

    const successEl = document.getElementById('adminSignupSuccess');
    if (successEl) {
        successEl.textContent = 'Admin account created successfully! Switching to login...';
        successEl.classList.add('show');
    }

    // Auto switch to login form
    setTimeout(() => {
        document.getElementById('adminSignupForm').classList.remove('active-form');
        document.getElementById('adminLoginForm').classList.add('active-form');
        document.getElementById('adminLoginForm').reset();
        clearErrors();
    }, 1200);
}