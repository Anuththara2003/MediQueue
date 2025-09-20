$(document).ready(function() {

          function validateAndLoadDashboard() {
    let token = localStorage.getItem('jwtToken');

    if (!token) {
      window.location.href = '../HTML/Login.html';
      return;
    }

    const tokenParts = token.split('.');

    if (tokenParts.length !== 3) {
      window.location.href = '../HTML/Login.html';
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(tokenParts[1]));

      const currentTimestamp = Math.floor(Date.now() / 10000);
      

      if (tokenPayload.exp && currentTimestamp >= tokenPayload.exp) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('jwtToken');
        window.location.href = '.../HTML/Login.html';
        return;
      }


    } catch (error) {
      console.error('Invalid token:', error);
      window.location.href = '../HTML/Login.html';
    }
  }

  // --------- Call every 10 seconds ---------
setInterval(validateAndLoadDashboard, 10000);

// --------- Call once when page loads ---------
validateAndLoadDashboard();


    // --- SweetAlert2 Toast Configuration (for small, non-blocking notifications) ---
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end', // Position notifications at the top-right
        showConfirmButton: false,
        timer: 3000, // Auto-close after 3 seconds
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    // --- 1. PROFILE PICTURE UPLOAD ---
    $('#profileUploadInput').on('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#profilePicPreview').attr('src', e.target.result);
                // Replaced custom notification with a SweetAlert Toast
                Toast.fire({
                    icon: 'success',
                    title: 'Profile picture updated!'
                });
            }
            reader.readAsDataURL(file);
        }
    });

    // --- 2. PERSONAL INFO EDIT/SAVE ---
    const infoInputs = $('#fullName, #email, #phone, #dob');
    
    $('#edit-info-btn').on('click', function() {
        infoInputs.prop('disabled', false);
        $('#edit-info-btn').addClass('hidden');
        $('#save-info-btn').removeClass('hidden');
    });

    $('#save-info-btn').on('click', function() {
        infoInputs.prop('disabled', true);
        $('#save-info-btn').addClass('hidden');
        $('#edit-info-btn').removeClass('hidden');
        // Replaced custom notification with a SweetAlert Toast
        Toast.fire({
            icon: 'success',
            title: 'Personal information saved successfully!'
        });
    });

    // --- 3. PASSWORD VISIBILITY TOGGLE ---
    $('.password-toggle').on('click', function() {
        const input = $(this).siblings('input');
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        $(this).toggleClass('fa-eye fa-eye-slash');
    });

    // --- 4. CHANGE PASSWORD BUTTON ---
    $('#change-password-btn').on('click', function() {
        // Replaced custom notification with a standard SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Password Updated!',
            text: 'Your password has been changed successfully.'
        });
    });

    // --- 5. NOTIFICATION TOGGLE SWITCHES ---
    $('.toggle-switch').on('click', function() {
        $(this).toggleClass('active');
        const status = $(this).hasClass('active') ? 'enabled' : 'disabled';
        const notificationType = $(this).closest('.notification-item').find('h4').text();
        // Replaced custom notification with a SweetAlert Toast
        Toast.fire({
            icon: 'success',
            title: `${notificationType} notifications have been ${status}.`
        });
    });

    // --- 6. DEACTIVATE ACCOUNT BUTTON ---
    $('#deactivate-btn').on('click', function() {
        // Replaced confirm() with a SweetAlert confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to deactivate your account. This action is permanent and cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, deactivate my account!',
            cancelButtonText: 'No, I changed my mind'
        }).then((result) => {
            // Proceed only if the user confirms
            if (result.isConfirmed) {
                // In a real app, make an API call here.
                
                // Show a final confirmation message
                Swal.fire(
                    'Deactivated!',
                    'Your account has been successfully deactivated.',
                    'success'
                );
                // Optionally, redirect the user after a delay
                // setTimeout(() => { window.location.href = '/goodbye.html'; }, 2000);
            }
        });
    });

    // --- The custom showNotification function is no longer needed and has been removed. ---

});