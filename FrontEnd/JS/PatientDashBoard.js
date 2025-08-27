// =================================================================
// PATIENT DASHBOARD - PAGE SPECIFIC SCRIPT (JS-ONLY TRANSLATION)
// =================================================================

let smsEnabled = true;
let currentToken = 45;
let yourToken = 52;

function updateDynamicTexts() {
    const langCode = localStorage.getItem('preferredLanguage') || 'en';
    const remaining = Math.max(0, yourToken - currentToken);

    let queueText;
    let waitTimeText;
    let queueCountText;

    // This is the ONLY place where we handle language-specific text in this file.
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

// translation.js එකෙන් එවන සංඥාවට සවන් දීම
$(document).on('languageChange', function() {
    updateDynamicTexts();
});

function updateHospitalInfo() {
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
    // Note: The 'Register New Token' button is now a link (<a> tag), so it doesn't need a JS function.
}

$(document).ready(function() {
    $('#currentToken').text(currentToken);
    $('#yourTokenNumber').text(yourToken);
    updateDynamicTexts();

    // This is a simulation of the token number increasing over time
    setInterval(() => {
        if (currentToken < yourToken) {
            currentToken++;
            $('#currentToken').text(currentToken);
            updateDynamicTexts();
        }
    }, 30000);
});