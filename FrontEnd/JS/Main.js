// =======================================================
// MEDIQUEUE ADMIN DASHBOARD - FINAL & COMPLETE JS FILE (jQuery/AJAX)
// =======================================================

$(document).ready(function () {

    // --- CONFIGURATION ---
    const API_BASE_URL = 'http://localhost:8080/api/v1/admin';
    const JWT_TOKEN = localStorage.getItem('jwtToken');
    const API_BASE_URL_GENERAL = 'http://localhost:8080/api/v1'; // Base URL without /admin

    // --- SECURITY CHECK ---
    if (!JWT_TOKEN) {
        alert('Authentication token not found. Please log in.');
        window.location.href = '../HTML/login.html';
        return;
    }

    // === Header එකේ data load කරන function එක ===
    async function loadAdminHeaderDetails() {
        try {
            const response = await $.ajax({
                url: `${API_BASE_URL}/profile`,
                method: 'GET',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            });

            if (response.firstName && response.lastName) {
                $('#headerAdminName').text(`${response.firstName} ${response.lastName}`);
            }

            const headerAdminAvatar = $('#headerAdminAvatar');
            if (response.avatarUrl) {
                headerAdminAvatar.attr('src', `http://localhost:8080${response.avatarUrl}`);
            } else {
                headerAdminAvatar.attr('src', 'assets/img/default_avatar.jpg');
            }

        } catch (error) {
            console.error('Error loading admin header details:', error);
        }
    }

    // === Clinic Management ===
    window.loadClinics = async function () {
        try {
            const result = await $.ajax({
                url: `${API_BASE_URL}/clinics`,
                method: 'GET',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            });

            const clinics = result.data || result;
            const clinicTableBody = $('#clinicTableBody');

            if (!clinicTableBody.length) {
                console.error("Table body with id 'clinicTableBody' not found!");
                return;
            }

            clinicTableBody.empty();

            if (clinics.length === 0) {
                clinicTableBody.append('<tr><td colspan="6">No clinics found.</td></tr>');
            } else {
                clinics.forEach((clinic) => {
                    const row = `
                        <tr>
                            <td>${clinic.id}</td>
                            <td>${clinic.name}</td>
                            <td>${clinic.hospitalName}</td>
                            <td>${clinic.startTime}</td>
                            <td>${clinic.endTime}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="editClinic(${clinic.id})">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteClinic(${clinic.id})">Delete</button>
                            </td>
                        </tr>
                    `;
                    clinicTableBody.append(row);
                });
            }

        } catch (error) {
            console.error("Error loading clinics:", error);
            alert("Could not load clinics.");
        }
    };

    // Delete Clinic
    window.deleteClinic = async function (id) {
        if (!confirm("Are you sure you want to delete this clinic?")) return;

        try {
            await $.ajax({
                url: `${API_BASE_URL_GENERAL}/clinics/${id}`,
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            });

            alert("Clinic deleted successfully");
            loadClinics();
        } catch (error) {
            console.error("Error deleting clinic:", error);
            alert("Error deleting clinic: " + (error.responseJSON ? error.responseJSON.message : error.responseText));
        }
    };

    // Edit Clinic - Populate Modal
    window.editClinic = async function (id) {
        try {
            const clinic = await $.ajax({
                url: `${API_BASE_URL_GENERAL}/clinics/${id}`,
                method: 'GET',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            });

            const clinicModal = $('#clinicModal');
            clinicModal.addClass('show');
            clinicModal.find('h2').text('Edit Clinic');
            $('#clinicHospitalSelect').val(clinic.hospitalId);
            $('#clinicName').val(clinic.name);
            $('#clinicStartTime').val(clinic.startTime);
            $('#clinicEndTime').val(clinic.endTime);

            $('#clinicForm').data('mode', 'edit').data('id', id);
        } catch (error) {
            console.error('Error opening clinic for edit:', error);
            alert('Could not load clinic data: ' + (error.responseJSON ? error.responseJSON.message : error.responseText));
        }
    };

    // Clinic form submit (add / edit)
    $('#clinicForm').on('submit', async function (e) {
        e.preventDefault();
        const mode = $(this).data('mode') || 'add';
        const clinicId = $(this).data('id');

        const clinicData = {
            hospitalId: $('#clinicHospitalSelect').val(),
            name: $('#clinicName').val(),
            startTime: $('#clinicStartTime').val(),
            endTime: $('#clinicEndTime').val(),
        };

        if (!clinicData.hospitalId) {
            alert('Please select a hospital.');
            return;
        }

        try {
            const url = mode === 'edit' ? `${API_BASE_URL_GENERAL}/clinics/${clinicId}` : `${API_BASE_URL}/clinics`;
            const method = mode === 'edit' ? 'PUT' : 'POST';

            await $.ajax({
                url: url,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT_TOKEN}`
                },
                data: JSON.stringify(clinicData)
            });

            alert(`Clinic ${mode === 'edit' ? 'updated' : 'added'} successfully!`);
            $(this)[0].reset();
            $(this).data('mode', 'add').data('id', '');
            $('#clinicModal').removeClass('show');
            loadClinics();
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.responseJSON ? error.responseJSON.message : error.responseText}`);
        }
    });

    // --- GLOBAL ELEMENTS ---
    const pageTitle = $('#pageTitle');
    const breadcrumb = $('#breadcrumb');

    // ===================================
    // 1. HEADER & NAVIGATION
    // ===================================
    function updateHeader(sectionId) {
        let title = '', crumb = 'Admin / ';
        switch (sectionId) {
            case 'overview': title = 'Dashboard Overview'; crumb += 'Dashboard'; break;
            case 'hospitals': title = 'Hospitals & Clinics'; crumb += 'Hospitals'; break;
            case 'reports': title = 'Reports & Analytics'; crumb += 'Reports'; break;
            case 'sms': title = 'SMS Management'; crumb += 'SMS'; break;
            case 'system': title = 'System Health'; crumb += 'System'; break;
        }
        pageTitle.text(title);
        breadcrumb.text(crumb);
    }

    window.showSection = function (sectionId) {
        $('.dashboard-section').removeClass('active');
        $('.nav-item').removeClass('active');

        $(`#${sectionId}`).addClass('active');
        $(`.nav-item[onclick="showSection('${sectionId}')"]`).addClass('active');

        if (sectionId === 'hospitals') {
            loadHospitals();
        } else if (sectionId === 'clinics') {
            loadClinics();
        }

        updateHeader(sectionId);
    };

    // ===================================
    // 2. HOSPITAL MANAGEMENT (CRUD)
    // ===================================
    const hospitalModal = $('#hospitalModal');
    const hospitalTableBody = $('#hospitals .data-table tbody');

    async function loadHospitals() {
        if (!hospitalTableBody.length) return;
        try {
            const hospitals = await $.ajax({
                url: `${API_BASE_URL}/hospitals`,
                method: 'GET',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            });

            hospitalTableBody.empty();

            if (hospitals.length === 0) {
                hospitalTableBody.append(`<tr><td colspan="5">No hospitals found. Add a new one to get started.</td></tr>`);
            } else {
                hospitals.forEach(h => {
                    const row = `
                        <tr>
                            <td>${h.name || 'N/A'}</td>
                            <td>${h.location || 'N/A'}</td>
                            <td>${h.clinicCount || 0}</td>
                            <td><span class="status-badge status-${h.status ? h.status.toLowerCase() : 'inactive'}">${h.status || 'N/A'}</span></td>
                            <td class="action-buttons">
                                <button class="btn-icon btn-warning" onclick="openHospitalModal('edit', '${h.id}')"><i class="fas fa-pen"></i></button>
                                <button class="btn-icon btn-danger" onclick="deleteHospital('${h.id}')"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                    hospitalTableBody.append(row);
                });
            }
        } catch (error) {
            console.error('Error loading hospitals:', error);
            hospitalTableBody.html(`<tr><td colspan="5" style="color: red;">Error loading data. Check console for details.</td></tr>`);
        }
    }

    if (hospitalModal.length) {
        const hospitalForm = $('#hospitalForm');

        hospitalForm.on('submit', async (e) => {
            e.preventDefault();
            const mode = hospitalForm.data('mode');

            const hospitalData = {
                name: $('#hospitalName').val(),
                location: $('#hospitalLocation').val(),
                status: $('#hospitalStatus').val(),
                clinicCount: $('#hospitalClinics').val()
            };

            const url = mode === 'edit'
                ? `${API_BASE_URL}/hospitals/${hospitalForm.data('id')}`
                : `${API_BASE_URL}/hospitals`;
            const method = mode === 'edit' ? 'PUT' : 'POST';

            try {
                await $.ajax({
                    url: url,
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT_TOKEN}` },
                    data: JSON.stringify(hospitalData)
                });

                alert('Hospital saved successfully!');
                hospitalModal.removeClass('show');
                loadHospitals();

            } catch (error) {
                console.error('Error saving hospital:', error);
                alert(`Error saving hospital: ${error.responseJSON ? error.responseJSON.message : error.responseText}`);
            }
        });

        hospitalModal.find('.modal-close-btn').on('click', () => hospitalModal.removeClass('show'));
        hospitalModal.on('click', (e) => {
            if ($(e.target).is(hospitalModal)) hospitalModal.removeClass('show');
        });
    }

    window.deleteHospital = async (id) => {
        if (confirm(`Are you sure you want to delete hospital ${id}?`)) {
            try {
                await $.ajax({
                    url: `${API_BASE_URL}/hospitals/${id}`,
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                });
                alert(`Deleted hospital ${id}`);
                loadHospitals();
            } catch (error) {
                console.error('Error deleting hospital:', error);
                alert('Error deleting hospital.');
            }
        }
    };

    const clinicModal = $('#clinicModal');
    if (clinicModal.length) {
        const clinicForm = $('#clinicForm');
        const hospitalSelect = $('#clinicHospitalSelect');

        // Clinic Modal එක open කරන function එක
        window.openClinicModal = async () => {
            hospitalSelect.html('<option value="">Loading Hospitals...</option>').prop('disabled', true);
            clinicModal.addClass('show');

            try {
                const hospitals = await $.ajax({
                    url: `${API_BASE_URL}/hospitals`,
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                });

                hospitalSelect.html('<option value="">Select a Hospital</option>');
                if (hospitals.length > 0) {
                    hospitals.forEach(hospital => {
                        hospitalSelect.append(`<option value="${hospital.id}">${hospital.name}</option>`);
                    });
                    hospitalSelect.prop('disabled', false);
                } else {
                    hospitalSelect.html('<option value="">No hospitals found. Please add a hospital first.</option>');
                }

            } catch (error) {
                console.error("Error loading hospitals for clinic modal:", error);
                hospitalSelect.html('<option value="">Error loading hospitals</option>');
            }
        };

        // Clinic Modal එක වැසීම
        clinicModal.find('.modal-close-btn').on('click', () => clinicModal.removeClass('show'));
        clinicModal.on('click', (e) => {
            if ($(e.target).is(clinicModal)) clinicModal.removeClass('show');
        });

        // Clinic Form එක Submit කිරීම
        clinicForm.on('submit', async function (e) {
            e.preventDefault();

            const clinicData = {
                hospitalId: $('#clinicHospitalSelect').val(),
                name: $('#clinicName').val(),
                startTime: $('#clinicStartTime').val(),
                endTime: $('#clinicEndTime').val(),
            };

            if (!clinicData.hospitalId) {
                alert('Please select a hospital.');
                return;
            }

            console.log('Sending clinic data to backend:', clinicData);

            try {
                const result = await $.ajax({
                    url: `${API_BASE_URL}/clinics`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    },
                    data: JSON.stringify(clinicData)
                });

                alert(result.message || 'Clinic saved successfully!');

                clinicModal.removeClass('show');
                clinicForm[0].reset();
                loadClinics();

            } catch (error) {
                console.error('Error saving clinic:', error);
                alert(`Error: ${error.responseJSON ? error.responseJSON.message : error.responseText}`);
            }
        });
    }

    // ==========================================================
    // 3. PROFILE MODAL & OTHER FUNCTIONS
    // ==========================================================
    const profileModal = $('#profileModal');
    if (profileModal.length) {
        const openTrigger = $('#adminProfileTrigger');
        const profileForm = $('#profileForm');
        const avatarUploadInput = $('#avatarUpload');
        const profileModalAvatar = $('#profileModalAvatar');

        async function loadAndShowAdminProfile() {
            try {
                const profileData = await $.ajax({
                    url: `${API_BASE_URL}/profile`,
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                });

                $('#profileFirstName').val(profileData.firstName || '');
                $('#profileLastName').val(profileData.lastName || '');
                $('#profileEmail').val(profileData.email || '');
                const defaultAvatar = 'assets/img/default_avatar.jpg';
                if (profileData.avatarUrl) {
                    profileModalAvatar.attr('src', `http://localhost:8080${profileData.avatarUrl}`);
                } else {
                    profileModalAvatar.attr('src', defaultAvatar);
                }
                $('#profilePassword').val('');
                profileModal.addClass('show');
            } catch (error) {
                console.error('Error loading profile:', error);
                alert('Could not load profile data.');
            }
        }

        if (openTrigger.length) {
            openTrigger.on('click', loadAndShowAdminProfile);
        }

        profileModal.find('.modal-close-btn').on('click', () => profileModal.removeClass('show'));
        profileModal.on('click', (e) => {
            if ($(e.target).is(profileModal)) profileModal.removeClass('show');
        });

        if (avatarUploadInput.length) {
            avatarUploadInput.on('change', function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        profileModalAvatar.attr('src', e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (profileForm.length) {
            profileForm.on('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData();
                const profileData = {
                    firstName: $('#profileFirstName').val(),
                    lastName: $('#profileLastName').val(),
                    newPassword: $('#profilePassword').val()
                };
                formData.append('profileDto', new Blob([JSON.stringify(profileData)], { type: "application/json" }));
                const imageFile = avatarUploadInput[0].files[0];
                if (imageFile) {
                    formData.append('profileImage', imageFile);
                }
                try {
                    const result = await $.ajax({
                        url: `${API_BASE_URL}/profile`,
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` },
                        data: formData,
                        processData: false,
                        contentType: false
                    });
                    alert(result);
                    profileModal.removeClass('show');
                    $('#headerAdminName').text(`${profileData.firstName} ${profileData.lastName}`);
                    const headerAdminAvatar = $('#headerAdminAvatar');
                    if (imageFile) {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            headerAdminAvatar.attr('src', e.target.result);
                        };
                        reader.readAsDataURL(imageFile);
                    } else {
                        headerAdminAvatar.attr('src', profileModalAvatar.attr('src'));
                    }
                } catch (error) {
                    console.error('Error updating profile:', error);
                    alert('Error: Could not update profile. Check console for details.');
                }
            });
        }
    }

    // ===================================
    // 4. LOGOUT FUNCTION
    // ===================================
    window.logout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('jwtToken');
            window.location.href = '../HTML/login.html';
        }
    };

    // =================================================================
    // LOCATIONIQ SEARCH & UPDATED HOSPITAL MODAL LOGIC
    // =================================================================
    const LOCATIONIQ_API_KEY = 'pk.620a0f57de48be49621910e59f1a0ec9';
    let searchTimeout;
    const pageSearchInput = $('#hospitalSearchInput');
    const modalSearchInput = $('#modalHospitalSearchInput');
    const modalSearchResultsContainer = $('#modalHospitalSearchResults');
    const hospitalSearchStep = $('#hospitalSearchStep');
    const hospitalDetailsStep = $('#hospitalDetailsStep');
    const hospitalNameInput = $('#hospitalName');
    const hospitalLocationInput = $('#hospitalLocation');
    const saveHospitalBtn = $('#hospitalModal .btn-primary');

    async function fetchHospitalSuggestions(query) {
        const searchQuery = `hospital ${query}`;
        const url = `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=7&countrycodes=LK`;
        try {
            const data = await $.ajax({ url: url, method: 'GET' });
            modalSearchResultsContainer.empty();
            if (data && data.length > 0) {
                data.forEach(place => {
                    const displayNameParts = place.display_name.split(',');
                    const hospitalName = displayNameParts[0].trim();
                    const location = displayNameParts.slice(1).join(',').trim();
                    const item = `<div class="result-item" data-name="${hospitalName}" data-location="${location}"><i class="fas fa-map-marker-alt"></i><span><strong>${hospitalName}</strong><br><small>${location}</small></span></div>`;
                    modalSearchResultsContainer.append(item);
                });
            } else {
                modalSearchResultsContainer.html('<div class="result-item"><span>No results found.</span></div>');
            }
        } catch (error) {
            console.error("Error fetching suggestions from LocationIQ:", error);
            modalSearchResultsContainer.html('<div class="result-item"><span>Error searching.</span></div>');
        }
    }
    if (modalSearchInput.length) {
        modalSearchInput.on('keyup', () => {
            clearTimeout(searchTimeout);
            const query = modalSearchInput.val();
            if (query.length > 2) {
                searchTimeout = setTimeout(() => fetchHospitalSuggestions(query), 400);
            } else {
                modalSearchResultsContainer.empty();
            }
        });
    }
    if (modalSearchResultsContainer.length) {
        modalSearchResultsContainer.on('click', '.result-item', (e) => {
            const resultItem = $(e.target).closest('.result-item');
            if (resultItem.data('name')) {
                hospitalNameInput.val(resultItem.data('name')).prop('readonly', true);
                hospitalLocationInput.val(resultItem.data('location')).prop('readonly', true);
                hospitalSearchStep.hide();
                hospitalDetailsStep.show();
                modalSearchResultsContainer.empty();
                if (saveHospitalBtn.length) saveHospitalBtn.prop('disabled', false);
            }
        });
    }
    window.openHospitalModal = async function (mode, hospitalId = null) {
        const modalTitle = $('#modalTitle');
        const hospitalForm = $('#hospitalForm');
        hospitalForm[0].reset();
        hospitalForm.data('mode', mode).data('id', hospitalId || '');

        if (mode === 'edit' && hospitalId) {
            modalTitle.text('Edit Hospital');
            hospitalSearchStep.hide();
            hospitalDetailsStep.show();
            hospitalNameInput.prop('readonly', false);
            hospitalLocationInput.prop('readonly', false);
            try {
                const hospital = await $.ajax({
                    url: `${API_BASE_URL}/hospitals/${hospitalId}`,
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                });
                hospitalNameInput.val(hospital.name);
                hospitalLocationInput.val(hospital.location);
                $('#hospitalStatus').val(hospital.status.toLowerCase());
                $('#hospitalClinics').val(hospital.clinicCount);
                if (saveHospitalBtn.length) saveHospitalBtn.prop('disabled', false);
            } catch (error) {
                console.error('Error fetching hospital for edit:', error);
                alert('Could not load hospital data.');
                return;
            }
        } else { // 'add' mode
            modalTitle.text('Add New Hospital');
            hospitalDetailsStep.hide();
            hospitalSearchStep.show();
            if (modalSearchInput.length) modalSearchInput.val('');
            if (saveHospitalBtn.length) saveHospitalBtn.prop('disabled', true);
        }
        hospitalModal.addClass('show');
    };
    if (pageSearchInput.length && hospitalTableBody.length) {
        pageSearchInput.on('keyup', () => {
            const filter = pageSearchInput.val().toUpperCase();
            hospitalTableBody.find("tr").each(function () {
                let hospitalNameCell = $(this).find("td").eq(0);
                if (hospitalNameCell.length) {
                    let txtValue = hospitalNameCell.text();
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
            });
        });
    }

    // =======================================================
    // === MANAGE DOCTORS SECTION - MODAL LOGIC ===
    // =======================================================

    // --- Modal 1: Register Doctor ---
    const registerDoctorModal = $('#registerDoctorModal');
    if (registerDoctorModal.length) {
        const openRegisterBtn = $('#openRegisterModalBtn');
        const closeRegisterBtn = registerDoctorModal.find('.modal-close-btn');

        openRegisterBtn.on('click', () => {
            registerDoctorModal.addClass('show');
        });

        closeRegisterBtn.on('click', () => {
            registerDoctorModal.removeClass('show');
        });





        


// =======================================================
// === නිවැරදි සහ වැඩිදියුණු කළ JQUERY AJAX SUBMIT LOGIC ===
// =======================================================
$('#registerForm').on('submit', function (e) {
    e.preventDefault(); // Form එක submit වීම වැලැක්වීම

    // 1. Form එකෙන් දත්ත ලබාගෙන JavaScript object එකක් සෑදීම (වෙනසක් නැත)
    const doctorData = {
        slmcRegistrationNo: $('#slmcNo').val(),
        fullName: $('#fullName').val(),
        specialization: $('#specialization').val(),
        contactNumber: $('#contactNumber').val(),
        email: $('#email').val(),
        status: $('#status').val()
    };

    // --- Frontend Validation (වෙනසක් නැත) ---
    if (!doctorData.slmcRegistrationNo || !doctorData.fullName) {
        alert("Full Name and SLMC Registration Number are required.");
        return;
    }


    // 2. JWT Token එක Local Storage එකෙන් ලබාගැනීම (වෙනසක් නැත)
    const JWT_TOKEN = localStorage.getItem('jwtToken');
    if (!JWT_TOKEN) {
        alert('Authentication Error. Please log in again.');
        return;
    }

    // 3. Backend එකට දත්ත යැවීම සඳහා jQuery AJAX භාවිතා කිරීම
    $.ajax({
        url: "http://localhost:8080/api/v1/admin/doctors/saved", // API Endpoint එක
        type: 'POST', // HTTP Method එක
        headers: {
            'Authorization': `Bearer ${JWT_TOKEN}` // Security Token එක
        },
        contentType: 'application/json', // යවන දත්ත වර්ගය (JSON සඳහා මෙය අනිවාර්යයි)
        data: JSON.stringify(doctorData) // JavaScript object එක JSON string එකක් බවට පත් කර යැවීම
    })
    .done(function (result) {
        // 4a. Request එක සාර්ථක වූ විට (HTTP Status 2xx) මෙම කොටස ක්‍රියාත්මක වේ.
        // `result` යනු backend එකෙන් response body එකේ එවන දත්තයි.
        alert('Doctor registered successfully!');
        $('#registerDoctorModal').removeClass('show');
        // loadDoctors(); // අවශ්‍ය නම් Doctor table එක refresh කරන්න
    })
    .fail(function (jqXHR) {
        // 4b. Request එක අසාර්ථක වූ විට (HTTP Status 4xx, 5xx හෝ network error) මෙම කොටස ක්‍රියාත්මක වේ.
        // `jqXHR` object එකේ error එකට අදාළ සියලුම විස්තර අඩංගු වේ.
        const errorMessage = jqXHR.responseText || "Failed to register doctor. Please check the details and try again.";
        
        console.error('Error during doctor registration:', jqXHR.responseText);
        alert(`Registration failed: ${errorMessage}`);
    });
});


////////////////////////////////////////////////////////////////////////////




// =======================================================
// MANAGE DOCTORS - FINAL JQUERY LOGIC
// =======================================================

function loadDoctors() {
    const $doctorTableBody = $('#doctorTableBody');
    const JWT_TOKEN = localStorage.getItem('jwtToken');

    // 1. Loading State: දත්ත එනතුරු පණිවිඩයක් පෙන්වීම
    $doctorTableBody.empty().html('<tr><td colspan="5" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading doctors...</td></tr>');

    $.ajax({
        url: "http://localhost:8080/api/v1/admin/doctors/load", // **නිවැරදි URL එකට මාරු කරන ලදී**
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`
        }
    })
    .done(function (doctors) {
        // 2. Success: දත්ත සාර්ථකව ලැබුණු විට
        $doctorTableBody.empty();

        if (doctors && doctors.length > 0) {
            // 2a. Doctor ලා සිටීනම්, table එක build කිරීම
            $.each(doctors, function (index, doctor) {
                // Status එකට අදාළව CSS class එකක් සැකසීම
                const statusClass = doctor.status ? doctor.status.toLowerCase() : 'active';
                
                // === මෙතන තමයි Actions column එක icon buttons සමඟ සකසා ඇත්තේ ===
                const row = `
                    <tr>
                        <td>${doctor.fullName}</td>
                        <td>${doctor.slmcRegistrationNo}</td>
                        <td>${doctor.specialization || 'N/A'}</td>
                        <td><span class="status-badge status-${statusClass}">${doctor.status}</span></td>
                        <td class="action-buttons">
                            <!-- Update Button -->
                            <button class="btn-icon btn-update" data-doctor-id="${doctor.id}" title="Update Doctor">
                                <i class="fas fa-pen"></i>
                            </button>
                            <!-- Delete Button -->
                            <button class="btn-icon btn-delete" data-doctor-id="${doctor.id}" data-doctor-name="${doctor.fullName}" title="Delete Doctor">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                $doctorTableBody.append(row);
            });
        } else {
            // 2b. Doctor ලා කිසිවෙක් නැත්නම්
            $doctorTableBody.html('<tr><td colspan="5" style="text-align: center;">No doctors found. Register a new one to get started.</td></tr>');
        }
    })
    .fail(function (jqXR) {
        // 3. Failure: AJAX call එක අසාර්ථක වූ විට
        console.error("Failed to load doctors:", jqXHR.status, jqXHR.responseText);
        $doctorTableBody.empty().html('<tr><td colspan="5" style="text-align: center; color: red;">Error loading doctors. Please check the console.</td></tr>');
    });
}


    // 👉 Call doctors load here
    loadDoctors();




    }
    // --- Modal 2: Assign Doctor to Clinic (CORRECTED LOGIC) ---
    const assignClinicModal = $('#assignClinicModal');
    if (assignClinicModal.length) {
        const assignModalTitle = $('#assignModalTitle');
        const assignDoctorNameInput = $('#assignDoctorName');
        const closeAssignBtn = assignClinicModal.find('.modal-close-btn');

        $('body').on('click', '.assign-btn', function (event) {
            const assignButton = $(this); // Use $(this) directly
            const doctorName = assignButton.data('doctor-name');

            assignModalTitle.text(`Assign ${doctorName} to a Clinic`);
            assignDoctorNameInput.val(doctorName);

            assignClinicModal.addClass('show');
        });

        closeAssignBtn.on('click', () => {
            assignClinicModal.removeClass('show');
        });

        $('#assignForm').on('submit', function (e) {
            e.preventDefault();
            alert('Submitting assignment data to backend!');
            assignClinicModal.removeClass('show');
        });
    }

    // --- General: Close modals when clicking on the backdrop ---
    $(window).on('click', (event) => {
        if ($(event.target).is(registerDoctorModal)) {
            registerDoctorModal.removeClass('show');
        }
        if ($(event.target).is(assignClinicModal)) {
            assignClinicModal.removeClass('show');
        }
    });

    // =================================================================
    // === UPDATED & CORRECTED: MANAGE DOCTORS (ADD/EDIT/DELETE) LOGIC ===
    // =================================================================

    // --- Doctor Modal Elements ---
    const doctorTableBody = $('#doctorTableBody');
    const doctorModalTitle = $('#doctorModalTitle');
    const doctorForm = $('#registerForm');
    const doctorIdField = $('#doctorId');
    const saveDoctorBtn = $('#saveDoctorBtn');

    // --- Dummy Data (Backend එකෙන් data එනකන් test කරන්න) ---
    const doctorsData = {
        "1": { id: 1, fullName: 'Dr. Anura Silva', slmcNo: 'SLMC12345', specialization: 'Cardiologist', email: 'anura@mediqueue.com', contactNumber: '077111222', status: 'ACTIVE' },
        "2": { id: 2, fullName: 'Dr. Nimali Perera', slmcNo: 'SLMC54321', specialization: 'Neurologist', email: 'nimali@mediqueue.com', contactNumber: '071333444', status: 'ON_LEAVE' }
    };

    // --- Function to open the Doctor Modal in different modes ---
    function openDoctorModal(mode, doctorId = null) {
        doctorForm[0].reset();
        doctorForm.data('mode', mode);

        if (mode === 'add') {
            doctorModalTitle.html('<i class="fas fa-user-plus"></i> Register New Doctor');
            saveDoctorBtn.html('<i class="fas fa-save"></i> <span>Save Doctor</span>');
            doctorIdField.val('');
        }
        else if (mode === 'edit') {
            doctorModalTitle.html('<i class="fas fa-edit"></i> Update Doctor Details');
            saveDoctorBtn.html('<i class="fas fa-save"></i> <span>Update Changes</span>');

            const doctor = doctorsData[doctorId];
            if (doctor) {
                doctorIdField.val(doctor.id);
                $('#fullName').val(doctor.fullName);
                $('#slmcNo').val(doctor.slmcNo);
                $('#specialization').val(doctor.specialization);
                $('#email').val(doctor.email);
                $('#contactNumber').val(doctor.contactNumber);
                $('#status').val(doctor.status);
            }
        }

        registerDoctorModal.addClass('show');
    }

    // --- Event Listeners ---

    // 1. Listen for click on the main "Register New Doctor" button
    if (openRegisterBtn.length) {
        openRegisterBtn.on('click', () => {
            openDoctorModal('add'); // Open modal in 'add' mode
        });
    }

    // 2. Use Event Delegation for clicks inside the table (UPDATE and DELETE)
    if (doctorTableBody.length) {
        doctorTableBody.on('click', 'button.btn-icon', function (event) {
            const button = $(this);
            const doctorId = button.data('doctor-id');

            if (button.hasClass('btn-delete')) {
                const doctorName = button.data('doctor-name');
                if (confirm(`Are you sure you want to delete ${doctorName}?`)) {
                    console.log('DELETING DOCTOR ID:', doctorId);
                    button.closest('tr').remove();
                }
            }

            if (button.hasClass('btn-update')) {
                openDoctorModal('edit', doctorId);
            }
        });
    }

    // 3. Handle Form Submission for both ADD and UPDATE
    if (doctorForm.length) {
        doctorForm.on('submit', function (e) {
            e.preventDefault();
            const mode = doctorForm.data('mode');
            const currentDoctorId = doctorIdField.val();

            if (mode === 'add') {
                console.log('Submitting NEW doctor data...');
                alert('New doctor registered!');
            } else if (mode === 'edit') {
                console.log(`Submitting UPDATED data for ID: ${currentDoctorId}`);
                alert('Doctor details updated!');
            }

            registerDoctorModal.removeClass('show');
        });
    }

    // 4. Handle Modal Closing
    if (registerDoctorModal.length) {
        const closeRegisterBtn = registerDoctorModal.find('.modal-close-btn');
        if (closeRegisterBtn.length) {
            closeRegisterBtn.on('click', () => {
                registerDoctorModal.removeClass('show');
            });
        }

        registerDoctorModal.on('click', (event) => {
            if ($(event.target).is(registerDoctorModal)) {
                registerDoctorModal.removeClass('show');
            }
        });
    }

    


    

        







    // =================================================================
    // INITIAL PAGE LOAD ACTIONS
    // =================================================================
    loadAdminHeaderDetails();

    showSection('overview');
});

