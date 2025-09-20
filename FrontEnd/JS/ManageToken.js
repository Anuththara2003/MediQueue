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


    const $manageTokenModal = $('#manageTokenModal');
    
    // --- "Manage Token" Button Click Event ---
    $('#manage-token-btn').on('click', function() {
        const JWT_TOKEN = localStorage.getItem('jwtToken');
        if (!JWT_TOKEN) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Failed',
                text: 'Please log in again to continue.'
            });
            return;
        }

        $('#token-clinic-name').text('Loading your token...');
        $('#token-number').text('...');
        $manageTokenModal.addClass('show');

        $.ajax({
            url: 'http://localhost:8080/api/v1/patient/tokens/latest-active',
            type: 'GET',
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
        })
        .done(function(tokenDetails) {
            console.log("AJAX call successful! Data received:", tokenDetails);

            $('#token-clinic-name').text(`${tokenDetails.hospitalName} - ${tokenDetails.clinicName}`);
            
            const date = new Date(tokenDetails.appointmentDate);
            const formattedDate = date.toLocaleString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' 
            });
            $('#token-date').text(formattedDate);
            
            $('#token-number').text(tokenDetails.tokenNumber);
            
            const $statusDot = $('#token-status-dot');
            $('#token-status-text').text(tokenDetails.status);
            $statusDot.removeClass('active');
            if (tokenDetails.status === 'WAITING' || tokenDetails.status === 'IN_PROGRESS') {
                $statusDot.addClass('active');
            }
            
            const qrData = tokenDetails.tokenId.toString(); 
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
            $('#token-qr-code').attr('src', qrCodeUrl);
            
            $('#cancel-token-btn').data('token-id', tokenDetails.tokenId);
        })
        .fail(function(jqXHR) {
            $manageTokenModal.removeClass('show'); 
            if (jqXHR.status === 404) {
                Swal.fire({
                    icon: 'info',
                    title: 'No Active Tokens Found',
                    text: 'You do not have any active tokens at the moment.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops... Something went wrong!',
                    text: 'An error occurred while fetching your token details. Please try again later.'
                });
            }
        });
    });


    // --- "Cancel Token" Button Click Event ---
    // =========================================================================
    // === නිවැරදි කිරීම මෙතන ===
    // We use .off('click') to remove any previously attached click handlers
    // before adding our new one with .on('click'). This prevents double firing.
    // =========================================================================
    $('#cancel-token-btn').off('click').on('click', function() {
        const tokenId = $(this).data('tokenId');
        const JWT_TOKEN = localStorage.getItem('jwtToken');

        if (!tokenId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not identify the token to cancel. Please refresh and try again.'
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://localhost:8080/api/v1/patient/tokens/${tokenId}/cancel`, 
                    type: 'PATCH',
                    headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                })
                .done(function(response) {
                    Swal.fire(
                        'Cancelled!',
                        response.message || 'Your token has been successfully cancelled.',
                        'success'
                    );
                    $('#manageTokenModal').removeClass('show');
                })
                .fail(function(jqXHR) {
                    const errorMsg = jqXHR.responseJSON ? jqXHR.responseJSON.error : "An unknown error occurred.";
                    Swal.fire({
                        icon: 'error',
                        title: 'Cancellation Failed',
                        text: errorMsg
                    });
                    console.error("Token cancellation failed:", jqXHR);
                });
            }
        });
    });

});