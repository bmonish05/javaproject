// ==================== LOCAL STORAGE FUNCTIONS ====================
const getStoredUsers = () => {
    const users = localStorage.getItem('quizUsers');
    return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
    localStorage.setItem('quizUsers', JSON.stringify(users));
};

const getCurrentUser = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

const setCurrentUser = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
};

const getStoredQuizResults = () => {
    const results = localStorage.getItem('quizResults');
    return results ? JSON.parse(results) : [];
};

const saveQuizResults = (results) => {
    localStorage.setItem('quizResults', JSON.stringify(results));
};

// ==================== NOTIFICATION SYSTEM ====================
const showNotification = (message, type = 'success') => {
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
};

// ==================== FORM SWITCHING ====================
const switchForm = (formType) => {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    if (formType === 'signUp') {
        if (signInForm) signInForm.classList.add('hidden');
        if (signUpForm) signUpForm.classList.remove('hidden');
        clearErrors();
    } else {
        if (signUpForm) signUpForm.classList.add('hidden');
        if (signInForm) signInForm.classList.remove('hidden');
        clearErrors();
    }
};

// ==================== PASSWORD TOGGLE ====================
const togglePassword = (inputId) => {
    const input = document.getElementById(inputId);
    if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
    }
};

// ==================== EMAIL VALIDATION ====================
const isValidEmail = (email) => {
    const gmailRegex = /^[^\s@]+@gmail\.com$/;
    return gmailRegex.test(email.toLowerCase());
};

// ==================== PASSWORD VALIDATION ====================
const isValidPassword = (password) => {
    return password.length >= 6;
};

// ==================== CLEAR ERRORS ====================
const clearErrors = () => {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
};

// ==================== SHOW ERROR MESSAGE ====================
const showErrorMessage = (elementId, message) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
};

// ==================== SIGN IN HANDLER ====================
document.addEventListener('DOMContentLoaded', () => {
    const signInForm = document.getElementById('signInFormElement');
    if (signInForm) {
        signInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            const email = document.getElementById('signInEmail').value.trim().toLowerCase();
            const password = document.getElementById('signInPassword').value;

            if (!email) {
                showErrorMessage('signInEmailError', 'Email is required');
                return;
            }

            if (!isValidEmail(email)) {
                showErrorMessage('signInEmailError', 'Please enter a valid Gmail address (example@gmail.com)');
                return;
            }

            if (!password) {
                showErrorMessage('signInPasswordError', 'Password is required');
                return;
            }

            const users = getStoredUsers();
            const user = users.find(u => u.email.toLowerCase() === email);

            if (!user) {
                showErrorMessage('signInEmailError', 'No account found with this email');
                return;
            }

            if (user.password !== password) {
                showErrorMessage('signInPasswordError', 'Invalid password');
                return;
            }

            setCurrentUser(user);
            showNotification(`Welcome back, ${user.name}!`, 'success');
            
            setTimeout(() => {
                if (user.isAdmin) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        });
    }
});

// ==================== SIGN UP HANDLER ====================
document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = document.getElementById('signUpFormElement');
    if (signUpForm) {
        signUpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            const name = document.getElementById('signUpName').value.trim();
            const email = document.getElementById('signUpEmail').value.trim().toLowerCase();
            const password = document.getElementById('signUpPassword').value;
            const confirmPassword = document.getElementById('signUpConfirmPassword').value;

            if (!name) {
                showErrorMessage('signUpNameError', 'Name is required');
                return;
            }

            if (name.length < 3) {
                showErrorMessage('signUpNameError', 'Name must be at least 3 characters');
                return;
            }

            if (!email) {
                showErrorMessage('signUpEmailError', 'Email is required');
                return;
            }

            if (!isValidEmail(email)) {
                showErrorMessage('signUpEmailError', 'Please enter a valid Gmail address (example@gmail.com)');
                return;
            }

            if (!password) {
                showErrorMessage('signUpPasswordError', 'Password is required');
                return;
            }

            if (!isValidPassword(password)) {
                showErrorMessage('signUpPasswordError', 'Password must be at least 6 characters');
                return;
            }

            if (password !== confirmPassword) {
                showErrorMessage('signUpConfirmPasswordError', 'Passwords do not match');
                return;
            }

            const users = getStoredUsers();
            if (users.some(u => u.email.toLowerCase() === email)) {
                showErrorMessage('signUpEmailError', 'Account already exists with this email');
                return;
            }

            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                createdAt: new Date().toISOString(),
                isAdmin: false
            };

            users.push(newUser);
            saveUsers(users);

            showNotification(`Account created successfully! Redirecting to login...`, 'success');

            document.getElementById('signUpFormElement').reset();

            setTimeout(() => {
                switchForm('signIn');
                document.getElementById('signInFormElement').reset();
                clearErrors();
            }, 2000);
        });
    }
});