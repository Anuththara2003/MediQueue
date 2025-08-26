
       // Show/hide password fields
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text';
    } else {
        field.type = 'password';
    }
}

// Show Terms and Privacy modals
function showTerms() {
    document.getElementById('termsModal').style.display = 'block';
}
function showPrivacy() {
    document.getElementById('privacyModal').style.display = 'block';
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Password strength checker
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

if (passwordInput) {
    passwordInput.addEventListener('input', function() {
        const val = passwordInput.value;
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;

        if (strength === 0) {
            strengthBar.className = 'strength-fill strength-weak';
            strengthText.textContent = 'Password strength: Weak';
        } else if (strength === 1) {
            strengthBar.className = 'strength-fill strength-weak';
            strengthText.textContent = 'Password strength: Weak';
        } else if (strength === 2) {
            strengthBar.className = 'strength-fill strength-fair';
            strengthText.textContent = 'Password strength: Fair';
        } else if (strength === 3) {
            strengthBar.className = 'strength-fill strength-good';
            strengthText.textContent = 'Password strength: Good';
        } else if (strength === 4) {
            strengthBar.className = 'strength-fill strength-strong';
            strengthText.textContent = 'Password strength: Strong';
        }
    });
}

// Form validation
function validateForm() {
    let valid = true;
    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    // First Name
    const firstName = document.getElementById('firstName');
    if (!firstName.value.trim()) {
        firstName.parentElement.classList.add('error');
        valid = false;
    }
    // Last Name
    const lastName = document.getElementById('lastName');
    if (!lastName.value.trim()) {
        lastName.parentElement.classList.add('error');
        valid = false;
    }
    // Email
    const email = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        email.parentElement.classList.add('error');
        valid = false;
    }
    // Phone
    const phone = document.getElementById('phone');
    const phonePattern = /^[0-9\-\+\s\(\)]{7,}$/;
    if (!phonePattern.test(phone.value.trim())) {
        phone.parentElement.classList.add('error');
        valid = false;
    }
    // Date of Birth
    const dob = document.getElementById('dateOfBirth');
    if (!dob.value) {
        dob.parentElement.classList.add('error');
        valid = false;
    }
    // Gender
    const gender = document.getElementById('gender');
    if (!gender.value) {
        gender.parentElement.classList.add('error');
        valid = false;
    }
    // Account Type
    const accountType = document.getElementById('accountType');
    if (!accountType.value) {
        accountType.parentElement.classList.add('error');
        valid = false;
    }
    // Password
    const password = document.getElementById('password');
    if (password.value.length < 8) {
        password.parentElement.parentElement.classList.add('error');
        valid = false;
    }
    // Confirm Password
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword.value !== password.value || !confirmPassword.value) {
        confirmPassword.parentElement.parentElement.classList.add('error');
        valid = false;
    }
    // Terms
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        terms.parentElement.classList.add('error');
        valid = false;
    }
    return valid;
}

// Handle form submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        if (validateForm()) {
            submitBtn.innerHTML = 'Creating Account...';
            submitBtn.disabled = true;
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'block';
                signupForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                // Optionally scroll to success message
                document.getElementById('successMessage').scrollIntoView({behavior: 'smooth'});
            }, 1500);
        } else {
            // Optionally scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) firstError.scrollIntoView({behavior: 'smooth'});
        }
    });
}

// Sign in link handler (redirect or show login modal)
function signIn() {
    window.location.href = 'Login.html';
}

// Google signup placeholder
function signUpWithGoogle() {
    alert('Google signup is not implemented in this demo.');
}
