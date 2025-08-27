$(document).ready(function() {

    // =================================================================
    // SECTION 1: UI INTERACTION HELPERS
    // =================================================================

    // Handles visual selection of roles
    window.selectRole = function(selectedRole) {
        // Remove 'active' class from all options
        $('.role-option').removeClass('active');
        // Add 'active' class to the clicked option
        const selectedElement = $(`input[value='${selectedRole}']`).closest('.role-option');
        selectedElement.addClass('active');
        // Also check the radio button programmatically
        $(`#${selectedRole}`).prop('checked', true);
    }

    // Toggles password visibility
    window.togglePassword = function() {
        const passwordField = $('#password');
        const button = passwordField.next('button');
        if (passwordField.attr('type') === 'password') {
            passwordField.attr('type', 'text');
            button.text('Hide');
        } else {
            passwordField.attr('type', 'password');
            button.text('Show');
        }
    }

    // Placeholder and navigation functions
    window.forgotPassword = () => alert('Forgot password functionality is not implemented yet.');
    window.signInWithGoogle = () => alert('Google Sign-In is not implemented yet.');
    window.signUp = () => window.location.href = 'SignUp.html'; // Assuming the signup page is SignUp.html


    // =================================================================
    // SECTION 2: FORM VALIDATION & AJAX SUBMISSION
    // =================================================================

    $('#loginForm').on('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        const loginErrorDiv = $('#loginError');
        loginErrorDiv.hide(); // Hide previous errors

        // 1. Collect form data
        const username = $('#name').val().trim();
        const password = $('#password').val();
        const role = $('input[name="role"]:checked').val();

        // 2. Basic Validation
        if (!role) {
            loginErrorDiv.text('❌ Please select your role.').show();
            return;
        }
        if (!username || !password) {
            loginErrorDiv.text('❌ Please enter both username and password.').show();
            return;
        }

        // Create the data object to send to the server
        const loginData = {
            username: username,
            password: password
            // Note: The role is used for redirection, not sent to this specific backend endpoint
        };

        const submitBtn = $('.login-btn');
        const originalText = submitBtn.html();
        submitBtn.html('Signing In...').prop('disabled', true);

        // 3. Perform AJAX request
        $.ajax({
            type: "POST",
            // !!! IMPORTANT: Replace this URL with your actual login API endpoint !!!
            url: "http://localhost:8080/auth/login",
            contentType: "application/json",
            data: JSON.stringify(loginData),
            success: function(response) {
                // Assuming the server response contains a token, like: { "token": "ey..." }
                // Store the token for future requests
                localStorage.setItem('authToken', response.data.accessToken);
               console.log(response.data.accessToken);
               alert("Successfully Loging😉👌")

                console.log(response);
                // REDIRECT based on the selected role
                if (response.data.role === 'ADMIN') {
                    window.location.href = '../HTML/AdminDashBoard.html'; 
                    
                } else {
                    // Default to patient dashboard
                    window.location.href = '../HTML/PatientDashBoard.html'; 
                }
            },
            error: function(xhr, status, error) {
                // If login fails (e.g., 401 Unauthorized, 403 Forbidden)
                let errorMessage = 'Invalid username or password.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                loginErrorDiv.text('❌ ' + errorMessage).show();
            },
            complete: function() {
                // This runs after success or error
                submitBtn.html(originalText).prop('disabled', false);
            }
        });
    });
});