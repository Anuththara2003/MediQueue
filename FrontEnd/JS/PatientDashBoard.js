// =================================================================
// PATIENT DASHBOARD - PAGE SPECIFIC SCRIPT (UPDATED)
// =================================================================

// === API CONFIGURATION ===
const API_BASE_URL_PATIENT = 'http://localhost:8080/api/v1/patient';
const API_BASE_URL_HOSPITALS = 'http://localhost:8080/api/v1/hospitals'; 
const JWT_TOKEN = localStorage.getItem('jwtToken');

if (!JWT_TOKEN) {
    alert('Authentication token not found. Please log in.');
    window.location.href = 'login.html'; 
}

// Global variables
let smsEnabled = true;
let currentToken = 45;
let yourToken = 52;

// === HOSPITAL SEARCH FUNCTION එක, ලස්සන emoji එකක් සමග ===
function searchPrivateHospitals(query) {
    const url = `${API_BASE_URL_HOSPITALS}/search?query=${encodeURIComponent(query)}`;

    $.ajax({
        url: url,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`
        },
        success: function(data) {
            const resultsContainer = $('#hospitalSearchResults');
            resultsContainer.empty();
            if (data && data.length > 0) {
                data.forEach(hospital => {
                    // === මෙන්න ලස්සන emoji එක සහිත කොටස ===
                    resultsContainer.append(`
                        <div class="result-item" data-id="${hospital.id}" data-name="${hospital.name}">
                            <span style="font-size: 1.5em; margin-right: 10px;">🏥</span>
                            <div>
                                <strong>${hospital.name}</strong><br>
                                <small>${hospital.location}</small>
                            </div>
                        </div>
                    `);
                });
            } else {
                resultsContainer.append('<div class="result-item">No hospitals found.</div>');
            }
        },
        error: function(err) {
            console.error("Error fetching hospitals from our API:", err);
            const resultsContainer = $('#hospitalSearchResults');
            resultsContainer.empty();
            resultsContainer.append('<div class="result-item">Error searching. Please try again.</div>');
        }
    });
}

// භාෂාව අනුව වෙනස් වන text update කිරීම
function updateDynamicTexts() {
    const langCode = localStorage.getItem('preferredLanguage') || 'en';
    const remaining = Math.max(0, yourToken - currentToken);
    let queueText, waitTimeText, queueCountText;
    if (langCode === 'si') {
        queueText = `තවත් රෝගීන් ${remaining} දෙනෙක් ඉදිරියෙන්`;
        waitTimeText = "මිනිත්තු 25";
        queueCountText = "රෝගීන් 12 දෙනෙක්";
    } else if (langCode === 'ta') {
        queueText = `மேலும் ${remaining} நோயாளிகள் செல்ல வேண்டும்`;
        waitTimeText = "25 நிமிடங்கள்";
        queueCountText = "12 நோயாளிகள்";
    } else {
        queueText = `${remaining} more patients to go`;
        waitTimeText = "25 minutes";
        queueCountText = "12 patients";
    }
    $('#queueInfo').text(queueText);
    $('#waitTime').text(waitTimeText);
    $('#queueCount').text(queueCountText);
}

// අනෙකුත් functions
function updateHospitalInfo(hospitalId) {
    console.log(`Hospital with ID: ${hospitalId} selected. Updating token info...`);
    currentToken = Math.floor(Math.random() * 20) + 30;
    yourToken = currentToken + Math.floor(Math.random() * 10) + 5;
    $('#currentToken').text(currentToken);
    $('#yourTokenNumber').text(yourToken);
    updateDynamicTexts();
}
function updateClinicInfo() {
    console.log("Clinic selection changed to:", $('#clinicSelect').val());
}
function toggleSMS() {
    const toggleSwitch = $('.toggle-switch');
    smsEnabled = !smsEnabled;
    toggleSwitch.toggleClass('active', smsEnabled);
    const message = smsEnabled ? "SMS Alerts Enabled" : "SMS Alerts Disabled";
    showNotification(message);
}

function showNotification(message, type = 'success') {
    const notification = $('#notification');
    $('#notificationText').text(message);
    notification.removeClass('success error').addClass(type);
    notification.addClass('show');
    setTimeout(() => {
        notification.removeClass('show');
    }, 3000);
}


$(document).ready(function() {

    loadPatientHeaderAndSidebar();

    async function loadPatientHeaderAndSidebar() {
        try {
            const response = await fetch(`${API_BASE_URL_PATIENT}/profile`, {
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            });
            if (!response.ok) throw new Error('Failed to fetch patient data.');
            
            const data = await response.json();
            
            $('.profile-section h4').text(data.fullName || 'Patient Name');
            const defaultAvatar = 'https://i.pravatar.cc/150?u=default';
            const avatarUrl = data.avatarUrl ? `http://localhost:8080${data.avatarUrl}` : defaultAvatar;
            $('#profilePic').attr('src', avatarUrl);
            
        } catch (error) {
            console.error("Error loading patient data:", error);
        }
    }

    $('#currentToken').text(currentToken);
    $('#yourTokenNumber').text(yourToken);
    updateDynamicTexts();
    setInterval(() => {
        if (currentToken < yourToken) {
            currentToken++;
            $('#currentToken').text(currentToken);
            updateDynamicTexts();
        }
    }, 30000);
    
    let searchTimeout;
    
    $('#hospitalSearchInput').on('keyup', function() {
        clearTimeout(searchTimeout); 
        const query = $(this).val();
        if (query.length > 2) {
            searchTimeout = setTimeout(() => {
                searchPrivateHospitals(query);
            }, 300);
        } else {
            $('#hospitalSearchResults').empty();
        }
    });

    $(document).on('click', '.result-item', function() {
        const hospitalName = $(this).data('name');
        const hospitalId = $(this).data('id');
        if(hospitalName && hospitalId) {
            $('#hospitalSearchInput').val(hospitalName); 
            $('#hospitalSearchResults').empty(); 
            updateHospitalInfo(hospitalId); 
        }
    });

    $(document).on('click', function(event) {
        if (!$(event.target).closest('.search-results-container').length) {
            $('#hospitalSearchResults').empty();
        }
    });
    $(document).on('languageChange', function() {
        updateDynamicTexts();
    });
    $('#profileUpload').on('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#profilePic').attr('src', e.target.result);
                $('#profilePicPreview').attr('src', e.target.result); 
            }
            reader.readAsDataURL(file);
        }
    });
    
    $('.logout-btn').on('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('jwtToken');
        showNotification("You have been logged out.");
        setTimeout(() => window.location.href = 'login.html', 1500);
    });

    const profileModal = $('#profileModal');
    
    $('#profile-modal-trigger').on('click', async function(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL_PATIENT}/profile`, {
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            });
            if (!response.ok) throw new Error('Failed to fetch profile data.');
            const data = await response.json();
            
            $('#fullName').val(data.fullName || '');
            $('#email').val(data.email || '');
            const defaultAvatar = 'https://i.pravatar.cc/150?u=default';
            const avatarUrl = data.avatarUrl ? `http://localhost:8080${data.avatarUrl}` : defaultAvatar;
            $('#profilePicPreview').attr('src', avatarUrl);

            profileModal.addClass('show');
        } catch (error) {
            console.error('Error loading profile modal:', error);
            showNotification('Could not load profile data.', 'error');
        }
    });

    $('#profileModal .modal-close').on('click', function() { profileModal.removeClass('show'); });
    profileModal.on('click', function(e) { if ($(e.target).is(profileModal)) { profileModal.removeClass('show'); } });
    $('.tab-link').on('click', function() {
        const target = $(this).data('target');
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
        $('.tab-pane').removeClass('active');
        $(target).addClass('active');
    });

    $('#profileUploadInput').on('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#profilePicPreview').attr('src', e.target.result); 
            }
            reader.readAsDataURL(file);
        }
    });
    
    $('#save-info-btn').on('click', async function() {
        const formData = new FormData();
        const infoData = {
            fullName: $('#fullName').val(),
            email: $('#email').val()
        };
        formData.append('info', new Blob([JSON.stringify(infoData)], { type: "application/json" }));
        
        const imageFile = $('#profileUploadInput')[0].files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL_PATIENT}/profile/info`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` },
                body: formData
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Update failed');
            
            showNotification(result.message || 'Profile updated successfully!');
            profileModal.removeClass('show');
            loadPatientHeaderAndSidebar();

        } catch (error) {
            console.error('Error updating info:', error);
            showNotification(error.message, 'error');
        }
    });

    $('#change-password-btn').on('click', async function() {
        const passwordData = {
            currentPassword: $('#currentPassword').val(),
            newPassword: $('#newPassword').val()
        };

        try {
            const response = await fetch(`${API_BASE_URL_PATIENT}/profile/password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${JWT_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Password change failed');

            showNotification(result.message || 'Password updated successfully!');
            $('#currentPassword').val('');
            $('#newPassword').val('');

        } catch (error) {
            console.error('Error changing password:', error);
            showNotification(error.message, 'error');
        }
    });

    $('#profileModal .toggle-switch').on('click', function() { $(this).toggleClass('active'); });

    const manageTokenModal = $('#manageTokenModal');
    $('#manage-token-btn').on('click', function() { manageTokenModal.addClass('show'); });
    $('#manageTokenModal .modal-close').on('click', function() { manageTokenModal.removeClass('show'); });
    manageTokenModal.on('click', function(e) { if ($(e.target).is(manageTokenModal)) { manageTokenModal.removeClass('show'); } });
    $('#cancel-token-btn').on('click', function() {
        if (confirm("Are you sure you want to cancel this token? This action cannot be undone.")) {
            manageTokenModal.removeClass('show');
            showNotification("Your token has been successfully cancelled."); 
        }
    });
    $('#get-help-btn').on('click', function() { showNotification("Contacting support..."); });
});


//done js