                                        // =================================================================
                                        // PATIENT DASHBOARD - PAGE SPECIFIC SCRIPT (UPDATED)
                                        // =================================================================




const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});


const API_BASE_URL_PATIENT = 'http://localhost:8080/api/v1/patient';
const API_BASE_URL_HOSPITALS = 'http://localhost:8080/api/v1/hospitals';
const JWT_TOKEN = localStorage.getItem('jwtToken');
let liveUpdateInterval;

if (!JWT_TOKEN) {
    alert('Authentication token not found. Please log in.');
    window.location.href = 'login.html';
}


let smsEnabled = true;
let currentToken = 45;
let yourToken = 52;




function searchPrivateHospitals(query) {
    const url = `${API_BASE_URL_HOSPITALS}/search?query=${encodeURIComponent(query)}`;

    $.ajax({
        url: url,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`
        },
        success: function (data) {
            const resultsContainer = $('#hospitalSearchResults');
            resultsContainer.empty();
            if (data && data.length > 0) {
                data.forEach(hospital => {
                  
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
        error: function (err) {
            console.error("Error fetching hospitals from our API:", err);
            const resultsContainer = $('#hospitalSearchResults');
            resultsContainer.empty();
            resultsContainer.append('<div class="result-item">Error searching. Please try again.</div>');
        }
    });
}

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




/**
 * Loads the logged-in patient's upcoming appointments from the backend
 * and displays them dynamically on the dashboard.
 */
function loadUpcomingAppointments() {

    const $container = $('#upcoming-appointments-container'); // You need to add this ID to your HTML.
    const JWT_TOKEN = localStorage.getItem('jwtToken'); 

    // 2. Display a loading message while data is being fetched.
    $container.html('<p class="loading-text">Loading your appointments...</p>');

    // 3. Make the AJAX call to the backend.
    $.ajax({
        url: 'http://localhost:8080/api/v1/patient/appointments/upcoming',
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    })
        .done(function (appointments) {
            // 4. On SUCCESS, clear the loading message.
            $container.empty();

            if (appointments && appointments.length > 0) {
                // 4a. If appointments are found, loop through them and create a card for each.
                $.each(appointments, function (index, app) {

                    // Format the date for better readability (e.g., "Tomorrow", "Today", "15 Sept")
                    const date = new Date(app.appointmentDate);
                    let formattedDateText;
                    const today = new Date();
                    const tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    if (date.toDateString() === today.toDateString()) {
                        formattedDateText = "Today";
                    } else if (date.toDateString() === tomorrow.toDateString()) {
                        formattedDateText = "Tomorrow";
                    } else {
                        formattedDateText = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    }

                    // Format the time to 12-hour AM/PM format
                    const timeParts = app.appointmentTime.split(':');
                    const formattedTime = new Date(0, 0, 0, timeParts[0], timeParts[1]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                    // Create the HTML for the appointment card using your existing class structure
                    const appointmentCard = `
                    <div class="appointment-card">
                        <div class="appointment-header">
                            <div>
                                <div class="appointment-title">${app.clinicName}</div>
                            </div>
                            <span class="appointment-status status-upcoming">Upcoming</span>
                        </div>
                        <div class="appointment-details">
                            <div class="detail-item">
                                <i class="fas fa-user-md"></i>
                                <span>Dr. ${app.doctorName}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-hospital"></i>
                                <span>${app.hospitalName}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>${formattedDateText}, ${formattedTime}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-phone"></i>
                                <span>${app.doctorContact || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                `;
                    $container.append(appointmentCard);
                });
            } else {
                // 4b. If no appointments are found.
                $container.html('<p class="no-appointments-text">You have no upcoming appointments.</p>');
            }
        })
        .fail(function () {
            // 5. On FAILURE, show an error message.
            $container.html('<p class="error-text">Could not load appointments. Please refresh the page.</p>');
        });
}


/**
 * Loads the patient's past appointments (history) and displays them in a table.
 */



function loadAppointmentHistory() {
    const $tbody = $('#appointment-history-tbody');
    const JWT_TOKEN = localStorage.getItem('jwtToken');

    $tbody.html('<tr><td colspan="4" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading history...</td></tr>');

    $.ajax({
        url: 'http://localhost:8080/api/v1/patient/appointments/history',
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    })

        // PatientDashboard.js -> loadAppointmentHistory function එකේ
        .done(function (history) {
            $tbody.empty();
            if (history && history.length > 0) {
                $.each(history, function (index, item) {
                    const date = new Date(item.appointmentDate);
                    const formattedDate = date.toLocaleDateString('en-GB');

                    const statusText = item.status || 'N/A';

                    // 2. CSS class එක සඳහා, null නොවන අගය toLowerCase() කරනවා
                    const statusClass = statusText.toLowerCase();

                    const row = `
                <tr>
                    <td>${formattedDate}</td>
                    <td>Dr. ${item.doctorName}</td>
                    <td>${item.clinicName}</td>
                    <td><span class="status-tag status-${statusClass}">${statusText}</span></td>
                </tr>
            `;
                    // =========================

                    $tbody.append(row);
                });
            } else {
                $tbody.html('<tr><td colspan="4" style="text-align: center;">You have no past appointments.</td></tr>');
            }
        })



        .fail(function () {
            $tbody.html('<tr><td colspan="4" style="text-align: center; color: red;">Could not load appointment history.</td></tr>');
        });
}








$(document).ready(function () {


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






    loadPatientHeaderAndSidebar();
    loadUpcomingAppointments();
    loadAppointmentHistory();
    startLiveTokenUpdates();



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

            // <--- ඉහත තිබූ අනවශ්‍ය පේළිය මෙතනින් ඉවත් කර ඇත.
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

    $('#hospitalSearchInput').on('keyup', function () {
        clearTimeout(searchTimeout);
        const query = $(this).val();
        if (query.length > 2) {
            searchTimeout = setTimeout(() => {
                searchPrivateHospitals(query);
            }, 300);
        } else {
            $('#hospitalSearchResults').empty();
        }
        $(".sidebar-nav li a").click(function (e) {
            let target = $(this).attr("href");
            if (target.startsWith("#")) {
                e.preventDefault();
                $(".content-section").hide();
                $(target).show();
                $(".sidebar-nav li").removeClass("active");
                $(this).parent().addClass("active");
            }
        });
    });







});



// Load Clinics by Selected Hospital



async function loadClinicsByHospital(hospitalId) {
    if (!hospitalId) return;

    const clinicSelect = $('#clinicSelect');
    clinicSelect.empty(); // පෙර value remove කරන්න

    try {
        const response = await fetch(`http://localhost:8080/api/v1/clinics/by-hospital/${hospitalId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to load clinics: ${response.status}`);
        }

        const clinics = await response.json();

        if (clinics.length === 0) {
            clinicSelect.append('<option value="">No clinics available</option>');
        } else {
            clinicSelect.append('<option value="">Select Clinic</option>');
            clinics.forEach(clinic => {
                clinicSelect.append(`<option value="${clinic.id}">${clinic.name}</option>`);
            });
        }

    } catch (error) {
        console.error("Error loading clinics:", error);
        clinicSelect.append('<option value="">Error loading clinics</option>');
    }
}








function loadAppointmentHistory() {
    const $tbody = $('#appointment-history-tbody');
    const JWT_TOKEN = localStorage.getItem('jwtToken');

    $tbody.html('<tr><td colspan="4" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading history...</td></tr>');

    $.ajax({
        url: 'http://localhost:8080/api/v1/patient/appointments/history',
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    })
        .done(function (history) {
            $tbody.empty();
            if (history && history.length > 0) {
                $.each(history, function (index, item) {
                    const date = new Date(item.appointmentDate);
                    const formattedDate = date.toLocaleDateString('en-GB'); // "dd/mm/yyyy" format




                    const statusText = item.status || 'CANCELLED'; // 'N/A' stands for Not Available


                    const statusClass = statusText.toLowerCase();


                    const row = `
                    <tr>
                        <td>${formattedDate}</td>
                        <td>Dr. ${item.doctorName}</td>
                        <td>${item.clinicName}</td>
                        <td><span class="status-tag status-${statusClass}">${statusText}</span></td>
                    </tr>
                `;
                    // =======================================================

                    $tbody.append(row);
                });
            } else {
                $tbody.html('<tr><td colspan="4" style="text-align: center;">You have no past appointments.</td></tr>');
            }
        })
        .fail(function () {
            $tbody.html('<tr><td colspan="4" style="text-align: center; color: red;">Could not load appointment history.</td></tr>');
        });
}



function loadMedicalRecords() {
    const $container = $('#records-container');
    $container.html('<p class="loading-text">Loading your medical records...</p>');

    $.ajax({
        url: `${API_BASE_URL_PATIENT}/medical-records`,
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    }).done(function (records) {
        $container.empty();
        if (records && records.length > 0) {
            $.each(records, function (index, record) {
                const date = new Date(record.consultationDate);
                const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

                const recordCard = `
                    <div class="record-item">
                        <div class="record-icon"><i class="fas fa-file-invoice"></i></div>
                        <div class="record-info">
                            <h4>Consultation on ${formattedDate}</h4>
                            <p><strong>Doctor:</strong> Dr. ${record.doctorName || 'N/A'}<br>
                               <strong>Clinic:</strong> ${record.clinicName || 'N/A'}<br>
                               <strong>Diagnosis:</strong> ${record.diagnosis || 'No diagnosis recorded.'}</p>
                        </div>
                        <div class="record-actions">
                            <button class="btn btn-view-prescription" data-record-id="${record.recordId}">
                                <i class="fas fa-eye"></i> View Prescription
                            </button>
                        </div>
                    </div>`;
                $container.append(recordCard);
            });
        } else {
            $container.html('<p class="no-records-text">No medical records found.</p>');
        }
    });
}



// =======================================================
// === LIVE TOKEN TRACKING LOGIC ===
// =======================================================
// Interval ID එක ගබඩා කර තබාගැනීමට

/**
 * Updates the UI elements related to the live token status.
 */
function updateTokenStatusDisplay(statusData) {

    $('#currentToken').text(statusData.currentTokenNumber);


    $('#yourTokenNumber').text(statusData.yourTokenNumber);
    const remaining = Math.max(0, statusData.yourTokenNumber - statusData.currentTokenNumber);
    $('#queueInfo').text(`${remaining} more patient(s) to go`);
    const estimatedWaitTime = remaining * 10;
    $('#waitTime').text(`${estimatedWaitTime} minutes`);
    $('#queueCount').text(`${statusData.totalPatientsInQueue} patients`);

}

/**
 * Fetches the live token status from the backend.
 */
function fetchLiveTokenStatus() {
    if (!JWT_TOKEN) {
        if (liveUpdateInterval) clearInterval(liveUpdateInterval);
        return;
    }
    $.ajax({
        url: `${API_BASE_URL_PATIENT}/tokens/live-status`,
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    }).done(function (statusData) {
        console.log("Live status received:", statusData);
        updateTokenStatusDisplay(statusData);
        if (statusData.yourTokenStatus !== 'WAITING' && statusData.yourTokenStatus !== 'IN_PROGRESS') {
            if (liveUpdateInterval) clearInterval(liveUpdateInterval);
            console.log("Token is no longer active. Stopping live updates.");
        }
    }).fail(function (jqXHR) {
        if (jqXHR.status === 404) {
            if (liveUpdateInterval) clearInterval(liveUpdateInterval);
            $('#currentToken').text('-');
            $('#yourTokenNumber').text('-');
            $('#queueInfo').text('No active token');
            console.log("No active token found. Stopping live updates.");
        }
    });
}

/**
 * Starts the process of polling for live token updates.
 */
function startLiveTokenUpdates() {
    if (liveUpdateInterval) clearInterval(liveUpdateInterval);
    fetchLiveTokenStatus();
    liveUpdateInterval = setInterval(fetchLiveTokenStatus, 15000);
}


function loadMessages() {
    const $container = $('.messages-container');
    $container.html('<p>Loading messages...</p>');

    $.ajax({
        url: `${API_BASE_URL_PATIENT}/messages`,
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    }).done(function (messages) {
        $container.empty();
        if (messages && messages.length > 0) {
            $.each(messages, function (i, msg) {
                const messageHtml = `
                    <div class.message-preview">
                        ... (ඔබගේ HTML structure එකට අනුව දත්ත යොදන්න) ...
                        <h4>${msg.sender}</h4>
                        <p>${msg.content}</p>
                        <div class="message-time">${msg.time}</div>
                    </div>`;
                $container.append(messageHtml);
            });
        } else {
            $container.html('<p>You have no messages.</p>');
        }
    });
}

// Sidebar click listener එකේදී, "Messages" section එකට යන විට `loadMessages()` call කරන්න.

$(document).ready(function () {

    $(".sidebar-nav li a").on('click', function (e) {
        const targetSectionId = $(this).attr("href");


        if (targetSectionId && targetSectionId.startsWith("#")) {
            e.preventDefault();

            // Hide all content sections and show the target one
            $(".content-section").hide();
            $(targetSectionId).show();

            // Update active class on the sidebar
            $(".sidebar-nav li").removeClass("active");
            $(this).closest("li").addClass("active");


            if (targetSectionId === "#appointments-section") {
                loadAppointmentHistory();
            }

            if (targetSectionId === "#dashboard-section") {
                loadUpcomingAppointments();
            }

            if (targetSectionId === "#medical-records-section") {
                loadMedicalRecords();

            }

            if (targetSectionId === "#messages-section") {
                loadMessages();
            }

        }
    });




    // PatientDashboard.js (අනෙකුත් functions සමඟ, document.ready එකෙන් පිටත)

    /**
     * Loads the patient's messages (notifications) from the backend.
     */
    function loadMessages() {
        const $container = $('#messages-container');
        $container.html('<p class="loading-text">Loading your messages...</p>');

        $.ajax({
            url: `${API_BASE_URL_PATIENT}/notifications`, // අපි සෑදූ GET endpoint එක
            type: 'GET',
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
        })
            .done(function (messages) {
                $container.empty();
                if (messages && messages.length > 0) {
                    $.each(messages, function (index, msg) {

                        // Timestamp එක, "Yesterday", "2 days ago" වැනි format එකකට හැරවීම
                        const timeAgo = formatTimeAgo(new Date(msg.createdAt));

                        const messageCard = `
                    <div class="message-preview">
                        ${msg.status === 'PENDING' ? '<div class="message-badge"></div>' : ''}
                        <div class="message-avatar">
                            <!-- ඔබට sender ගේ avatar එකක් DTO එකේ එවීමට හැකි නම්, එය මෙතනට යොදන්න -->
                            <img src="https://i.pravatar.cc/150?u=${msg.senderName.replace(/\s/g, '')}" alt="${msg.senderName}">
                        </div>
                        <div class="message-content">
                            <h4>${msg.senderName}</h4>
                            <p>${msg.message}</p>
                        </div>
                        <div class="message-time">${timeAgo}</div>
                    </div>
                `;
                        $container.append(messageCard);
                    });
                } else {
                    $container.html('<p class="no-messages-text">You have no new messages.</p>');
                }
            })
            .fail(function () {
                $container.html('<p class="error-text">Could not load messages.</p>');
            });
    }

    /**
     * Helper function to format date into "time ago" string.
     * @param {Date} date - The date to format.
     * @returns {string} - The formatted string (e.g., "10:45 AM", "Yesterday", "2 days ago").
     */
    function formatTimeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";

        interval = seconds / 86400;
        if (interval > 1) {
            if (Math.floor(interval) === 1) return "Yesterday";
            return Math.floor(interval) + " days ago";
        }

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";

        // If it's today and less than a minute, show time
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }






    // ==========================
    // Hospital Selection Change Event
    // ==========================
    $(document).on('change', '#hospitalSelect', function () {
        const selectedHospitalId = $(this).val();
        console.log("Selected Hospital ID:", selectedHospitalId);
        loadClinicsByHospital(selectedHospitalId);
    });



    $(document).on('click', '.result-item', function () {
        const hospitalName = $(this).data('name');
        const hospitalId = $(this).data('id');
        if (hospitalName && hospitalId) {
            $('#hospitalSearchInput').val(hospitalName);
            $('#hospitalSearchResults').empty();
            updateHospitalInfo(hospitalId);
            loadClinicsByHospital(hospitalId);
        }
    });



    $(document).on('click', function (event) {
        if (!$(event.target).closest('.search-results-container').length) {
            $('#hospitalSearchResults').empty();
        }
    });
    $(document).on('languageChange', function () {
        updateDynamicTexts();
    });
    $('#profileUpload').on('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#profilePic').attr('src', e.target.result);
                $('#profilePicPreview').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    $('.logout-btn').on('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('jwtToken');
        showNotification("You have been logged out.");
        setTimeout(() => window.location.href = 'login.html', 1500);
    });



    const profileModal = $('#profileModal');

    $('#profile-modal-trigger').on('click', async function (e) {
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

    $('#profileModal .modal-close').on('click', function () { profileModal.removeClass('show'); });
    profileModal.on('click', function (e) { if ($(e.target).is(profileModal)) { profileModal.removeClass('show'); } });
    $('.tab-link').on('click', function () {
        const target = $(this).data('target');
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
        $('.tab-pane').removeClass('active');
        $(target).addClass('active');
    });

    $('#profileUploadInput').on('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#profilePicPreview').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // --- Save Personal Info Button ---
    $('#save-info-btn').on('click', async function () {
        // 1. Create a FormData object to send both text and image data
        const formData = new FormData();

        // 2. Prepare the text data (info) as a JSON object
        const infoData = {
            fullName: $('#fullName').val(),
            email: $('#email').val()
        };

        // 3. Append the JSON info as a 'Blob' (this is required for multipart requests)
        formData.append('info', new Blob([JSON.stringify(infoData)], { type: "application/json" }));

        // 4. Get the image file, if one has been selected
        const imageFile = $('#profileUploadInput')[0].files[0];
        if (imageFile) {
            // Append the image file to the FormData object
            formData.append('image', imageFile);
        }

        try {
            // 5. Send the request to the backend using fetch
            const response = await fetch(`http://localhost:8080/api/v1/patient/profile/info`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${JWT_TOKEN}`
                },
                body: formData
            });

            const result = await response.json();

            // 6. Check if the server responded with an error status
            if (!response.ok) {
                // If so, throw an error with the message from the server
                throw new Error(result.message || 'Update failed due to a server error.');
            }

            // 7. On SUCCESS: Show a success toast, close the modal, and refresh sidebar
            // Replaced showNotification with SweetAlert Toast
            Toast.fire({
                icon: 'success',
                title: result.message || 'Profile updated successfully!'
            });

            profileModal.removeClass('show');


            // Check if the sidebar refresh function exists before calling it
            if (typeof loadPatientHeaderAndSidebar === 'function') {
                loadPatientHeaderAndSidebar();
            }



        } catch (error) {
            // 8. On FAILURE: Show a detailed error popup
            console.error('Error updating info:', error);

            // Replaced showNotification with SweetAlert Error
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.message // The error message from the 'catch' block
            });
        }
    });

    $('#change-password-btn').on('click', async function () {
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

    $('#profileModal .toggle-switch').on('click', function () { $(this).toggleClass('active'); });

    const manageTokenModal = $('#manageTokenModal');
    $('#manage-token-btn').on('click', function () { manageTokenModal.addClass('show'); });
    $('#manageTokenModal .modal-close').on('click', function () { manageTokenModal.removeClass('show'); });
    manageTokenModal.on('click', function (e) { if ($(e.target).is(manageTokenModal)) { manageTokenModal.removeClass('show'); } });
    $('#cancel-token-btn').on('click', function () {
        if (confirm("Are you sure you want to cancel this token? This action cannot be undone.")) {
            manageTokenModal.removeClass('show');
            showNotification("Your token has been successfully cancelled.");
        }
    });
    $('#get-help-btn').on('click', function () { showNotification("Contacting support..."); });





});


