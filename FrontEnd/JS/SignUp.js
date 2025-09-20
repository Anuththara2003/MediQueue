$(document).ready(function () {


    // =================================================================
    // SECTION 1: UI INTERACTION HELPERS (No changes here)
    // =================================================================

    // Toggles password visibility
    window.togglePassword = function(fieldId) {
        const field = $(`#${fieldId}`);
        const button = field.next('button');
        if (field.attr('type') === 'password') {
            field.attr('type', 'text');
            button.text('Hide');
        } else {
            field.attr('type', 'password');
            button.text('Show');
        }
    }

    // Modal functions
    window.showTerms = () => $('#termsModal').show();
    window.showPrivacy = () => $('#privacyModal').show();
    window.closeModal = (modalId) => $(`#${modalId}`).hide();

    // Page navigation functions
    window.signIn = () => window.location.href = 'Login.html';
    window.signUpWithGoogle = () => alert('Google signup is not implemented yet.');


    // =================================================================
    // SECTION 2: PASSWORD STRENGTH CHECKER (No changes here)
    // =================================================================

    $('#password').on('input', function() {
        const val = $(this).val();
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;

        let strengthClass = 'strength-fill strength-weak';
        let text = 'Password strength: Weak';

        if (strength === 2) {
            strengthClass = 'strength-fill strength-fair';
            text = 'Password strength: Fair';
        } else if (strength === 3) {
            strengthClass = 'strength-fill strength-good';
            text = 'Password strength: Good';
        } else if (strength === 4) {
            strengthClass = 'strength-fill strength-strong';
            text = 'Password strength: Strong';
        }

        $('#strengthBar').attr('class', strengthClass);
        $('#strengthText').text(text);
    });


    // =================================================================
    // SECTION 3: FORM VALIDATION & AJAX SUBMISSION
    // =================================================================

    function validateForm() {
        let isValid = true;
        // Hide previous messages
        $('#successMessage, #errorMessage').hide();
        // Clear previous errors
        $('.form-group').removeClass('error');

        // First Name
        if ($('#firstName').val().trim() === '') {
            $('#firstName').parent().addClass('error');
            isValid = false;
        }
        // Last Name
        if ($('#lastName').val().trim() === '') {
            $('#lastName').parent().addClass('error');
            isValid = false;
        }
        // Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($('#email').val().trim())) {
            $('#email').parent().addClass('error');
            isValid = false;
        }
        // Password
        if ($('#password').val().length < 8) {
            $('#password').closest('.form-group').addClass('error');
            isValid = false;
        }
        // Confirm Password
        if ($('#confirmPassword').val() !== $('#password').val() || $('#confirmPassword').val() === '') {
            $('#confirmPassword').closest('.form-group').addClass('error');
            isValid = false;
        }
        // Terms
        if (!$('#terms').is(':checked')) {
            // Finding a better element to show error for checkbox
            $('.terms-checkbox').addClass('error');
            isValid = false;
        } else {
             $('.terms-checkbox').removeClass('error');
        }

        return isValid;
    }

    // Handle the button click event for AJAX submission
    $('#submitBtn').on('click', function() {



        if (validateForm()) {
            // 1. Collect form data into a JavaScript object
            const formData = {
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                email: $('#email').val(),
                contactNumber: $('#phone').val(),
                dateOfBirth: $('#dateOfBirth').val(),
                gender: $('#gender').val(),
                username: $('#name').val(),
                password: $('#password').val(),
                role: "PATIENT"

            };



            const submitBtn = $(this);
            const originalText = submitBtn.html();
            submitBtn.html('Creating Account...').prop('disabled', true);

            // 2. Perform the AJAX request
            $.ajax({
                type: "POST",
                // !!! IMPORTANT: Replace this URL with your actual backend API endpoint !!!
                url: "http://localhost:8080/auth/register",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function(response) {
                    // This function runs if the server responds with success (e.g., status 200 or 201)
                    Swal.fire({
                        title: "Successfully Sign Up😎!",
                        text: "You will be redirected to the login page.",
                        icon: "success",
                        timer: 2000,
                        timerProgressBar: true,
                        willClose: () => {
                            window.location.href = '../HTML/Login.html';
                        }
                    });
                    $('#signupForm')[0].reset(); // Reset form fields

                },
                error: function(xhr, status, error) {
                    // This function runs if the request fails
                    console.error("Signup Error:", xhr.responseJSON || error); // Log the actual error for debugging
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Something went wrong! Please try again later 😒.",
                    });
                },
                complete: function() {
                    // This function runs after success or error, for cleanup
                    submitBtn.html(originalText).prop('disabled', false);
                }
            });

        } else {
            // If validation fails, show a SweetAlert
            Swal.fire({
              icon: "error",
              title: "Validation Error",
              text: "Please fill out all the required fields correctly.🙂",
            });

            // Scroll to the first field with an error
            const firstError = $('.form-group.error').first();
            if (firstError.length) {
                 $('html, body').animate({ scrollTop: firstError.offset().top - 20 }, 500);
            }
        }
    });
});