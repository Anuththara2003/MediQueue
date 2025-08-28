$(document).ready(function() {

    // --- 1. PROFILE PICTURE UPLOAD ---
    $('#profileUploadInput').on('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#profilePicPreview').attr('src', e.target.result);
                // In a real app, you would upload this data to the server here.
                showNotification('Profile picture updated!', 'success');
            }
            reader.readAsDataURL(file);
        }
    });

    // --- 2. PERSONAL INFO EDIT/SAVE ---
    const infoInputs = $('#fullName, #email, #phone, #dob');
    
    $('#edit-info-btn').on('click', function() {
        // Enable inputs for editing
        infoInputs.prop('disabled', false);
        // Toggle button visibility
        $('#edit-info-btn').addClass('hidden');
        $('#save-info-btn').removeClass('hidden');
    });

    $('#save-info-btn').on('click', function() {
        // Disable inputs after saving
        infoInputs.prop('disabled', true);
        // Toggle button visibility
        $('#save-info-btn').addClass('hidden');
        $('#edit-info-btn').removeClass('hidden');
        // Show success notification
        showNotification('Personal information saved successfully!', 'success');
    });

    // --- 3. PASSWORD VISIBILITY TOGGLE ---
    $('.password-toggle').on('click', function() {
        const input = $(this).siblings('input');
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        // Change icon
        $(this).toggleClass('fa-eye fa-eye-slash');
    });

    // --- 4. CHANGE PASSWORD BUTTON ---
    $('#change-password-btn').on('click', function() {
        // In a real app, validate fields and make an API call.
        showNotification('Password updated successfully!', 'success');
    });

    // --- 5. NOTIFICATION TOGGLE SWITCHES ---
    $('.toggle-switch').on('click', function() {
        $(this).toggleClass('active');
        const status = $(this).hasClass('active') ? 'enabled' : 'disabled';
        const notificationType = $(this).closest('.notification-item').find('h4').text();
        showNotification(`${notificationType} have been ${status}.`, 'success');
    });

    // --- 6. DEACTIVATE ACCOUNT BUTTON ---
    $('#deactivate-btn').on('click', function() {
        // Use a confirmation dialog before proceeding
        if (confirm("Are you sure you want to deactivate your account? This action is permanent.")) {
            // In a real app, you would make an API call to deactivate the account.
            showNotification('Account has been deactivated.', 'error');
            // Optionally, redirect the user
            // window.location.href = '/goodbye.html';
        }
    });

    // --- NOTIFICATION FUNCTION ---
    function showNotification(message, type) {
        const notification = $('#notification');
        notification.text(message);
        notification.removeClass('success error').addClass(type); // Set color based on type
        notification.addClass('show');
        
        setTimeout(() => {
            notification.removeClass('show');
        }, 3000);
    }

});