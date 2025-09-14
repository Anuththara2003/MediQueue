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


// =======================================================
// === GENERIC MODAL CLOSING LOGIC (Works for ALL modals) ===
// =======================================================

$(document).on('click', '.modal-close-btn', function() {
    $(this).closest('.modal-backdrop').removeClass('show');
});

$(document).on('click', '.modal-backdrop', function(event) {
    
    if ($(event.target).is(this)) {
        $(this).removeClass('show');
    }
});



    window.showSection = function (sectionId) {
        $('.dashboard-section').removeClass('active');
        $('.nav-item').removeClass('active');

        $(`#${sectionId}`).addClass('active');
        $(`.nav-item[onclick="showSection('${sectionId}')"]`).addClass('active');

        if (sectionId === 'hospitals') {
            loadHospitals();
        } else if (sectionId === 'clinics') {
            loadClinics();
        
         } else if (sectionId === 'doctors') {
        
        loadDoctors(); 
        }
         else if (sectionId === 'users') { 
        loadUsers();

        }

        else if (sectionId === 'queue-management') {
        loadClinicsForQueueFilter();
        document.getElementById('queue-date-picker').valueAsDate = new Date();

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
// MANAGE DOCTORS - FINAL & CORRECTED JQUERY LOGIC
// =======================================================

// --- Function to Load Doctors into the Table ---
function loadDoctors() {
    const $doctorTableBody = $('#doctorTableBody');
    $doctorTableBody.empty().html('<tr><td colspan="5" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>');



    // =======================================================
// === "CREATE ASSIGNMENT" FORM SUBMISSION LOGIC ===
// =======================================================
$('#assignForm').on('submit', function(e) {
    e.preventDefault(); // Default form submission එක නවත්වනවා

    // 1. Form එකෙන් දත්ත ලබාගෙන object එකක් හදනවා
    const assignmentData = {
        doctorId: $('#assignDoctorSelect').val(),
        clinicId: $('#assignClinicSelect').val(),
        assignedDate: $('#assignDate').val(),
        startTime: $('#startTime').val(),
        endTime: $('#endTime').val()
    };
    
    // --- Frontend Validation ---
    if (!assignmentData.doctorId || !assignmentData.clinicId || !assignmentData.assignedDate || !assignmentData.startTime || !assignmentData.endTime) {
        alert("Please fill in all the required fields.");
        return;
    }

    // 2. Backend එකට AJAX POST request එක යැවීම
    $.ajax({
        url: `${API_BASE_URL}/assignments`, // අපි සෑදූ නව Controller එකේ URL එක
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(assignmentData) // Data, JSON string එකක් ලෙස යැවීම
    })
    .done(function(response) {
        // 3a. සාර්ථක වූ විට
        alert('Assignment created successfully!');
        $('#assignClinicModal').removeClass('show'); // Modal එක වැසීම
        // ඔබට අවශ්‍ය නම්, assignments පෙන්වන table එකක් refresh කළ හැක.
    })
    .fail(function(jqXHR) {
        // 3b. අසාර්ථක වූ විට
        const errorMessage = jqXHR.responseJSON ? jqXHR.responseJSON.message : jqXHR.responseText;
        alert(`Error creating assignment: ${errorMessage}`);
        console.error("Assignment creation failed:", jqXHR);
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    $.ajax({
        // Backend Controller: @GetMapping("/load")
        url: `${API_BASE_URL}/doctors/load`,
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    }).done(function (doctors) {
        $doctorTableBody.empty();
        if (doctors && doctors.length > 0) {
            $.each(doctors, function (index, doctor) {
                const row = `
                    <tr>
                        <td>${doctor.fullName}</td>
                        <td>${doctor.slmcRegistrationNo}</td>
                        <td>${doctor.specialization || 'N/A'}</td>
                        <td><span class="status-badge status-${doctor.status.toLowerCase()}">${doctor.status}</span></td>
                        <td class="action-buttons">
                            <button class="btn-icon btn-update" data-doctor-id="${doctor.id}" title="Update Doctor"><i class="fas fa-pen"></i></button>
                            <button class="btn-icon btn-delete" data-doctor-id="${doctor.id}" data-doctor-name="${doctor.fullName}" title="Delete Doctor"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>`;
                $doctorTableBody.append(row);
            });
        } else {
            $doctorTableBody.html('<tr><td colspan="5" style="text-align: center;">No doctors found.</td></tr>');
        }
    }).fail(function (jqXHR) {
        console.error("Error loading doctors:", jqXHR.status, jqXHR.responseText);
        $doctorTableBody.empty().html('<tr><td colspan="5" style="text-align: center; color: red;">Error loading doctors.</td></tr>');
    });
}


// --- "CREATE ASSIGNMENT" FORM SUBMISSION LOGIC ---
$('#assignForm').on('submit', function(e) {
    e.preventDefault();

    const assignmentData = {
        doctorId: $('#assignDoctorSelect').val(),
        clinicId: $('#assignClinicSelect').val(),
        assignedDate: $('#assignDate').val(),
        startTime: $('#startTime').val(),
        endTime: $('#endTime').val()
    };
    
    if (!assignmentData.doctorId || !assignmentData.clinicId || !assignmentData.assignedDate) {
        alert("Please select a doctor, clinic, and date.");
        return;
    }

    $.ajax({
        url: `${API_BASE_URL}/assignments`, // Backend Controller: @PostMapping("/assignments/create")
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(assignmentData)
    })
    .done(function() {
        alert('Assignment created successfully!');
        $('#assignClinicModal').removeClass('show');
    })
    .fail(function(jqXHR) {
        const errorMessage = jqXHR.responseJSON ? jqXHR.responseJSON.message : (jqXHR.responseText || "Unknown error");
        alert(`Error creating assignment: ${errorMessage}`);
    });
});






// --- Function to Open the Doctor Modal (Handles BOTH Add & Edit) ---
function openDoctorModal(mode, doctorId = null) {
    const $modal = $('#registerDoctorModal');
    const $form = $('#registerForm');
    
    $form[0].reset();
    $form.data('mode', mode);
    $form.data('id', doctorId || '');

    if (mode === 'add') {
        $('#doctorModalTitle').html('<i class="fas fa-user-plus"></i> Register New Doctor');
        $form.find('button[type="submit"]').html('<i class="fas fa-save"></i> Save Doctor');
        $modal.addClass('show');
    } 
    else if (mode === 'edit') {
        $('#doctorModalTitle').html('<i class="fas fa-edit"></i> Update Doctor Details');
        $form.find('button[type="submit"]').html('<i class="fas fa-sync-alt"></i> Update Changes');
        
        $.ajax({
            // Backend Controller: @GetMapping("/get/{doctorId}")
            url: `${API_BASE_URL}/doctors/get/${doctorId}`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
        }).done(function(doctor) {
            // Populate the form with the fetched data
            $('#fullName').val(doctor.fullName);
            $('#slmcNo').val(doctor.slmcRegistrationNo);
            $('#specialization').val(doctor.specialization);
            $('#contactNumber').val(doctor.contactNumber);
            $('#email').val(doctor.email);
            $('#status').val(doctor.status);
            $modal.addClass('show');
        }).fail(function() {
            alert('Error: Could not fetch doctor details for editing.');
        });
    }
}

// --- Event Listener for "Register New Doctor" Button ---
$('#openRegisterModalBtn').on('click', function() {
    openDoctorModal('add');
});


// =======================================================
// === ASSIGN DOCTOR TO CLINIC - COMPLETE LOGIC ===
// =======================================================

/**
 * "Assign" modal එක සඳහා අවශ්‍ය Doctors සහ Clinics ලැයිස්තු දෙකම
 * AJAX මගින් backend එකෙන් ලබාගන්නා function එක.
 */
function loadDataForAssignmentModal() {
    const $doctorSelect = $('#assignDoctorSelect');
    const $clinicSelect = $('#assignClinicSelect');

    // 1. Dropdowns "Loading..." state එකට පත් කිරීම
    $doctorSelect.prop('disabled', true).html('<option value="">Loading doctors...</option>');
    $clinicSelect.prop('disabled', true).html('<option value="">Loading clinics...</option>');

    // 2. AJAX call to fetch Doctors
    const doctorsRequest = $.ajax({
        url: `${API_BASE_URL}/doctors/load`, // සියලුම doctors ලා get කරන endpoint එක
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    });

    // 3. AJAX call to fetch Clinics
    const clinicsRequest = $.ajax({
        url: `${API_BASE_URL}/clinics`, // සියලුම clinics ලා get කරන endpoint එක
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    });

    // 4. AJAX calls දෙකම අවසන් වූ පසු, dropdowns පිරවීම
    // $.when() මගින් AJAX calls දෙකම එකවර යවා, දෙකම අවසන් වූ පසු .done() එක ක්‍රියාත්මක කරවයි.
    $.when(doctorsRequest, clinicsRequest).done(function(doctorsResponse, clinicsResponse) {
        
        // --- Doctor Dropdown පිරවීම ---
        const doctors = doctorsResponse[0]; // AJAX response එක array එකක එන නිසා, [0] යොදා data ටික ගන්නවා
        $doctorSelect.empty().append('<option value="">Select a doctor</option>');
        if (doctors && doctors.length > 0) {
            $.each(doctors, function(i, doctor) {
                $doctorSelect.append(`<option value="${doctor.id}">${doctor.fullName} (${doctor.specialization || 'N/A'})</option>`);
            });
            $doctorSelect.prop('disabled', false); // Dropdown එක enable කරනවා
        } else {
            $doctorSelect.html('<option value="">No doctors available</option>');
        }

        // --- Clinic Dropdown පිරවීම ---
        const clinics = clinicsResponse[0].data || clinicsResponse[0]; // ඔබගේ clinic response එක data object එකක් තුල එනවා විය හැක
        $clinicSelect.empty().append('<option value="">Select a clinic</option>');
        if (clinics && clinics.length > 0) {
            $.each(clinics, function(i, clinic) {
                $clinicSelect.append(`<option value="${clinic.id}">${clinic.name} (${clinic.hospitalName})</option>`);
            });
            $clinicSelect.prop('disabled', false); // Dropdown එක enable කරනවා
        } else {
             $clinicSelect.html('<option value="">No clinics available</option>');
        }

    }).fail(function() {
        // AJAX calls දෙකෙන් එකක් හෝ අසාර්ථක උනොත්
        console.error("Failed to load data (doctors or clinics) for assignment modal.");
        $doctorSelect.prop('disabled', true).html('<option value="">Error loading doctors</option>');
        $clinicSelect.prop('disabled', true).html('<option value="">Error loading clinics</option>');
    });
}

// --- Event Listener for "Assign to Clinic" Button ---
// මෙම button එක doctor table එකට පිටතින් ඇති නිසා, සරල click listener එකක් ප්‍රමාණවත්
$('#doctors .assign-btn').on('click', function() {
    const $modal = $('#assignClinicModal');
    
    // 1. Modal එක පෙන්වීමට පෙර, dropdowns වලට දත්ත load කරන function එක call කිරීම
    loadDataForAssignmentModal();
    
    // 2. Form එක reset කර, modal එක පෙන්වීම
    $('#assignForm')[0].reset();
    $('#assignModalTitle').text('Assign Doctor to Clinic');
    $modal.addClass('show');
});









// --- Event Listener for Doctor Form Submission (Handles BOTH Add & Update) ---
$('#registerForm').on('submit', function (e) {
    e.preventDefault();
    
    const mode = $(this).data('mode');
    const doctorId = $(this).data('id');

    const doctorData = {
        slmcRegistrationNo: $('#slmcNo').val(),
        fullName: $('#fullName').val(),
        specialization: $('#specialization').val(),
        contactNumber: $('#contactNumber').val(),
        email: $('#email').val(),
        status: $('#status').val()
    };

    let ajaxOptions = {
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` },
        contentType: 'application/json',
        data: JSON.stringify(doctorData)
    };

    if (mode === 'add') {
        // Backend Controller: @PostMapping("/saved")
        ajaxOptions.url = `${API_BASE_URL}/doctors/saved`;
        ajaxOptions.type = 'POST';
    } else if (mode === 'edit') {
        // Backend Controller: @PutMapping("/update/{doctorId}")
        ajaxOptions.url = `${API_BASE_URL}/doctors/update/${doctorId}`;
        ajaxOptions.type = 'PUT';
    }

    $.ajax(ajaxOptions)
    .done(function () {
        alert(`Doctor ${mode === 'edit' ? 'updated' : 'registered'} successfully!`);
        $('#registerDoctorModal').removeClass('show');
        loadDoctors(); // Refresh the table
    })
    .fail(function (jqXHR) {
        const errorMessage = jqXHR.responseText || `Failed to ${mode} doctor.`;
        alert(`Error: ${errorMessage}`);
    });
});

// --- Event Delegation for Update/Delete Buttons in the Table ---
$('#doctorTableBody').on('click', 'button.btn-icon', function() {
    const $button = $(this);
    const doctorId = $button.data('doctorId');
    
    if ($button.hasClass('btn-update')) {
        openDoctorModal('edit', doctorId);
    }
    
    if ($button.hasClass('btn-delete')) {
        const doctorName = $button.data('doctorName');
        if (confirm(`Are you sure you want to delete ${doctorName}?`)) {
            $.ajax({
                // Backend Controller: @DeleteMapping("/delete/{doctorId}")
                url: `${API_BASE_URL}/doctors/delete/${doctorId}`,
                type: 'DELETE',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            })
            .done(function() {
                alert(`${doctorName} has been deleted successfully.`);
                loadDoctors(); // Refresh the table
            })
            .fail(function() {
                alert(`Error: Could not delete ${doctorName}.`);
            });
        }
    }
});





// e.js (අනෙකුත් event listeners සමඟ, එකම තැනක)

// --- Event Delegation for User Table Actions (Update & Delete) ---
$('#userTableBody').on('click', 'button.btn-icon', function() {
    const $button = $(this);
    const userId = $button.data('userId');
    
    
    // DELETE button click
    if ($button.hasClass('btn-delete-user')) {
        if (confirm('Are you sure you want to delete this user?')) {
            // Backend එකට DELETE request එක යැවීම
            $.ajax({
                url: `${API_BASE_URL}/users/${userId}`,
                type: 'DELETE',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            })
            .done(function() {
                alert('User deleted successfully.');
                loadUsers(); // Table එක refresh කිරීම
            })
            .fail(function() {
                alert('Error: Could not delete the user.');
            });
        }
    }
});

// --- Event Listener for User Update Form Submission ---
$('#updateUserForm').on('submit', function(e) {
    e.preventDefault();

    const userId = $('#updateUserId').val();
    
    // 1. Form එකෙන් update වූ දත්ත ලබාගැනීම
    const updatedUserData = {
        firstName: $('#updateFirstName').val(),
        lastName: $('#updateLastName').val(),
        role: $('#updateUserRole').val()
    };
    
    // 2. Backend එකට PUT request එක යැවීම
    $.ajax({
        url: `${API_BASE_URL}/users/${userId}`,
        type: 'PUT',
        headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(updatedUserData)
    })
    .done(function() {
        alert('User updated successfully!');
        $('#updateUserModal').removeClass('show'); // Modal එක වැසීම
        loadUsers(); // Table එක refresh කිරීම
    })
    .fail(function(jqXHR) {
        const errorMsg = jqXHR.responseText || "Failed to update user.";
        alert(`Error: ${errorMsg}`);
    });
});

// --- Queue Management Listeners ---
$('#load-queue-btn').on('click', loadTokenQueue);




        // e.js (අනෙකුත් load functions සමඟ)
function loadUsers() {
    const $userTableBody = $('#userTableBody');
    $userTableBody.empty().html('<tr><td colspan="6" style="text-align: center;">Loading users...</td></tr>');

    $.ajax({
         url: `${API_BASE_URL}/users/patients`,
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    }).done(function (users) {
        $userTableBody.empty();
        if (users && users.length > 0) {
            $.each(users, function (index, user) {
                const row = `
                    <tr>
                        <td>${user.firstName} ${user.lastName}</td>
                        <td>${user.email}</td>
                        <td>${user.contactNumber}</td>
                        <td>${user.role}</td>
                        <td>${user.gender || 'N/A'}</td>
                        <td class="action-buttons">
                            
                            <button class="btn-icon btn-delete-user" data-user-id="${user.id}" title="Delete User"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>`;
                $userTableBody.append(row);
            });
        } else {
            $userTableBody.html('<tr><td colspan="6" style="text-align: center;">No users found.</td></tr>');
        }
    }).fail(function () {
        $userTableBody.empty().html('<tr><td colspan="6" style="text-align: center; color: red;">Error loading users.</td></tr>');
    });
}

// === QUEUE MANAGEMENT FUNCTIONS ===

/**
 * Loads all clinics into the queue filter dropdown.
 */
function loadClinicsForQueueFilter() {
    const $clinicSelect = $('#queue-clinic-select');
    $clinicSelect.html('<option value="">Loading clinics...</option>');

    $.ajax({
        url: `${API_BASE_URL}/clinics`, // Adjust this URL if needed
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    }).done(function(response) {
        const clinics = response.data || response;
        $clinicSelect.empty().append('<option value="">Select a Clinic</option>');
        $.each(clinics, function(i, clinic) {
            $clinicSelect.append(`<option value="${clinic.id}">${clinic.name} - ${clinic.hospitalName}</option>`);
        });
    }).fail(function() {
        $clinicSelect.html('<option value="">Error loading clinics</option>');
    });
}



// AdminDashboard.js -> $(document).ready() -> EVENT LISTENERS කොටසට
$('#add-record-form').on('submit', function(e) {
    e.preventDefault();

    const tokenId = $('#record-token-id').val();
    const recordData = {
        diagnosis: $('#record-diagnosis').val(),
        prescription: $('#record-prescription').val(),
        notes: $('#record-notes').val()
    };

    $.ajax({
        url: `${API_BASE_URL}/tokens/${tokenId}/record`,
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(recordData)
    }).done(function() {
        alert('Medical record saved successfully!');
        $('#add-record-modal').removeClass('show');
        loadTokenQueue(); // Queue table එක refresh කිරීම
    }).fail(function() {
        alert('Error: Could not save the medical record.');
    });
});



// AdminDashboard.js -> $(document).ready() -> EVENT LISTENERS කොටසට
$('#queue-table-body').on('click', '.btn-call', function() {
    const tokenId = $(this).data('tokenId');

    $('#record-token-id').val(tokenId);
    $('#add-record-form')[0].reset();
    $('#add-record-modal').addClass('show');
});

$('#queue-table-body').on('click', '.button_add_record', function() { // '.btn_add_record' -> '.btn-add-record'
    const tokenId = $(this).data('tokenId');

    if (!tokenId) {
        console.error("Token ID not found on the button!");
        return;
    }

    console.log("Add Record button clicked for Token ID:", tokenId);
    
    // Modal එකට අදාළ inputs නිවැරදිව select කර, ID එක set කර, reset කර, පෙන්වයි.
    $('#record-token-id').val(tokenId);
    $('#add-record-form')[0].reset();
    $('#add-record-modal').addClass('show');
});







function loadTokenQueue() {
    const clinicId = $('#queue-clinic-select').val();
    const date = $('#queue-date-picker').val();

    if (!clinicId || !date) {
        alert("Please select a clinic and a date.");
        return;
    }

    const $tbody = $('#queue-table-body');
    $tbody.html('<tr><td colspan="5" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading queue...</td></tr>');

    $.ajax({
        url: `${API_BASE_URL}/tokens/queue`,
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` },
        data: {
            clinicId: clinicId,
            date: date
        }
    }).done(function(tokens) {
        $tbody.empty();
        if (tokens && tokens.length > 0) {
            $.each(tokens, function(i, token) {
                
                // ====================================================================
                // === මෙන්න `callDisabled` error එකට අදාළ නිවැරදි කිරීම ===
                // ====================================================================
                
                // 1. Token status එක, null නම්, 'UNKNOWN' ලෙස සලකා, upper case කරනවා
                const tokenStatus = (token.status || 'UNKNOWN').toUpperCase();
                
                // 2. Token status එකට අනුව, button වල disabled තත්වය තීරණය කරනවා
                const callDisabled = (tokenStatus !== 'WAITING') ? 'disabled' : '';
                const completeSkipDisabled = (tokenStatus !== 'IN_PROGRESS') ? 'disabled' : '';

                // ====================================================================

                
                    // <button class="btn-queue-action btn-sm btn-primary btn-add-record" data-token-id="${token.tokenId}" ${completeSkipDisabled}>Call Next</button>
                    //          <button class="btn-queue-action btn-complete" data-token-id="${token.tokenId}" ${completeSkipDisabled}>Complete</button>
                    //          <button class="btn-queue-action btn-skip" data-token-id="${token.tokenId}" ${completeSkipDisabled}>Skip</button>






                const row = `
                    <tr data-status="${tokenStatus}">
                        <td><strong>${token.tokenNumber}</strong></td>
                        <td>${token.patientName}</td>
                        <td>${token.patientContact}</td>
                        <td><span class="status-badge status-${tokenStatus.toLowerCase()}">${tokenStatus}</span></td>
                        <td class="action-buttons">
                            <button class="btn-queue-action btn-call" data-token-id="${token.tokenId}" ${callDisabled}>Add Record</button>   
                             
                        </td>
                    </tr>`;
                $tbody.append(row);
            });
        } else {
            $tbody.html('<tr><td colspan="5" style="text-align: center;">No tokens found for the selected clinic and date.</td></tr>');
        }
    }).fail(function() {
        $tbody.html('<tr><td colspan="5" style="text-align: center; color: red;">Failed to load the queue.</td></tr>');
    });
}




// =======================================================
// === REPORTS & ANALYTICS LOGIC ===
// =======================================================

let tokenDistributionChart; // Chart object එක ගබඩා කර තබාගැනීමට global variable එකක්

/**
 * Renders or updates the token distribution bar chart.
 * @param {object} chartData - Data from the backend, e.g., {"Hospital A": 120, "Hospital B": 85}
 */
function renderTokenDistributionChart(chartData) {
    const chartCanvas = document.getElementById('token-distribution-chart');
    if (!chartCanvas) return;
    
    const ctx = chartCanvas.getContext('2d');
    const labels = Object.keys(chartData); // e.g., ["Hospital A", "Hospital B"]
    const dataPoints = Object.values(chartData); // e.g., [120, 85]

    // If a chart instance already exists, destroy it before creating a new one
    if (tokenDistributionChart) {
        tokenDistributionChart.destroy();
    }

    tokenDistributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Tokens',
                data: dataPoints,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Tokens'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide the legend if there's only one dataset
                }
            }
        }
    });
}

// --- "Apply" Button Click Event Listener ---
$('#apply-analytics-filter').on('click', function() {
    const startDate = $('#dateRangeStart').val();
    const endDate = $('#dateRangeEnd').val();

    if (!startDate || !endDate) {
        alert("Please select both a start and end date for the report.");
        return;
    }
    
    // Show a loading state on the cards
    $('#total-tokens, #avg-wait-time, #busiest-clinic, #sms-sent').text('...');

    // AJAX call to the backend analytics endpoint
    $.ajax({
        
            url: `${API_BASE_URL}/tokens/analytics/report`,
            type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` },
        data: {
            startDate: startDate,
            endDate: endDate
        }
    }).done(function(analytics) {
        // Update the stat cards with the fetched data
        $('#total-tokens').text(analytics.totalTokens.toLocaleString()); // Add commas for thousands
        $('#avg-wait-time').text(`${Math.round(analytics.averageWaitTimeMinutes)} mins`);
        $('#busiest-clinic').text(analytics.busiestClinic || 'N/A');
        $('#sms-sent').text(analytics.smsSentCount.toLocaleString());

        // Call the function to render the bar chart
        if (analytics.tokenDistributionByHospital) {
            renderTokenDistributionChart(analytics.tokenDistributionByHospital);
        }
    }).fail(function() {
        alert("Failed to load analytics data. Please try again.");
        // Reset cards to default values on failure
        $('#total-tokens').text('0');
        $('#avg-wait-time').text('0 mins');
        $('#busiest-clinic').text('N/A');
        $('#sms-sent').text('0');
    });
});






    // =================================================================
    // INITIAL PAGE LOAD ACTIONS
    // =================================================================
    loadAdminHeaderDetails();
    showSection('overview');
});

