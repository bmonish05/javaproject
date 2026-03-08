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

// ===================== CLEAR ERRORS =====================
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-msg');
    errorElements.forEach(el => {
        el.textContent = '';
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
        document.getElementById('loginIdError').textContent = 'Student ID is required';
        hasError = true;
    }

    if (!password) {
        document.getElementById('loginPasswordError').textContent = 'Password is required';
        hasError = true;
    }

    if (hasError) return;

    const students = JSON.parse(localStorage.getItem('students')) || {};

    if (!students[studentId]) {
        document.getElementById('loginIdError').textContent = 'Student ID not found. Please create an account.';
        return;
    }

    if (students[studentId].password !== password) {
        document.getElementById('loginPasswordError').textContent = 'Incorrect password';
        return;
    }

    const loginData = {
        role: 'student',
        userId: studentId,
        loginTime: new Date().toLocaleString()
    };

    localStorage.setItem('currentUser', JSON.stringify(loginData));
    window.location.href = 'success.html';
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
        document.getElementById('signupIdError').textContent = 'Student ID is required';
        hasError = true;
    }

    if (!validateEmail(email)) {
        document.getElementById('signupEmailError').textContent = 'Please enter a valid email';
        hasError = true;
    }

    if (!validatePassword(password)) {
        document.getElementById('signupPasswordError').textContent = 'Password must be at least 6 characters';
        hasError = true;
    }

    if (password !== confirmPassword) {
        document.getElementById('signupConfirmError').textContent = 'Passwords do not match';
        hasError = true;
    }

    if (hasError) return;

    const students = JSON.parse(localStorage.getItem('students')) || {};

    if (students[studentId]) {
        document.getElementById('signupIdError').textContent = 'This Student ID is already registered';
        return;
    }

    students[studentId] = {
        email: email,
        password: password,
        createdAt: new Date().toLocaleString()
    };

    localStorage.setItem('students', JSON.stringify(students));

    // Auto switch to login form without alert
    document.getElementById('studentSignupForm').classList.remove('active-form');
    document.getElementById('studentLoginForm').classList.add('active-form');
    document.getElementById('studentLoginForm').reset();
}

// ===================== ADMIN LOGIN HANDLER =====================
function handleAdminLogin(e) {
    e.preventDefault();
    clearErrors();

    const adminId = document.getElementById('adminLoginId').value.trim();
    const password = document.getElementById('adminLoginPassword').value;

    let hasError = false;

    if (!validateID(adminId)) {
        document.getElementById('adminLoginIdError').textContent = 'Admin ID is required';
        hasError = true;
    }

    if (!password) {
        document.getElementById('adminLoginPasswordError').textContent = 'Password is required';
        hasError = true;
    }

    if (hasError) return;

    const admins = JSON.parse(localStorage.getItem('admins')) || {};

    if (!admins[adminId]) {
        document.getElementById('adminLoginIdError').textContent = 'Admin ID not found. Please create an account.';
        return;
    }

    if (admins[adminId].password !== password) {
        document.getElementById('adminLoginPasswordError').textContent = 'Incorrect password';
        return;
    }

    const loginData = {
        role: 'admin',
        userId: adminId,
        loginTime: new Date().toLocaleString()
    };

    localStorage.setItem('currentUser', JSON.stringify(loginData));
    window.location.href = 'success.html';
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
        document.getElementById('adminSignupIdError').textContent = 'Admin ID is required';
        hasError = true;
    }

    if (!validateEmail(email)) {
        document.getElementById('adminSignupEmailError').textContent = 'Please enter a valid email';
        hasError = true;
    }

    if (!validatePassword(password)) {
        document.getElementById('adminSignupPasswordError').textContent = 'Password must be at least 6 characters';
        hasError = true;
    }

    if (password !== confirmPassword) {
        document.getElementById('adminSignupConfirmError').textContent = 'Passwords do not match';
        hasError = true;
    }

    if (adminKey !== ADMIN_SECRET_KEY) {
        document.getElementById('adminKeyError').textContent = 'Invalid Admin Secret Key';
        hasError = true;
    }

    if (hasError) return;

    const admins = JSON.parse(localStorage.getItem('admins')) || {};

    if (admins[adminId]) {
        document.getElementById('adminSignupIdError').textContent = 'This Admin ID is already registered';
        return;
    }

    admins[adminId] = {
        email: email,
        password: password,
        createdAt: new Date().toLocaleString()
    };

    localStorage.setItem('admins', JSON.stringify(admins));

    // Auto switch to login form without alert
    document.getElementById('adminSignupForm').classList.remove('active-form');
    document.getElementById('adminLoginForm').classList.add('active-form');
    document.getElementById('adminLoginForm').reset();
}