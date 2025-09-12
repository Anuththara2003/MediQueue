$(document).ready(function() {

    const $manageTokenModal = $('#manageTokenModal');
    
    $('#manage-token-btn').on('click', function() {
        const JWT_TOKEN = localStorage.getItem('jwtToken');
        if (!JWT_TOKEN) {
            alert("Authentication failed. Please log in again.");
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
            console.log("AJAX call සාර්ථකයි! ලැබුණු දත්ත:", tokenDetails);

            $('#token-clinic-name').text(`${tokenDetails.hospitalName} - ${tokenDetails.clinicName}`);
            
            const date = new Date(tokenDetails.appointmentDate);
            const formattedDate = date.toLocaleDateString('en-US', { 
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
                alert("You do not have any active tokens.");
            } else {
                alert("An error occurred while fetching your token details.");
            }
        });
    });

});