
function loadPatientHeaderAndSidebar() {
    console.log("Attempting to load patient header and sidebar info...");
    
    const JWT_TOKEN = localStorage.getItem('jwtToken');

    if (!JWT_TOKEN) {
        console.error("No JWT Token found. User might not be logged in.");
        
        return;
    }

    $.ajax({
        url: 'http://localhost:8080/api/v1/patient/profile-details', // <<<<==== CHECK THIS URL
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`
        },
        success: function(patientData) {
            // This function runs if the API call is successful
            Swal.fire({
                title: "profile load successfully !",
                icon: "success",
                draggable: true
                });
            console.log("Received patient data:", patientData);

        
            if (patientData) {
               
                $('.profile-section h4').text(patientData.fullName || 'Patient Name');
                
              
                $('.profile-section p').text(`Patient ID: ${patientData.patientId || 'N/A'}`);
                
                
                if (patientData.profilePicUrl) {
                    $('#profilePic').attr('src', patientData.profilePicUrl);
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // This function runs if the API call fails
            console.error("Failed to load patient details:", textStatus, errorThrown);
            // Optionally show an error to the user
            Swal.fire({
                icon: 'error',
                title: 'Could not load profile',
                text: 'There was an error fetching your details. Please try refreshing the page.'
            });
        }
    });
}