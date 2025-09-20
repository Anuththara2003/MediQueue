$(document).ready(function() {

    // ===============================================
    // UI HELPER FUNCTIONS
    // ===============================================
    
    // Role selection (already correct)
    window.selectRole = function(role) {
        $('.role-option').removeClass('active');
        $(`input[value='${role}']`).closest('.role-option').addClass('active');
        $(`#${role}`).prop('checked', true);
    }

    // --- Added missing function ---
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

    // --- Added missing placeholder functions ---
    window.forgotPassword = () => alert('Forgot password functionality is not yet implemented.');
    window.signInWithGoogle = () => alert('Google Sign-In is not yet implemented.');
    window.signUp = () => window.location.href = 'SignUp.html';

    // ===============================================
    // LOGIN FORM SUBMISSION LOGIC (Corrected)
    // ===============================================
    $('#loginForm').on('submit', function(e) {
        e.preventDefault(); 

        const loginErrorDiv = $('#loginError');
        loginErrorDiv.hide();

        // 1. Collect form data
        // This will now work because your HTML input has id="username"
        const username = $('#username').val().trim(); 
        const password = $('#password').val();
        
        // 2. Basic Validation
        if (!username || !password) {
            loginErrorDiv.text('❌ Please enter both username and password.').show();
            return;
        }

        // 3. Create data object for the backend
        const loginData = {
            username: username,
            password: password
        };

        const submitBtn = $('.login-btn');
        const originalText = submitBtn.html();
        submitBtn.html('Signing In...').prop('disabled', true);

        // 4. Perform AJAX request
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/auth/login",
            contentType: "application/json",
            data: JSON.stringify(loginData),
            success: function(response) {
                // Assuming response is: { statusCode: 200, message: "ok", data: { accessToken: "...", role: "..." } }
                const responseData = response.data;
                localStorage.setItem('jwtToken', responseData.accessToken);
               
                console.log("Login successful. Token stored.");
                // alert("Successfully Logged In 😉👌");
              Swal.fire({
                        text: "Login Successfully Logged In 😉👌 Redirecting to your dashboard...!",
                        title: "Success!",
                        icon: "success",
                        draggable: true
                    }).then(() => {
                        if (response.data.role === 'ADMIN') {
                            window.location.href = '../HTML/AdminDashBoard.html'; 
                        }else {
                            window.location.href = '../HTML/PatientDashBoard.html';
                        }
                    });

                // Redirect based on the role received from the backend
                // if (responseData.role === 'ADMIN') {
                //     window.location.href = '../HTML/AdminDashBoard.html'; 
                // } else { // Assuming any other role is a PATIENT for now
                //     window.location.href = '../HTML/PatientDashBoard.html'; 
                // }
            },
            error: function(xhr) {
                let errorMessage = 'Invalid username or password.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                // loginErrorDiv.text('❌ ' + errorMessage).show();
                Swal.fire({
                    icon: "error",
                    title: "❌ Invalid UserName Or password",
                    text: "Something went wrong!",
                
                    });
            },
            complete: function() {
                submitBtn.html(originalText).prop('disabled', false);
            }
        });
    });
});