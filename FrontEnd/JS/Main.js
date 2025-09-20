// =======================================================
// MEDIQUEUE ADMIN DASHBOARD - FINAL & COMPLETE JS FILE (jQuery/AJAX/SweetAlert2)
// =======================================================

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

    // --- CONFIGURATION ---
    const API_BASE_URL = 'http://localhost:8080/api/v1/admin';
    const JWT_TOKEN = localStorage.getItem('jwtToken');
    const API_BASE_URL_GENERAL = 'http://localhost:8080/api/v1'; // Base URL without /admin

    // --- SECURITY CHECK ---
    if (!JWT_TOKEN) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'Authentication token not found. Please log in.',
            confirmButtonText: 'Go to Login'
        }).then(() => {
            window.location.href = '../HTML/login.html';
        });
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
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: 'Error loading admin header details!',
            });
            console.error('Error loading admin header details:', error);
        }
    }





    // ==========================================================
    // CLINIC MANAGEMENT - PAGINATION සමග (සම්පූර්ණ කේතය)
    // ==========================================================

    // --- DOM Element References ---
    // HTML elements ටික variables වලට අරගන්නවා.
    const clinicTableBody = $('#clinicTableBody');
    const clinicPaginationContainer = $('#clinicPagination');

    // --- State Management ---
    // Clinics section එකේ වත්මන් තත්ත්වය මතක තියාගන්න variables.
    let clinicCurrentPage = 0; // Clinics වලට අදාළව current page එක (backend එකේ 0 වලින් පටන් ගන්නේ)
    const clinicPageSize = 9; // එක පිටුවක පෙන්වන දත්ත ගණන (ඔබට අවශ්‍ය ලෙස වෙනස් කරන්න)

    // ------------------------------------------------------------------
    // 1. ප්‍රධාන Function: Clinic දත්ත API එකෙන් ගෙන ඒම
    // ------------------------------------------------------------------
    async function loadClinics(page) {
        // Table එකක් නැත්නම් function එක නවත්වන්න
        if (!clinicTableBody.length) {
            console.error("Clinic table body not found!");
            return;
        }

        // දත්ත load වෙනකොට පෙන්වන පණිවිඩය
        clinicTableBody.html('<tr><td colspan="6">Loading clinics...</td></tr>');

        // Backend එකට යවන query parameters
        const searchParams = {
            page: page,
            size: clinicPageSize
        };

        try {
            // API එක call කිරීම
            const response = await $.ajax({
                url: 'http://localhost:8080/api/v1/admin/clinics', // మీ API URL එක
                method: 'GET',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }, // మీ JWT TOKEN
                data: searchParams // Pagination parameters ටික යැවීම
            });

            const pageData = response.data; // Backend එකෙන් එන Page object එක

            // Table එක සහ Pagination controls අලුතෙන් render කිරීම
            renderClinicTable(pageData.content);
            renderClinicPagination(pageData);

            // වත්මන් පිටු අංකය update කිරීම
            clinicCurrentPage = pageData.number;

        } catch (error) {
            console.error("Error loading clinics:", error);
            clinicTableBody.html('<tr><td colspan="6" class="error-message">Could not load clinic data. Please try again.</td></tr>');
        }
    }

    // ----------------------------------------------------
    // 2. Clinic Table එකේ දත්ත render කරන function එක
    // ----------------------------------------------------
    function renderClinicTable(clinics) {
        clinicTableBody.empty(); // පරණ දත්ත ඉවත් කිරීම

        if (!clinics || clinics.length === 0) {
            clinicTableBody.append('<tr><td colspan="6">No clinics found.</td></tr>');
        } else {
            clinics.forEach((clinic) => {
                // ඔබගේ DTO එකේ hospitalName field එකක් තියෙනවා නම්, එය පාවිච්චි කරන්න
                // නැත්නම් clinic.hospital.name වගේ nested object එකක් වෙන්නත් පුළුවන්
                const hospitalName = clinic.hospitalName || (clinic.hospital ? clinic.hospital.name : 'N/A');

                const row = `
                    <tr>
                        <td>${clinic.id}</td>
                        <td>${clinic.name}</td>
                        <td>${hospitalName}</td>
                        <td>${clinic.startTime || 'N/A'}</td>
                        <td>${clinic.endTime || 'N/A'}</td>
                        <td class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="editClinic(${clinic.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteClinic(${clinic.id})">Delete</button>
                        </td>
                    </tr>
                `;
                clinicTableBody.append(row);
            });
        }
    }

    // ----------------------------------------------------
    // 3. Pagination buttons සහ පිටු ගණන render කරන function එක
    // ----------------------------------------------------
    function renderClinicPagination(pageData) {
        clinicPaginationContainer.empty();
        if (pageData.totalPages <= 1) return; // පිටු 1කට වඩා නැත්නම් controls පෙන්වන්න එපා

        const currentPageNumber = pageData.number; // 0-based index
        const totalPages = pageData.totalPages;

        let paginationHtml = '';
        
        // "Page X of Y" ලෙස පෙන්වීම
        paginationHtml += `<span class="page-count">Page ${currentPageNumber + 1} of ${totalPages}</span>`;
        
        // Previous Button
        paginationHtml += `<button class="pagination-btn" data-page="${currentPageNumber - 1}" ${pageData.first ? 'disabled' : ''}>&laquo; Prev</button>`;
        
        // Next Button
        paginationHtml += `<button class="pagination-btn" data-page="${currentPageNumber + 1}" ${pageData.last ? 'disabled' : ''}>Next &raquo;</button>`;

        clinicPaginationContainer.append(paginationHtml);
    }

    // ------------------------------------------------------------------
    // 4. Event Listeners
    // ------------------------------------------------------------------
    // Pagination container එකේ button එකක් click කළ විට...
    clinicPaginationContainer.on('click', 'button', function() {
        const page = $(this).data('page');
        // page අගයක් තියෙනවා නම් සහ button එක disabled නැත්නම්...
        if (page !== undefined && !$(this).is(':disabled')) {
            loadClinics(page); // අදාළ පිටුව load කරන්න
        }
    });

    // ----------------------------------------------------
    // 5. Initial Load Function
    // ----------------------------------------------------
    // පිටතින් (උදා: tab එකක් click කළ විට) call කිරීමට හැකි වන පරිදි
    // මෙම function එක window object එකට assign කරමු.
    window.loadAllClinics = function() {
         loadClinics(0); // හැමවිටම පළවෙනි පිටුවෙන් (0) පටන් ගන්න
    }















    // // === Clinic Management ===
    // window.loadClinics = async function () {
    //     try {
    //         const result = await $.ajax({
    //             url: `${API_BASE_URL}/clinics`,
    //             method: 'GET',
    //             headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    //         });

    //         const clinics = result.data || result;
    //         const clinicTableBody = $('#clinicTableBody');

    //         if (!clinicTableBody.length) {
    //             console.error("Table body with id 'clinicTableBody' not found!");
    //             return;
    //         }

    //         clinicTableBody.empty();

    //         if (clinics.length === 0) {
    //             clinicTableBody.append('<tr><td colspan="6">No clinics found.</td></tr>');
    //         } else {
    //             clinics.forEach((clinic) => {
    //                 const row = `
    //                     <tr>
    //                         <td>${clinic.id}</td>
    //                         <td>${clinic.name}</td>
    //                         <td>${clinic.hospitalName}</td>
    //                         <td>${clinic.startTime}</td>
    //                         <td>${clinic.endTime}</td>
    //                         <td>
    //                             <button class="btn btn-sm btn-primary" onclick="editClinic(${clinic.id})">Edit</button>
    //                             <button class="btn btn-sm btn-danger" onclick="deleteClinic(${clinic.id})">Delete</button>
    //                         </td>
    //                     </tr>
    //                 `;
    //                 clinicTableBody.append(row);
    //             });
    //         }

    //     } catch (error) {
    //         console.error("Error loading clinics:", error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Loading Failed',
    //             text: 'Could not load clinic data.'
    //         });
    //     }
    // };

    // Delete Clinic
    window.deleteClinic = function (id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await $.ajax({
                        url: `${API_BASE_URL_GENERAL}/clinics/${id}`,
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                    });
                    Swal.fire(
                        'Deleted!',
                        'The clinic has been deleted.',
                        'success'
                    );
                    loadClinics();
                } catch (error) {
                    console.error("Error deleting clinic:", error);
                    const errorMessage = error.responseJSON ? error.responseJSON.message : error.responseText;
                    Swal.fire({
                        icon: 'error',
                        title: 'Deletion Failed',
                        text: `Error deleting clinic: ${errorMessage}`
                    });
                }
            }
        });
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
            const errorMessage = error.responseJSON ? error.responseJSON.message : error.responseText;
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Could not load clinic data: ${errorMessage}`
            });
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
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Form',
                text: 'Please select a hospital.'
            });
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

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Clinic ${mode === 'edit' ? 'updated' : 'added'} successfully!`
            });

            $(this)[0].reset();
            $(this).data('mode', 'add').data('id', '');
            $('#clinicModal').removeClass('show');
            loadClinics();
        } catch (error) {
            console.error(error);
            const errorMessage = error.responseJSON ? error.responseJSON.message : error.responseText;
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: `Error: ${errorMessage}`
            });
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

    $(document).on('click', '.modal-close-btn', function () {
        $(this).closest('.modal-backdrop').removeClass('show');
    });

    $(document).on('click', '.modal-backdrop', function (event) {
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
            loadClinics(0);

        } else if (sectionId === 'doctors') {

            loadDoctors(0);
        }
        else if (sectionId === 'users') {
            loadUsers(0);

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

    // --- DOM Element References ---
    const hospitalSearchInput = $('#hospitalSearchInput');
    const hospitalSearchSuggestions = $('#hospitalSearchSuggestions');
    const hospitalPaginationContainer = $('#hospitalPagination');

    // --- State Management ---
    let currentPage = 0;
    let currentSearchTerm = "";
    const pageSize = 8;


    // --- Utility Function: Debounce ---
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        }
    }

    // ------------------------------------------------------------------
    // 1. ප්‍රධාන Function: Table එක සඳහා දත්ත API එකෙන් ගෙන ඒම
    // ------------------------------------------------------------------
    async function loadHospitals(page, searchTerm) {
        if (!hospitalTableBody.length) return;
        hospitalTableBody.html('<tr><td colspan="5">Loading data...</td></tr>');

        const searchParams = { page: page, size: pageSize };
        if (searchTerm && searchTerm.trim() !== '') {
            searchParams.search = searchTerm.trim();
        }

        try {
            const response = await $.ajax({
                url: 'http://localhost:8080/api/v1/admin/hospitals',
                method: 'GET',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` },
                data: searchParams
            });
            const pageData = response.data;
            renderHospitalTable(pageData.content);
            renderHospitalPagination(pageData);
            currentPage = pageData.number;
            currentSearchTerm = searchTerm || "";
        } catch (error) {
            console.error('Error loading hospitals:', error);
            hospitalTableBody.html(`<tr><td colspan="5" class="error-message">Error loading data. Please try again.</td></tr>`);
        }
    }

    // ----------------------------------------------------
    // 2. Table එකේ දත්ත render කරන function එක
    // ----------------------------------------------------
    function renderHospitalTable(hospitals) {
        hospitalTableBody.empty();
        if (!hospitals || hospitals.length === 0) {
            hospitalTableBody.append(`<tr><td colspan="5">No hospitals found matching your criteria.</td></tr>`);
        } else {
            hospitals.forEach(h => {
                const row = `
                    <tr>
                        <td>${h.name || 'N/A'}</td>
                        <td>${h.location || 'N/A'}</td>
                        <td>${h.clinicCount !== null ? h.clinicCount : 0}</td>
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
    }

    // ----------------------------------------------------
    // 3. Pagination buttons සහ පිටු ගණන render කරන function එක
    // ----------------------------------------------------
    function renderHospitalPagination(pageData) {
        hospitalPaginationContainer.empty();
        if (pageData.totalPages <= 1) return;
        const currentPageNumber = pageData.number;
        const totalPages = pageData.totalPages;
        let paginationHtml = `<span class="page-count">Page ${currentPageNumber + 1} of ${totalPages}</span>`;
        paginationHtml += `<button class="pagination-btn" data-page="${currentPageNumber - 1}" ${pageData.first ? 'disabled' : ''}>&laquo; Prev</button>`;
        paginationHtml += `<button class="pagination-btn" data-page="${currentPageNumber + 1}" ${pageData.last ? 'disabled' : ''}>Next &raquo;</button>`;
        hospitalPaginationContainer.append(paginationHtml);
    }

    // ------------------------------------------------------------------
    // 4. Search Suggestions (Dropdown) සඳහා දත්ත ගෙන ඒම
    // ------------------------------------------------------------------
    async function fetchAndShowSuggestions(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            hospitalSearchSuggestions.hide().empty();
            return;
        }
        try {
            // *** කරුණාකර ඔබේ suggestions endpoint URL එක නිවැරදි දැයි තහවුරු කරගන්න ***
            const response = await $.ajax({
                url: `http://localhost:8080/api/v1/admin/suggestions?search=${searchTerm.trim()}`,
                method: 'GET',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            });
            const suggestions = response.data;
            hospitalSearchSuggestions.empty();
            if (suggestions && suggestions.length > 0) {
                suggestions.forEach(name => {
                    hospitalSearchSuggestions.append(`<div class="suggestion-item">${name}</div>`);
                });
                hospitalSearchSuggestions.show();
            } else {
                hospitalSearchSuggestions.hide();
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            hospitalSearchSuggestions.hide();
        }
    }

    // ==================================================================
    // 5. Event Listeners (මෙම කොටස ඉතා වැදගත්)
    // ==================================================================

    // A. Search Bar එකේ type කරන විට suggestions ගෙන ඒමට 'input' event එක
    //    මෙමගින් කිසිම විටෙක `loadHospitals` call කරන්නේ නැත.
    hospitalSearchInput.on('input', debounce(function() {
        fetchAndShowSuggestions($(this).val());
    }, 400));

    // B. 'Enter' එබූ විට හෝ search bar එක හිස් කළ විට Table එක search කිරීමට 'keyup' event එක
    hospitalSearchInput.on('keyup', function(event) {
        const searchTerm = $(this).val();
        // Enter key එක press කළා නම් හෝ search bar එක හිස් නම්...
        if (event.key === 'Enter' || searchTerm === '') {
            hospitalSearchSuggestions.hide(); // Dropdown එක සඟවන්න
            // Search term එක වෙනස් වෙලා නම් විතරක් API call එක යවන්න
            if (searchTerm !== currentSearchTerm) {
                loadHospitals(0, searchTerm); // 0 පිටුවෙන් search එක පටන් ගන්න
            }
        }
    });

    // C. Suggestion Dropdown එකේ item එකක් click කළ විට
    hospitalSearchSuggestions.on('click', '.suggestion-item', function() {
        const selectedName = $(this).text();
        hospitalSearchInput.val(selectedName); // Input එකට නම දානවා
        hospitalSearchSuggestions.hide().empty(); // Dropdown එක සඟවනවා
        loadHospitals(0, selectedName); // Table එක load කරනවා
    });

    // D. Pagination button එකක් click කළ විට
    hospitalPaginationContainer.on('click', 'button', function() {
        const page = $(this).data('page');
        if (page !== undefined && !$(this).is(':disabled')) {
            loadHospitals(page, currentSearchTerm);
        }
    });

    // E. Dropdown එකෙන් පිට කොහේ හරි click කළොත් එය සඟවන්න
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-container').length) {
            hospitalSearchSuggestions.hide();
        }
    });

    // Page එක load වෙනකොට පළවෙනි වතාවට දත්ත ගෙන ඒම
    loadHospitals(currentPage, currentSearchTerm);


    // // --- Utility Function: Debounce ---
    // function debounce(func, delay) {
    //     let debounceTimer;
    //     return function() {
    //         const context = this;
    //         const args = arguments;
    //         clearTimeout(debounceTimer);
    //         debounceTimer = setTimeout(() => func.apply(context, args), delay);
    //     }
    // }

    // // ------------------------------------------------------------------
    // // 1. ප්‍රධාන Function: Table එක සඳහා දත්ත API එකෙන් ගෙන ඒම (නිවැරදි කරන ලදී)
    // // ------------------------------------------------------------------
    // async function loadHospitals(page, searchTerm) {
    //     if (!hospitalTableBody.length) return;
    //     hospitalTableBody.html('<tr><td colspan="5">Loading data...</td></tr>');

    //     // Backend එකට යැවිය යුතු Query Parameters
    //     const searchParams = {
    //         page: page,
    //         size: pageSize
    //     };

    //     // searchTerm එකක් තියෙනවා නම් විතරක් එය parameters වලට එකතු කිරීම
    //     if (searchTerm && searchTerm.trim() !== '') {
    //         searchParams.search = searchTerm.trim();
    //     }

    //     try {
    //         // *** වැදගත්ම වෙනස: 'data' property එක හරහා searchParams යැවීම ***
    //         const response = await $.ajax({
    //             url: 'http://localhost:8080/api/v1/admin/hospitals', // ඔබේ URL එක
    //             method: 'GET',
    //             headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }, // ඔබේ JWT TOKEN
    //             data: searchParams // <<<<<<<<<<<<<<< මෙන්න නිවැරදි කිරීම
    //         });

    //         const pageData = response.data;
    //         renderHospitalTable(pageData.content);
    //         renderHospitalPagination(pageData); // Pagination එක render කිරීම
    //         currentPage = pageData.number;
    //         currentSearchTerm = searchTerm || "";

    //     } catch (error) {
    //         console.error('Error loading hospitals:', error);
    //         hospitalTableBody.html(`<tr><td colspan="5" class="error-message">Error loading data. Please try again.</td></tr>`);
    //     }
    // }

    // // ----------------------------------------------------
    // // 2. Table එකේ දත්ත render කරන function එක (වෙනසක් නැත)
    // // ----------------------------------------------------
    // function renderHospitalTable(hospitals) {
    //     hospitalTableBody.empty();
    //     if (!hospitals || hospitals.length === 0) {
    //         hospitalTableBody.append(`<tr><td colspan="5">No hospitals found matching your criteria.</td></tr>`);
    //     } else {
    //         hospitals.forEach(h => {
    //             const row = `
    //                 <tr>
    //                     <td>${h.name || 'N/A'}</td>
    //                     <td>${h.location || 'N/A'}</td>
    //                     <td>${h.clinicCount !== null ? h.clinicCount : 0}</td>
    //                     <td><span class="status-badge status-${h.status ? h.status.toLowerCase() : 'inactive'}">${h.status || 'N/A'}</span></td>
    //                     <td class="action-buttons">
    //                         <button class="btn-icon btn-warning" onclick="openHospitalModal('edit', '${h.id}')"><i class="fas fa-pen"></i></button>
    //                         <button class="btn-icon btn-danger" onclick="deleteHospital('${h.id}')"><i class="fas fa-trash"></i></button>
    //                     </td>
    //                 </tr>
    //             `;
    //             hospitalTableBody.append(row);
    //         });
    //     }
    // }

    // // ----------------------------------------------------
    // // 3. Pagination buttons සහ පිටු ගණන render කරන function එක (දියුණු කරන ලදී)
    // // ----------------------------------------------------
    // function renderHospitalPagination(pageData) {
    //     hospitalPaginationContainer.empty();
    //     if (pageData.totalPages <= 1) return; // පිටු එකකට වඩා නැත්නම් මුකුත් පෙන්වන්න එපා

    //     const currentPageNumber = pageData.number; // 0-based
    //     const totalPages = pageData.totalPages;

    //     let paginationHtml = '';

    //     // Page Count එක පෙන්වීම
    //     paginationHtml += `<span class="page-count">Page ${currentPageNumber + 1} of ${totalPages}</span>`;

    //     // Previous Button
    //     paginationHtml += `<button class="pagination-btn" data-page="${currentPageNumber - 1}" ${pageData.first ? 'disabled' : ''}>&laquo; Prev</button>`;

    //     // Next Button
    //     paginationHtml += `<button class="pagination-btn" data-page="${currentPageNumber + 1}" ${pageData.last ? 'disabled' : ''}>Next &raquo;</button>`;

    //     hospitalPaginationContainer.append(paginationHtml);
    // }

    // // ------------------------------------------------------------------
    // // 4. Search Suggestions (Dropdown) සඳහා දත්ත ගෙන ඒම (වෙනසක් නැත)
    // // ------------------------------------------------------------------
    // async function fetchAndShowSuggestions(searchTerm) {
    //     if (!searchTerm || searchTerm.trim() === '') {
    //         hospitalSearchSuggestions.hide().empty();
    //         return;
    //     }
    //     try {
    //         const response = await $.ajax({
    //             // *** ඔබේ suggestions endpoint URL එක නිවැරදිව යොදන්න ***
    //             url: `http://localhost:8080/api/v1/admin/suggestions?search=${searchTerm.trim()}`,
    //             method: 'GET',
    //             headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    //         });
    //         const suggestions = response.data;

    //         console.log(suggestions);
            

    //         hospitalSearchSuggestions.empty();
    //         if (suggestions && suggestions.length > 0) {
    //             suggestions.forEach(name => {
    //                 hospitalSearchSuggestions.append(`<div class="suggestion-item">${name}</div>`);
    //             });
    //             hospitalSearchSuggestions.show();
    //         } else {
    //             hospitalSearchSuggestions.hide();
    //         }
    //     } catch (error) {
    //         console.error('Error fetching suggestions:', error);
    //         hospitalSearchSuggestions.hide();
    //     }
    // }

    // // ------------------------------------------------------------------
    // // 5. Event Listeners (ඔබගේ අවශ්‍යතාවයට අනුව සකස් කර ඇත)
    // // ------------------------------------------------------------------

    // // A. Search Bar එකේ type කරන විට suggestions ගෙන ඒමට 'input' event එක
    // hospitalSearchInput.on('input', debounce(function() {
    //     fetchAndShowSuggestions($(this).val());
    // }, 400));

    // // B. 'Enter' එබූ විට හෝ search bar එක හිස් කළ විට Table එක search කිරීමට 'keyup' event එක
    // hospitalSearchInput.on('keyup', function(event) {
    //     const searchTerm = $(this).val();
    //     if (event.key === 'Enter' || searchTerm === '') {
    //         hospitalSearchSuggestions.hide();
    //         if (searchTerm !== currentSearchTerm) {
    //             loadHospitals(0, searchTerm);
    //         }
    //     }
    // });

    // // C. Suggestion Dropdown එකේ item එකක් click කළ විට
    // hospitalSearchSuggestions.on('click', '.suggestion-item', function() {
    //     const selectedName = $(this).text();
    //     hospitalSearchInput.val(selectedName);
    //     hospitalSearchSuggestions.hide().empty();
    //     loadHospitals(0, selectedName);
    // });

    // // D. Pagination button එකක් click කළ විට
    // hospitalPaginationContainer.on('click', 'button', function() {
    //     const page = $(this).data('page');
    //     if (page !== undefined && !$(this).is(':disabled')) {
    //         loadHospitals(page, currentSearchTerm);
    //     }
    // });

    // // E. Dropdown එකෙන් පිට කොහේ හරි click කළොත් එය සඟවන්න
    // $(document).on('click', function(e) {
    //     if (!$(e.target).closest('.search-container').length) {
    //         hospitalSearchSuggestions.hide();
    //     }
    // });

    // // Page එක load වෙනකොට පළවෙනි වතාවට දත්ත ගෙන ඒම
    // loadHospitals(currentPage, currentSearchTerm);









    // async function loadHospitals() {
    //     if (!hospitalTableBody.length) return;
    //     try {
    //         const hospitals = await $.ajax({
    //             url: `${API_BASE_URL}/hospitals`,
    //             method: 'GET',
    //             headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    //         });

    //         hospitalTableBody.empty();

    //         if (hospitals.length === 0) {
    //             hospitalTableBody.append(`<tr><td colspan="5">No hospitals found. Add a new one to get started.</td></tr>`);
    //         } else {
    //             hospitals.forEach(h => {
    //                 const row = `
    //                     <tr>
    //                         <td>${h.name || 'N/A'}</td>
    //                         <td>${h.location || 'N/A'}</td>
    //                         <td>${h.clinicCount || 0}</td>
    //                         <td><span class="status-badge status-${h.status ? h.status.toLowerCase() : 'inactive'}">${h.status || 'N/A'}</span></td>
    //                         <td class="action-buttons">
    //                             <button class="btn-icon btn-warning" onclick="openHospitalModal('edit', '${h.id}')"><i class="fas fa-pen"></i></button>
    //                             <button class="btn-icon btn-danger" onclick="deleteHospital('${h.id}')"><i class="fas fa-trash"></i></button>
    //                         </td>
    //                     </tr>
    //                 `;
    //                 hospitalTableBody.append(row);
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error loading hospitals:', error);
    //         hospitalTableBody.html(`<tr><td colspan="5" style="color: red;">Error loading data. Check console for details.</td></tr>`);
    //     }
    // }

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
                Swal.fire('Success!', 'Hospital saved successfully!', 'success');
                hospitalModal.removeClass('show');
                loadHospitals();

            } catch (error) {
                console.error('Error saving hospital:', error);
                const errorMessage = error.responseJSON ? error.responseJSON.message : error.responseText;
                Swal.fire({
                    icon: 'error',
                    title: 'Save Failed',
                    text: `Error saving hospital: ${errorMessage}`
                });
            }
        });

        hospitalModal.find('.modal-close-btn').on('click', () => hospitalModal.removeClass('show'));
        hospitalModal.on('click', (e) => {
            if ($(e.target).is(hospitalModal)) hospitalModal.removeClass('show');
        });
    }

    window.deleteHospital = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You won't be able to revert the deletion of hospital ${id}!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await $.ajax({
                        url: `${API_BASE_URL}/hospitals/${id}`,
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                    });
                    Swal.fire('Deleted!', `Hospital ${id} has been deleted.`, 'success');
                    loadHospitals();
                } catch (error) {
                    console.error('Error deleting hospital:', error);
                    Swal.fire('Error!', 'Error deleting hospital.', 'error');
                }
            }
        });
    };






    const clinicModal = $('#clinicModal');
    if (clinicModal.length) {

        // ===== මෙලෙස එය නිවැරදි කරන්න (FIXED CODE) =====

        const clinicModal = $('#clinicModal');

        // (FIXED) ශ්‍රිතය if block එකෙන් පිටතට ගෙන ඇත. එම නිසා එය සැමවිටම පවතී.
        // Clinic Modal එක open කරන function එක
        window.openClinicModal = async () => {
            // ශ්‍රිතය ඇතුළත ඇති සියලුම කේතය නොවෙනස්ව පවතී
            const hospitalSelect = $('#clinicHospitalSelect');
            hospitalSelect.html('<option value="">Loading Hospitals...</option>').prop('disabled', true);
            clinicModal.addClass('show');

            try {
                const hospitals = await $.ajax({
                    url: `${API_BASE_URL}/hospitals_names`,
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

        // if block එක තවමත් අවශ්‍යයි, නමුත් එහි ඇත්තේ modal එකට අදාළ event listeners පමණි
        if (clinicModal.length) {
            const clinicForm = $('#clinicForm');

            // Clinic Modal එක වැසීම
            clinicModal.find('.modal-close-btn').on('click', () => clinicModal.removeClass('show'));
            clinicModal.on('click', (e) => {
                if ($(e.target).is(clinicModal)) clinicModal.removeClass('show');
            });

            // Clinic Form එක Submit කිරීම (මෙම කොටස ඔබගේ මුල් කේතයේ වෙනත් තැනක තිබුනේ නම්, එය එලෙසම තබන්න)
            clinicForm.on('submit', async function (e) {
                e.preventDefault();

                const clinicData = {
                    hospitalId: $('#clinicHospitalSelect').val(),
                    name: $('#clinicName').val(),
                    startTime: $('#clinicStartTime').val(),
                    endTime: $('#clinicEndTime').val(),
                };

                if (!clinicData.hospitalId) {
                    Swal.fire('Incomplete Form', 'Please select a hospital.', 'warning');
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

                    Swal.fire('Success!', result.message || 'Clinic saved successfully!', 'success');

                    clinicModal.removeClass('show');
                    clinicForm[0].reset();
                    loadClinics();

                } catch (error) {
                    console.error('Error saving clinic:', error);
                    const errorMessage = error.responseJSON ? error.responseJSON.message : error.responseText;
                    Swal.fire('Error', `Error: ${errorMessage}`, 'error');
                }
            });
        }

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
                Swal.fire('Error', 'Could not load profile data.', 'error');
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
                    Swal.fire('Success!', result, 'success'); // Assuming result is a success message string
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
                    Swal.fire('Error!', 'Could not update profile. Check console for details.', 'error');
                }
            });
        }
    }

    // ===================================
    // 4. LOGOUT FUNCTION
    // ===================================
    window.logout = () => {
        Swal.fire({
            title: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('jwtToken');
                window.location.href = '../HTML/login.html';
            }
        });
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
                Swal.fire('Error!', 'Could not load hospital data.', 'error');
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



    // ==========================================================
    // DOCTOR MANAGEMENT - PAGINATION සමග (සම්පූර්ණ කේතය)
    // ==========================================================

    // --- DOM Element References ---
    const doctorTableBody = $('#doctorTableBody');
    const doctorPaginationContainer = $('#doctorPagination'); // නිවැරදි කරන ලද ID එක

    // --- State Management ---
    let doctorCurrentPage = 0; // Doctors section එකේ වත්මන් පිටුව
    const doctorPageSize = 4; // එක පිටුවක පෙන්වන දත්ත ගණන

    // ------------------------------------------------------------------
    // 1. ප්‍රධාන Function: Doctor දත්ත API එකෙන් ගෙන ඒම
    // ------------------------------------------------------------------
    async function loadDoctors(page) {
        // Table body එක HTML එකේ නැත්නම් function එක නවත්වන්න
        if (!doctorTableBody.length) {
            console.error("Doctor table body not found!");
            return;
        }

        // දත්ත load වෙනකොට පෙන්වන loading spinner එක
        doctorTableBody.html('<tr><td colspan="5" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>');

        // Backend එකට යවන query parameters
        const searchParams = {
            page: page,
            size: doctorPageSize
        };

        try {
            // API එක call කිරීම (ඔබේ නව backend endpoint එකට)
            const response = await $.ajax({
                url: 'http://localhost:8080/api/v1/admin/doctors/load', // <<<<---- ඔබගේ නිවැරදි URL එක
                method: 'GET',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` },
                data: searchParams // Pagination parameters ටික යැවීම
            });

            const pageData = response.data; // Backend එකෙන් එන Page object එක

            // Table එක සහ Pagination controls අලුතෙන් render කිරීම
            renderDoctorTable(pageData.content);
            renderDoctorPagination(pageData);

            // වත්මන් පිටු අංකය update කිරීම
            doctorCurrentPage = pageData.number;

        } catch (error) {
            console.error("Error loading doctors:", error);
            doctorTableBody.html('<tr><td colspan="5" style="text-align: center; color: red;">Error loading doctors.</td></tr>');
        }
    }

    // ----------------------------------------------------
    // 2. Doctor Table එකේ දත්ත render කරන function එක
    // ----------------------------------------------------
    function renderDoctorTable(doctors) {
        doctorTableBody.empty(); // පරණ දත්ත ඉවත් කිරීම

        if (!doctors || doctors.length === 0) {
            doctorTableBody.html('<tr><td colspan="5" style="text-align: center;">No doctors found.</td></tr>');
        } else {
            doctors.forEach((doctor) => {

                const row = `
                    <tr>
                        <td>${doctor.fullName || 'N/A'}</td>
                        <td>${doctor.slmcRegistrationNo || 'N/A'}</td>
                        <td>${doctor.specialization || 'N/A'}</td>
                        <td><span class="status-badge status-${doctor.status ? doctor.status.toLowerCase() : 'inactive'}">${doctor.status || 'N/A'}</span></td>
                        <td class="action-buttons">
                            <button class="btn-icon btn-update" data-doctor-id="${doctor.id}" title="Update Doctor"><i class="fas fa-pen"></i></button>
                            <button class="btn-icon btn-delete" data-doctor-id="${doctor.id}" data-doctor-name="${doctor.fullName}" title="Delete Doctor"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>`;
                doctorTableBody.append(row);
            });
        }
    }

    // ----------------------------------------------------
    // 3. Pagination buttons සහ පිටු ගණන render කරන function එක
    // ----------------------------------------------------
    function renderDoctorPagination(pageData) {
        doctorPaginationContainer.empty();
        if (pageData.totalPages <= 1) return; // පිටු 1කට වඩා නැත්නම් controls පෙන්වන්න එපා

        const currentPageNumber = pageData.number;
        const totalPages = pageData.totalPages;

        let paginationHtml = '';
        paginationHtml += `<span class="page-count">Page ${currentPageNumber + 1} of ${totalPages}</span>`;
        paginationHtml += `<button class="pagination-btn" data-page="${currentPageNumber - 1}" ${pageData.first ? 'disabled' : ''}>&laquo; Prev</button>`;
        paginationHtml += `<button class="pagination-btn" data-page="${currentPageNumber + 1}" ${pageData.last ? 'disabled' : ''}>Next &raquo;</button>`;

        doctorPaginationContainer.append(paginationHtml);
    }

    // ------------------------------------------------------------------
    // 4. Event Listeners
    // ------------------------------------------------------------------
    // Pagination container එකේ button එකක් click කළ විට...
    doctorPaginationContainer.on('click', 'button', function() {
        const page = $(this).data('page');
        if (page !== undefined && !$(this).is(':disabled')) {
            loadDoctors(page);
        }
    });

    // ----------------------------------------------------
    // 5. Initial Load Function
    // ----------------------------------------------------
    // පිටතින් (උදා: tab එකක් click කළ විට) call කිරීමට හැකි වන පරිදි
    // මෙම function එක window object එකට assign කරමු.
    window.loadAllDoctors = function() {
         loadDoctors(0); // හැමවිටම පළවෙනි පිටුවෙන් (0) පටන් ගන්න
    }




    // function loadDoctors() {
    //     const $doctorTableBody = $('#doctorTableBody');
    //     $doctorTableBody.empty().html('<tr><td colspan="5" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>');

    //     $.ajax({
    //         url: `${API_BASE_URL}/doctors/load`,
    //         type: 'GET',
    //         headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    //     }).done(function (doctors) {
    //         $doctorTableBody.empty();
    //         if (doctors && doctors.length > 0) {
    //             $.each(doctors, function (index, doctor) {
    //                 const row = `
    //                 <tr>
    //                     <td>${doctor.fullName}</td>
    //                     <td>${doctor.slmcRegistrationNo}</td>
    //                     <td>${doctor.specialization || 'N/A'}</td>
    //                     <td><span class="status-badge status-${doctor.status.toLowerCase()}">${doctor.status}</span></td>
    //                     <td class="action-buttons">
    //                         <button class="btn-icon btn-update" data-doctor-id="${doctor.id}" title="Update Doctor"><i class="fas fa-pen"></i></button>
    //                         <button class="btn-icon btn-delete" data-doctor-id="${doctor.id}" data-doctor-name="${doctor.fullName}" title="Delete Doctor"><i class="fas fa-trash"></i></button>
    //                     </td>
    //                 </tr>`;
    //                 $doctorTableBody.append(row);
    //             });
    //         } else {
    //             $doctorTableBody.html('<tr><td colspan="5" style="text-align: center;">No doctors found.</td></tr>');
    //         }
    //     }).fail(function (jqXHR) {
    //         console.error("Error loading doctors:", jqXHR.status, jqXHR.responseText);
    //         $doctorTableBody.empty().html('<tr><td colspan="5" style="text-align: center; color: red;">Error loading doctors.</td></tr>');
    //     });
    // }


    // =======================================================
    // === "CREATE ASSIGNMENT" FORM SUBMISSION LOGIC ===
    // =======================================================
    $('#assignForm').on('submit', function (e) {
        e.preventDefault();

        const assignmentData = {
            doctorId: $('#assignDoctorSelect').val(),
            clinicId: $('#assignClinicSelect').val(),
            assignedDate: $('#assignDate').val(),
            startTime: $('#startTime').val(),
            endTime: $('#endTime').val()
        };

        if (!assignmentData.doctorId || !assignmentData.clinicId || !assignmentData.assignedDate || !assignmentData.startTime || !assignmentData.endTime) {
            Swal.fire('Incomplete Form', "Please fill in all the required fields.", 'warning');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/assignments`,
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(assignmentData)
        })
            .done(function () {
                Swal.fire('Success!', 'Assignment created successfully!', 'success');
                $('#assignClinicModal').removeClass('show');
            })
            .fail(function (jqXHR) {
                const errorMessage = jqXHR.responseJSON ? jqXHR.responseJSON.message : jqXHR.responseText;
                Swal.fire('Error!', `Error creating assignment: ${errorMessage}`, 'error');
                console.error("Assignment creation failed:", jqXHR);
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
                url: `${API_BASE_URL}/doctors/get/${doctorId}`,
                type: 'GET',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            }).done(function (doctor) {
                $('#fullName').val(doctor.fullName);
                $('#slmcNo').val(doctor.slmcRegistrationNo);
                $('#specialization').val(doctor.specialization);
                $('#contactNumber').val(doctor.contactNumber);
                $('#email').val(doctor.email);
                $('#status').val(doctor.status);
                $modal.addClass('show');
            }).fail(function () {
                Swal.fire('Error', 'Could not fetch doctor details for editing.', 'error');
            });
        }
    }

    // --- Event Listener for "Register New Doctor" Button ---
    $('#openRegisterModalBtn').on('click', function () {
        openDoctorModal('add');
    });


    // =======================================================
    // === ASSIGN DOCTOR TO CLINIC - COMPLETE LOGIC ===
    // =======================================================
    function loadDataForAssignmentModal() {
        const $doctorSelect = $('#assignDoctorSelect');
        const $clinicSelect = $('#assignClinicSelect');

        $doctorSelect.prop('disabled', true).html('<option value="">Loading doctors...</option>');
        $clinicSelect.prop('disabled', true).html('<option value="">Loading clinics...</option>');

        const doctorsRequest = $.ajax({
            url: `${API_BASE_URL}/doctors/load_doctors`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
        });

        const clinicsRequest = $.ajax({
            url: `${API_BASE_URL}/clinics_names`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
        });

        $.when(doctorsRequest, clinicsRequest).done(function (doctorsResponse, clinicsResponse) {

            const doctors = doctorsResponse[0];
            $doctorSelect.empty().append('<option value="">Select a doctor</option>');
            if (doctors && doctors.length > 0) {
                $.each(doctors, function (i, doctor) {
                    $doctorSelect.append(`<option value="${doctor.id}">${doctor.fullName} (${doctor.specialization || 'N/A'})</option>`);
                });
                $doctorSelect.prop('disabled', false);
            } else {
                $doctorSelect.html('<option value="">No doctors available</option>');
            }

            const clinics = clinicsResponse[0].data || clinicsResponse[0];
            $clinicSelect.empty().append('<option value="">Select a clinic</option>');
            if (clinics && clinics.length > 0) {
                $.each(clinics, function (i, clinic) {
                    $clinicSelect.append(`<option value="${clinic.id}">${clinic.name} (${clinic.hospitalName})</option>`);
                });
                $clinicSelect.prop('disabled', false);
            } else {
                $clinicSelect.html('<option value="">No clinics available</option>');
            }

        }).fail(function () {
            console.error("Failed to load data (doctors or clinics) for assignment modal.");
            $doctorSelect.prop('disabled', true).html('<option value="">Error loading doctors</option>');
            $clinicSelect.prop('disabled', true).html('<option value="">Error loading clinics</option>');
        });
    }

    // --- Event Listener for "Assign to Clinic" Button ---
    $('#doctors .assign-btn').on('click', function () {
        const $modal = $('#assignClinicModal');
        loadDataForAssignmentModal();
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
            ajaxOptions.url = `${API_BASE_URL}/doctors/saved`;
            ajaxOptions.type = 'POST';
        } else if (mode === 'edit') {
            ajaxOptions.url = `${API_BASE_URL}/doctors/update/${doctorId}`;
            ajaxOptions.type = 'PUT';
        }

        $.ajax(ajaxOptions)
            .done(function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: `Doctor ${mode === 'edit' ? 'updated' : 'registered'} successfully!`
                });
                $('#registerDoctorModal').removeClass('show');
                loadDoctors(); // Refresh the table
            })
            .fail(function (jqXHR) {
                const errorMessage = jqXHR.responseText || `Failed to ${mode} doctor.`;
                Swal.fire('Error!', `Error: ${errorMessage}`, 'error');
            });
    });

    // --- Event Delegation for Update/Delete Buttons in the Table ---
    $('#doctorTableBody').on('click', 'button.btn-icon', function () {
        const $button = $(this);
        const doctorId = $button.data('doctorId');

        if ($button.hasClass('btn-update')) {
            openDoctorModal('edit', doctorId);
        }

        if ($button.hasClass('btn-delete')) {
            const doctorName = $button.data('doctorName');
            Swal.fire({
                title: `Delete ${doctorName}?`,
                text: "This action cannot be undone.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Yes, delete!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: `${API_BASE_URL}/doctors/delete/${doctorId}`,
                        type: 'DELETE',
                        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                    })
                        .done(function () {
                            Swal.fire('Deleted!', `${doctorName} has been deleted.`, 'success');
                            loadDoctors();
                        })
                        .fail(function () {
                            Swal.fire('Error!', `Could not delete ${doctorName}.`, 'error');
                        });
                }
            });
        }
    });


    // --- Event Delegation for User Table Actions (Delete) ---
    $('#userTableBody').on('click', 'button.btn-delete-user', function () {
        const userId = $(this).data('userId');

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete user'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${API_BASE_URL}/users/${userId}`,
                    type: 'DELETE',
                    headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                })
                    .done(function () {
                        Swal.fire('Deleted!', 'User has been deleted successfully.', 'success');
                        loadUsers();
                    })
                    .fail(function () {
                        Swal.fire('Error', 'Could not delete the user.', 'error');
                    });
            }
        });
    });


    // --- Queue Management Listeners ---
    $('#load-queue-btn').on('click', loadTokenQueue);






     // ==========================================================
    // PATIENT MANAGEMENT - PAGINATION සමග (සම්පූර්ණ කේතය)
    // ==========================================================

    // --- DOM Element References ---
    const patientTableBody = $('#userTableBody'); // ඔබගේ HTML එකේ ID එක 'userTableBody'
    const patientPaginationContainer = $('#patientPagination'); // අපි අලුතින් එකතු කළ ID එක

    // --- State Management ---
    let patientCurrentPage = 0; // Patients section එකේ වත්මන් පිටුව
    const patientPageSize = 3; // එක පිටුවක පෙන්වන දත්ත ගණන

    // ------------------------------------------------------------------
    // 1. ප්‍රධාන Function: Patient දත්ත API එකෙන් ගෙන ඒම
    // ------------------------------------------------------------------
    async function loadUsers(page) {
        // Table body එක HTML එකේ නැත්නම් function එක නවත්වන්න
        if (!patientTableBody.length) {
            console.error("Patient table body ('userTableBody') not found!");
            return;
        }

        // දත්ත load වෙනකොට පෙන්වන loading spinner එක
        patientTableBody.html('<tr><td colspan="6" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading patients...</td></tr>');

        // Backend එකට යවන query parameters
        const searchParams = {
            page: page,
            size: patientPageSize
        };

        try {
            // API එක call කිරීම (ඔබේ නව backend endpoint එකට)
            const response = await $.ajax({
                url: 'http://localhost:8080/api/v1/admin/users/patients', // <<<<---- ඔබගේ නිවැරදි URL එක
                method: 'GET',
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` },
                data: searchParams // Pagination parameters ටික යැවීම
            });

            const pageData = response.data; // Backend එකෙන් එන Page object එක

            // Table එක සහ Pagination controls අලුතෙන් render කිරීම
            renderPatientTable(pageData.content);
            renderPatientPagination(pageData);

            // වත්මන් පිටු අංකය update කිරීම
            patientCurrentPage = pageData.number;

        } catch (error) {
            console.error("Error loading patients:", error);
            patientTableBody.html('<tr><td colspan="6" style="text-align: center; color: red;">Error loading patients.</td></tr>');
        }
    }

    // ----------------------------------------------------
    // 2. Patient Table එකේ දත්ත render කරන function එක
    // ----------------------------------------------------
    function renderPatientTable(patients) {
        patientTableBody.empty(); // පරණ දත්ත ඉවත් කිරීම

        if (!patients || patients.length === 0) {
            patientTableBody.html('<tr><td colspan="6" style="text-align: center;">No patients found.</td></tr>');
        } else {
            patients.forEach((patient) => {
                const row = `
                    <tr>
                        <td>${patient.firstName || ''} ${patient.lastName || ''}</td>
                        <td>${patient.email || 'N/A'}</td>
                        <td>${patient.contactNumber || 'N/A'}</td>
                        <td><span class="role-badge role-${patient.role ? patient.role.toLowerCase() : ''}">${patient.role || 'N/A'}</span></td>
                        <td>${patient.gender || 'N/A'}</td>
                        <td class="action-buttons">
                            <button class="btn-icon btn-delete-user" data-user-id="${patient.id}" title="Delete Patient"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>`;
                patientTableBody.append(row);
            });
        }
    }

    // ----------------------------------------------------
    // 3. Pagination buttons සහ පිටු ගණන render කරන function එක
    // ----------------------------------------------------
    function renderPatientPagination(pageData) {
        patientPaginationContainer.empty();
        if (pageData.totalPages <= 1) return; // පිටු 1කට වඩා නැත්නම් controls පෙන්වන්න එපා

        const currentPageNumber = pageData.number;
        const totalPages = pageData.totalPages;

        let paginationHtml = '';
        paginationHtml += `<span class="page-count">Page ${currentPageNumber + 1} of ${totalPages}</span>`;
        paginationHtml += `<button class="pagination-btn" data-page="${currentPageNumber - 1}" ${pageData.first ? 'disabled' : ''}>&laquo; Prev</button>`;
        paginationHtml += `<button class="pagination-btn" data-page="${currentPageNumber + 1}" ${pageData.last ? 'disabled' : ''}>Next &raquo;</button>`;

        patientPaginationContainer.append(paginationHtml);
    }

    // ------------------------------------------------------------------
    // 4. Event Listeners
    // ------------------------------------------------------------------
    // Pagination container එකේ button එකක් click කළ විට...
    patientPaginationContainer.on('click', 'button', function() {
        const page = $(this).data('page');
        if (page !== undefined && !$(this).is(':disabled')) {
            loadUsers(page);
        }
    });

    // ----------------------------------------------------
    // 5. Initial Load Function
    // ----------------------------------------------------
    // පිටතින් (උදා: tab එකක් click කළ විට) call කිරීමට හැකි වන පරිදි
    // මෙම function එක window object එකට assign කරමු.
    window.loadAllPatients = function() {
         loadUsers(0); // හැමවිටම පළවෙනි පිටුවෙන් (0) පටන් ගන්න
    }





    // --- Load Users Function ---
    // function loadUsers() {
    //     const $userTableBody = $('#userTableBody');
    //     $userTableBody.empty().html('<tr><td colspan="6" style="text-align: center;">Loading users...</td></tr>');

    //     $.ajax({
    //         url: `${API_BASE_URL}/users/patients`,
    //         type: 'GET',
    //         headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    //     }).done(function (users) {
    //         $userTableBody.empty();
    //         if (users && users.length > 0) {
    //             $.each(users, function (index, user) {
    //                 const row = `
    //                 <tr>
    //                     <td>${user.firstName} ${user.lastName}</td>
    //                     <td>${user.email}</td>
    //                     <td>${user.contactNumber}</td>
    //                     <td>${user.role}</td>
    //                     <td>${user.gender || 'N/A'}</td>
    //                     <td class="action-buttons">
    //                         <button class="btn-icon btn-delete-user" data-user-id="${user.id}" title="Delete User"><i class="fas fa-trash"></i></button>
    //                     </td>
    //                 </tr>`;
    //                 $userTableBody.append(row);
    //             });
    //         } else {
    //             $userTableBody.html('<tr><td colspan="6" style="text-align: center;">No users found.</td></tr>');
    //         }
    //     }).fail(function () {
    //         $userTableBody.empty().html('<tr><td colspan="6" style="text-align: center; color: red;">Error loading users.</td></tr>');
    //     });
    // }

    // === QUEUE MANAGEMENT FUNCTIONS ===
    function loadClinicsForQueueFilter() {
        const $clinicSelect = $('#queue-clinic-select');
        $clinicSelect.html('<option value="">Loading clinics...</option>');

        $.ajax({
            url: 'http://localhost:8080/api/v1/admin/clinics_names',
            type: 'GET',
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
        }).done(function (response) {
            const clinics = response.data || response;
            $clinicSelect.empty().append('<option value="">Select a Clinic</option>');
            $.each(clinics, function (i, clinic) {
                $clinicSelect.append(`<option value="${clinic.id}">${clinic.name} - ${clinic.hospitalName}</option>`);
            });
        }).fail(function () {
            $clinicSelect.html('<option value="">Error loading clinics</option>');
        });
    }


    $('#add-record-form').on('submit', function (e) {
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
                // 'Content-Type': 'application/json'
            },
            data: JSON.stringify(recordData)
        }).done(function () {
            Swal.fire('Success', 'Medical record saved successfully!', 'success');
            $('#add-record-modal').removeClass('show');
            loadTokenQueue();
        }).fail(function () {
            Swal.fire('Error', 'Could not save the medical record.', 'error');
        });
    });


    // === QUEUE TABLE ACTION BUTTONS - COMPLETE EVENT LISTENERS ===
    function updateTokenStatus(tokenId, newStatus) {
        $.ajax({
            url: `${API_BASE_URL}/tokens/${tokenId}/status?newStatus=${newStatus}`,
            type: 'PATCH',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`
            }
        })
            .done(function () {
                console.log(`Token ${tokenId} status updated to ${newStatus}`);
                loadTokenQueue();
            })
            .fail(function () {
                Swal.fire('Error', `Could not update token status to ${newStatus}.`, 'error');
            });
    }

    $('#queue-table-body').on('click', '.btn-queue-action', function () {
        const $button = $(this);
        const tokenId = $button.data('tokenId');

        if (!tokenId) { return; }

        if ($button.hasClass('btn-call')) {
            updateTokenStatus(tokenId, 'IN_PROGRESS');
        }

        if ($button.hasClass('btn-complete')) {
            updateTokenStatus(tokenId, 'COMPLETED');
        }

        if ($button.hasClass('btn-skip')) {
            updateTokenStatus(tokenId, 'SKIPPED');
        }

        if ($button.hasClass('btn-add-record')) {
            $('#record-token-id').val(tokenId);
            $('#add-record-form')[0].reset();
            $('#add-record-modal').addClass('show');
        }
    });


    function loadTokenQueue() {
        const clinicId = $('#queue-clinic-select').val();
        const date = $('#queue-date-picker').val();

        if (!clinicId || !date) {
            Swal.fire('Missing Information', "Please select a clinic and a date.", 'warning');
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
        }).done(function (tokens) {
            $tbody.empty();
            if (tokens && tokens.length > 0) {
                $.each(tokens, function (i, token) {
                    const tokenStatus = (token.status || 'UNKNOWN').toUpperCase();
                    const callDisabled = (tokenStatus !== 'WAITING') ? 'disabled' : '';
                    const completeSkipDisabled = (tokenStatus !== 'IN_PROGRESS') ? 'disabled' : '';
                    const row = `
                    <tr data-status="${tokenStatus}">
                        <td><strong>${token.tokenNumber}</strong></td>
                        <td>${token.patientName}</td>
                        <td>${token.patientContact}</td>
                        <td><span class="status-badge status-${tokenStatus.toLowerCase()}">${tokenStatus}</span></td>
                        <td class="action-buttons">
                            <button class="btn-queue-action btn-call" data-token-id="${token.tokenId}" ${callDisabled}>Call Next</button>  
                            <button class="btn-queue-action btn-sm btn-primary btn-add-record" data-token-id="${token.tokenId}" ${completeSkipDisabled}>Add Record</button>
                            <button class="btn-queue-action btn-complete" data-token-id="${token.tokenId}" ${completeSkipDisabled}>Complete</button>
                            <button class="btn-queue-action btn-skip" data-token-id="${token.tokenId}" ${completeSkipDisabled}>Skip</button>
                        </td>
                    </tr>`;
                    $tbody.append(row);
                });
            } else {
                $tbody.html('<tr><td colspan="5" style="text-align: center;">No tokens found for the selected clinic and date.</td></tr>');
            }
        }).fail(function () {
            $tbody.html('<tr><td colspan="5" style="text-align: center; color: red;">Failed to load the queue.</td></tr>');
        });
    }


    // =======================================================
    // === REPORTS & ANALYTICS LOGIC ===
    // =======================================================
    let tokenDistributionChart;

    function renderTokenDistributionChart(chartData) {
        const chartCanvas = document.getElementById('token-distribution-chart');
        if (!chartCanvas) return;

        const ctx = chartCanvas.getContext('2d');
        const labels = Object.keys(chartData);
        const dataPoints = Object.values(chartData);

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
                    y: { beginAtZero: true, title: { display: true, text: 'Number of Tokens' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    $('#apply-analytics-filter').on('click', function () {
        const startDate = $('#dateRangeStart').val();
        const endDate = $('#dateRangeEnd').val();

        if (!startDate || !endDate) {
            Swal.fire('Invalid Date Range', "Please select both a start and end date for the report.", 'warning');
            return;
        }

        $('#total-tokens, #avg-wait-time, #busiest-clinic, #sms-sent').text('...');

        $.ajax({
            url: `${API_BASE_URL}/tokens/analytics/report`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` },
            data: { startDate: startDate, endDate: endDate }
        }).done(function (analytics) {
            $('#total-tokens').text(analytics.totalTokens.toLocaleString());
            $('#avg-wait-time').text(`${Math.round(analytics.averageWaitTimeMinutes)} mins`);
            $('#busiest-clinic').text(analytics.busiestClinic || 'N/A');
            $('#sms-sent').text(analytics.smsSentCount.toLocaleString());
            if (analytics.tokenDistributionByHospital) {
                renderTokenDistributionChart(analytics.tokenDistributionByHospital);
            }
        }).fail(function () {
            Swal.fire('Error', "Failed to load analytics data. Please try again.", 'error');
            $('#total-tokens').text('0');
            $('#avg-wait-time').text('0 mins');
            $('#busiest-clinic').text('N/A');
            $('#sms-sent').text('0');
        });
    });


    // =======================================================
    // === SMS MANAGEMENT - SAVE CONFIGURATION ===
    // =======================================================
    $('#save-sms-config-btn').on('click', function () {
        const configData = {
            apiKey: $('#smsApiKey').val(),
            senderId: $('#senderId').val(),
            template: $('#smsTemplate').val()
        };

        $.ajax({
            url: `${API_BASE_URL}/sms-config/save`,
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${JWT_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(configData)
        }).done(function (response) {
            Swal.fire('Success!', response.message || "Configuration saved successfully!", 'success');
        }).fail(function () {
            Swal.fire('Error!', "Could not save SMS configuration.", 'error');
        });
    });

    // AdminDashboard.js (අනෙකුත් functions සමඟ, document.ready එකෙන් පිටත)

    /**
     * Loads the recent SMS log from the backend and populates the table.
     */
    function loadSmsLogs() {
        const $tbody = $('#sms-log-tbody');
        $tbody.html('<tr><td colspan="4" style="text-align: center;">Loading SMS log...</td></tr>');

        $.ajax({
            url: `${API_BASE_URL}/sms-config/logs`, // අපි සෑදූ නව GET endpoint එක
            type: 'GET',
            headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
        })
            .done(function (logs) {
                $tbody.empty();
                if (logs && logs.length > 0) {
                    $.each(logs, function (index, log) {
                        // Timestamp එක කියවීමට පහසු format එකකට පරිවර්තනය කිරීම
                        const date = new Date(log.createdAt);
                        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                        // Status එකට අදාළව CSS class එකක් සැකසීම
                        const statusText = log.status || 'UNKNOWN';
                        const statusClass = statusText.toLowerCase();

                        // Message එකේ දිග සීමා කිරීම (UI එකේ පෙනුම සඳහා)
                        const shortMessage = log.message.length > 50 ? log.message.substring(0, 50) + '...' : log.message;

                        const row = `
                    <tr>
                        <td>${log.patientContact || 'N/A'}</td> <!-- DTO එකට patientContact එකතු කළ යුතුය -->
                        <td title="${log.message}">${shortMessage}</td> <!-- සම්පූර්ණ message එක hover කළ විට පෙන්වීමට -->
                        <td><span class="status-badge status-${statusClass}">${statusText}</span></td>
                        <td>${formattedDate}, ${formattedTime}</td>
                    </tr>`;
                        $tbody.append(row);
                    });
                } else {
                    $tbody.html('<tr><td colspan="4" style="text-align: center;">No SMS logs found.</td></tr>');
                }
            })
            .fail(function () {
                $tbody.html('<tr><td colspan="4" style="text-align: center; color: red;">Could not load SMS log.</td></tr>');
            });
    }

    loadSmsLogs();




    // =================================================================
    // INITIAL PAGE LOAD ACTIONS
    // =================================================================
    loadAdminHeaderDetails();
    showSection('overview');
});