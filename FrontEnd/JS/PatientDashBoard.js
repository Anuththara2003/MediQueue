// =================================================================
// PATIENT DASHBOARD - PAGE SPECIFIC SCRIPT
// =================================================================

// LocationIQ API සඳහා වූ කොටස (වෙනසක් නැත)
const LOCATIONIQ_API_KEY = 'pk.620a0f57de48be49621910e59f1a0ec9'; 
let searchTimeout;

function searchPrivateHospitals(query) {
    const searchQuery = `private hospital ${query}`;
    const url = `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=LK`;

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            const resultsContainer = $('#hospitalSearchResults');
            resultsContainer.empty();
            if (data && data.length > 0) {
                data.forEach(place => {
                    resultsContainer.append(`
                        <div class="result-item" data-name="${place.display_name}">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${place.display_name}</span>
                        </div>
                    `);
                });
            } else {
                resultsContainer.append('<div class="result-item">No results found.</div>');
            }
        },
        error: function(err) {
            console.error("Error fetching data from LocationIQ:", err);
            const resultsContainer = $('#hospitalSearchResults');
            resultsContainer.empty();
            resultsContainer.append('<div class="result-item">Error searching. Please try again.</div>');
        }
    });
}

// Global variables (වෙනසක් නැත)
let smsEnabled = true;
let currentToken = 45;
let yourToken = 52;

// භාෂාව අනුව වෙනස් වන text update කිරීම (වෙනසක් නැත)
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

// අනෙකුත් functions (වෙනසක් නැත)
function updateHospitalInfo() {
    console.log("Hospital selected. Updating token info...");
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

function showNotification(message) {
    $('#notificationText').text(message);
    $('#notification').addClass('show');
    setTimeout(() => {
        $('#notification').removeClass('show');
    }, 3000);
}

// manageToken() function එක තවදුරටත් අවශ්‍ය නොවේ. එය ඉවත් කරන ලදී.

$(document).ready(function() {
    // --- පවතින DASHBOARD ක්‍රියාකාරීත්වය ---
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

    $('#hospitalSearchInput').on('keyup', function() {
        clearTimeout(searchTimeout); 
        const query = $(this).val();
        if (query.length > 2) {
            searchTimeout = setTimeout(() => {
                searchPrivateHospitals(query);
            }, 500);
        } else {
            $('#hospitalSearchResults').empty();
        }
    });

    $(document).on('click', '.result-item', function() {
        const hospitalName = $(this).data('name');
        if(hospitalName) {
            $('#hospitalSearchInput').val(hospitalName); 
            $('#hospitalSearchResults').empty(); 
            updateHospitalInfo(); 
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
    
    // Sidebar එකේ ඇති Profile පින්තූරය upload කිරීමේ ක්‍රියාවලිය
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

    // Logout Button ක්‍රියාකාරීත්වය
    $('.logout-btn').on('click', function(e) {
        e.preventDefault();
        showNotification("You have been logged out.");
        console.log("Logout button clicked.");
    });

    // --- PROFILE MODAL SCRIPT ---
    const profileModal = $('#profileModal');
    
    $('#profile-modal-trigger').on('click', function(e) {
        e.preventDefault();
        profileModal.addClass('show');
    });

    $('#profileModal .modal-close').on('click', function() {
        profileModal.removeClass('show');
    });

    profileModal.on('click', function(e) {
        if ($(e.target).is(profileModal)) {
            profileModal.removeClass('show');
        }
    });

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
                $('#profilePic').attr('src', e.target.result);
                showNotification('Profile picture updated!');
            }
            reader.readAsDataURL(file);
        }
    });
    
    $('#save-info-btn').on('click', function() {
        showNotification('Personal information saved!');
    });

    $('#change-password-btn').on('click', function() {
        showNotification('Password updated successfully!');
    });

    $('#profileModal .toggle-switch').on('click', function() {
        $(this).toggleClass('active');
    });

    // ==========================================================
    // === අලුතින් එකතු කළ MANAGE TOKEN MODAL SCRIPT ===
    // ==========================================================
    const manageTokenModal = $('#manageTokenModal');

    // --- Modal විවෘත කිරීම ---
    $('#manage-token-btn').on('click', function() {
        manageTokenModal.addClass('show');
    });

    // --- Modal වැසීම (Close button එකෙන්) ---
    $('#manageTokenModal .modal-close').on('click', function() {
        manageTokenModal.removeClass('show');
    });

    // --- Modal වැසීම (Overlay එක click කිරීමෙන්) ---
    manageTokenModal.on('click', function(e) {
        if ($(e.target).is(manageTokenModal)) {
            manageTokenModal.removeClass('show');
        }
    });

    // --- Token Cancel කිරීමේ ක්‍රියාවලිය ---
    $('#cancel-token-btn').on('click', function() {
        if (confirm("Are you sure you want to cancel this token? This action cannot be undone.")) {
            manageTokenModal.removeClass('show');
            showNotification("Your token has been successfully cancelled."); 
        }
    });

    // --- Get Help Button ක්‍රියාවලිය ---
    $('#get-help-btn').on('click', function() {
        showNotification("Contacting support...");
    });
});