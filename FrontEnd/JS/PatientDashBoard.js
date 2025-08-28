// =================================================================
// PATIENT DASHBOARD - PAGE SPECIFIC SCRIPT
// =================================================================

// ++++++++++++++++ LocationIQ API සඳහා වූ කොටස ++++++++++++++++
// ඔබගේ LocationIQ API යතුර මෙතන ඇතුලත් කරන්න
const LOCATIONIQ_API_KEY = 'pk.620a0f57de48be49621910e59f1a0ec9'; 
let searchTimeout;

// API call එක සිදු කරන function එක (ඔබ ලබාදුන් Autocomplete URL එක සමඟ)
function searchPrivateHospitals(query) {
    // API එකට යවන query එක වඩාත් හොඳ ප්‍රතිඵල සඳහා සකස් කිරීම
    const searchQuery = `private hospital ${query}`;
    
    // ඔබ ලබාදුන් නිවැරදි URL එක
    const url = `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=LK`;

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            const resultsContainer = $('#hospitalSearchResults');
            resultsContainer.empty(); // පරණ ප්‍රතිඵල ඉවත් කිරීම

            if (data && data.length > 0) {
                data.forEach(place => {
                    // ප්‍රතිඵල පෙන්වන div එකට අලුත් item එකක් එකතු කිරීම
                    // Autocomplete API එකෙන් display_name එක ලැබෙනවා
                    // resultsContainer.append(`<div class="result-item" data-name="${place.display_name}">${place.display_name}</div>`);
                    resultsContainer.append(`
    <div class="result-item" data-name="${place.display_name}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
        </svg>
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
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let smsEnabled = true;
let currentToken = 45;
let yourToken = 52;

function updateDynamicTexts() {
    const langCode = localStorage.getItem('preferredLanguage') || 'en';
    const remaining = Math.max(0, yourToken - currentToken);
    
    let queueText;
    let waitTimeText;
    let queueCountText;

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

$(document).on('languageChange', function() {
    updateDynamicTexts();
});

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

function manageToken() {
    showNotification("Opening token management options...");
}

$(document).ready(function() {
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

    // Search input එකේ type කරන විට
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

    // Search result එකක් click කල විට
    $(document).on('click', '.result-item', function() {
        const hospitalName = $(this).data('name');
        if(hospitalName) {
            $('#hospitalSearchInput').val(hospitalName); 
            $('#hospitalSearchResults').empty(); 
            updateHospitalInfo(); 
        }
    });

    // Search box එකෙන් පිටත click කල විට ප්‍රතිඵල සැඟවීම
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.search-results-container').length) {
            $('#hospitalSearchResults').empty();
        }
    });
});