// =======================================================
// MEDIQUEUE ADMIN DASHBOARD - FINAL & COMPLETE JS FILE
// =======================================================

document.addEventListener('DOMContentLoaded', function () {

    // --- CONFIGURATION ---
    const API_BASE_URL = 'http://localhost:8080/api/v1/admin';
    const JWT_TOKEN = localStorage.getItem('jwtToken');

    // --- SECURITY CHECK ---
    if (!JWT_TOKEN) {
        alert('Authentication token not found. Please log in.');
        window.location.href = '../HTML/login.html';
        return;
    }

    // --- GLOBAL ELEMENTS ---
    const pageTitle = document.getElementById('pageTitle');
    const breadcrumb = document.getElementById('breadcrumb');
    
    // ===================================
    // 1. HEADER & NAVIGATION
    // ===================================
    function updateHeader(sectionId) {
        let title = '', crumb = 'Admin / ';
        switch(sectionId) {
            case 'overview': title = 'Dashboard Overview'; crumb += 'Dashboard'; break;
            case 'hospitals': title = 'Hospitals & Clinics'; crumb += 'Hospitals'; break;
            case 'reports': title = 'Reports & Analytics'; crumb += 'Reports'; break;
            case 'sms': title = 'SMS Management'; crumb += 'SMS'; break;
            case 'system': title = 'System Health'; crumb += 'System'; break;
        }
        pageTitle.textContent = title;
        breadcrumb.textContent = crumb;
    }

    window.showSection = function(sectionId) {
        document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.add('active');
        
        const targetNav = document.querySelector(`.nav-item[onclick="showSection('${sectionId}')"]`);
        if (targetNav) targetNav.classList.add('active');
        
        if (sectionId === 'hospitals') {
            loadHospitals();
        }
        
        updateHeader(sectionId);
    }

    // ===================================
    // 2. HOSPITAL MANAGEMENT (CRUD)
    // ===================================
    const hospitalModal = document.getElementById('hospitalModal');
    const hospitalTableBody = document.querySelector('#hospitals .data-table tbody');

    async function loadHospitals() {
        if (!hospitalTableBody) return;
        try {
            const response = await fetch(`${API_BASE_URL}/hospitals`, {
                headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const hospitals = await response.json();
            hospitalTableBody.innerHTML = '';

            if (hospitals.length === 0) {
                 hospitalTableBody.innerHTML = `<tr><td colspan="5">No hospitals found. Add a new one to get started.</td></tr>`;
            } else {
                hospitals.forEach(h => {
                    const row = `
                        <tr>
                            <td>${h.name || 'N/A'}</td>
                            <td>${h.location || 'N/A'}</td>
                            <td>${h.clinicCount || 0}</td>
                            <td><span class="status-badge status-${h.status.toLowerCase() || 'inactive'}">${h.status || 'N/A'}</span></td>
                            <td class="action-buttons">
                                <button class="btn-icon btn-warning" onclick="openHospitalModal('edit', ${h.id})"><i class="fas fa-pen"></i></button>
                                <button class="btn-icon btn-danger" onclick="deleteHospital(${h.id})"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                    hospitalTableBody.insertAdjacentHTML('beforeend', row);
                });
            }
        } catch (error) {
            console.error('Error loading hospitals:', error);
            hospitalTableBody.innerHTML = `<tr><td colspan="5" style="color: red;">Error loading data. Check console for details.</td></tr>`;
        }
    }

    if (hospitalModal) {
        const hospitalForm = document.getElementById('hospitalForm');
        
        hospitalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mode = hospitalForm.dataset.mode;
            
            const hospitalData = {
                name: document.getElementById('hospitalName').value,
                location: document.getElementById('hospitalLocation').value,
                status: document.getElementById('hospitalStatus').value,
                clinicCount: document.getElementById('hospitalClinics').value
            };

            const url = mode === 'edit' 
                ? `${API_BASE_URL}/hospitals/${hospitalForm.dataset.id}` 
                : `${API_BASE_URL}/hospitals`;
            const method = mode === 'edit' ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT_TOKEN}` },
                    body: JSON.stringify(hospitalData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to save data.');
                }

                alert('Hospital saved successfully!');
                hospitalModal.classList.remove('show');
                loadHospitals();
                
            } catch (error) {
                console.error('Error saving hospital:', error);
                alert(`Error saving hospital: ${error.message}`);
            }
        });
        
        const closeBtn = hospitalModal.querySelector('.modal-close-btn');
        if(closeBtn) closeBtn.addEventListener('click', () => hospitalModal.classList.remove('show'));
        hospitalModal.addEventListener('click', (e) => {
            if (e.target === hospitalModal) hospitalModal.classList.remove('show');
        });
    }

    window.deleteHospital = async (id) => { 
        if(confirm(`Are you sure you want to delete hospital ${id}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/hospitals/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                });
                if (!response.ok) throw new Error('Failed to delete hospital');
                alert(`Deleted hospital ${id}`); 
                loadHospitals();
            } catch(error) {
                console.error('Error deleting hospital:', error);
                alert('Error deleting hospital.');
            }
        }
    }
    
    // ==========================================================
    // 3. PROFILE MODAL & OTHER FUNCTIONS (CORRECTED)
    // ==========================================================
    
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        const openTrigger = document.getElementById('adminProfileTrigger');
        const closeBtn = profileModal.querySelector('.modal-close-btn');
        const profileForm = document.getElementById('profileForm');
        const avatarUploadInput = document.getElementById('avatarUpload');
        const profileModalAvatar = document.getElementById('profileModalAvatar');

        if(openTrigger) {
            openTrigger.addEventListener('click', () => profileModal.classList.add('show'));
        }
        if(closeBtn) {
            closeBtn.addEventListener('click', () => profileModal.classList.remove('show'));
        }
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) profileModal.classList.remove('show');
        });

        if(avatarUploadInput) {
            avatarUploadInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profileModalAvatar.src = e.target.result;
                    }
                    reader.readAsDataURL(file);
                }
            });
        }
        // Main.js file inside the DOMContentLoaded listener

              // Main.js file inside the DOMContentLoaded listener

                // Main.js file inside the DOMContentLoaded listener

        if(profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // 1. JWT Token එක localStorage එකෙන් ලබා ගැනීම
                const JWT_TOKEN = localStorage.getItem('jwtToken');
                if (!JWT_TOKEN) {
                    alert('Authentication token not found. Please log in again.');
                    return;
                }

                const formData = new FormData();

                // 2. DTO එකේ fields ටික FormData එකට එකතු කිරීම
                formData.append('firstName', document.getElementById('profileFirstName').value);
                formData.append('lastName', document.getElementById('profileLastName').value);
                formData.append('email', document.getElementById('profileEmail').value);
                formData.append('newPassword', document.getElementById('profilePassword').value);

                // 3. Image file එක FormData එකට එකතු කිරීම (තිබුනොත්)
                const avatarUploadInput = document.getElementById('avatarUpload');
                const imageFile = avatarUploadInput.files[0];
                if (imageFile) {
                    formData.append('profileImage', imageFile);
                }

                try {
                    // 4. fetch call එක, නිවැරදි Headers සමග යැවීම
                    const response = await fetch(`${API_BASE_URL}/profile`, {
                        method: 'PUT',
                        headers: {
                            // Content-Type එක මෙතන දාන්න එපා. FormData යවනකොට browser එක ඒක දාගන්නවා.
                            // === මෙන්න වැදගත්ම පේළිය ===
                            'Authorization': `Bearer ${JWT_TOKEN}` 
                        },
                        body: formData
                    });

                    // 5. Backend එකෙන් error එකක් ආවොත්, ඒක handle කිරීම
                    if (!response.ok) {
                        const errorText = await response.text();
                        // Status: 403, Message: ... විදිහට console එකේ error එක පෙන්වයි
                        throw new Error(`Failed to update profile. Status: ${response.status}, Message: ${errorText}`);
                    }
                    
                    const result = await response.text();
                    alert(result); // "Profile updated successfully!"
                    
                    // Modal එක close කරලා, UI එක update කිරීම
                    const profileModal = document.getElementById('profileModal');
                    if(profileModal) profileModal.classList.remove('show');
                    
                    const firstName = document.getElementById('profileFirstName').value;
                    const lastName = document.getElementById('profileLastName').value;
                    document.getElementById('headerAdminName').textContent = `${firstName} ${lastName}`;
                    if(imageFile) {
                         const profileModalAvatar = document.getElementById('profileModalAvatar');
                         document.getElementById('headerAdminAvatar').src = profileModalAvatar.src;
                    }

                } catch (error) {
                    // මෙතන තමයි ඔයා කලින් දැක්ක error එක console එකේ print වෙන්නේ
                    console.error('Error updating profile:', error);
                    alert('Error: Could not update profile. Check console for details.');
                }
            });
        }
    
    // =================================================================
    // LOCATIONIQ SEARCH & UPDATED HOSPITAL MODAL LOGIC
    // =================================================================

    const LOCATIONIQ_API_KEY = 'pk.620a0f57de48be49621910e59f1a0ec9';
    let searchTimeout;

    const pageSearchInput = document.getElementById('hospitalSearchInput');
    const modalSearchInput = document.getElementById('modalHospitalSearchInput');
    const modalSearchResultsContainer = document.getElementById('modalHospitalSearchResults');
    const hospitalSearchStep = document.getElementById('hospitalSearchStep');
    const hospitalDetailsStep = document.getElementById('hospitalDetailsStep');
    const hospitalNameInput = document.getElementById('hospitalName');
    const hospitalLocationInput = document.getElementById('hospitalLocation');
    const saveHospitalBtn = document.querySelector('#hospitalModal .btn-primary');

    async function fetchHospitalSuggestions(query) {
        const searchQuery = `hospital ${query}`;
        const url = `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=7&countrycodes=LK`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            modalSearchResultsContainer.innerHTML = '';
            if (data && data.length > 0) {
                data.forEach(place => {
                    const displayNameParts = place.display_name.split(',');
                    const hospitalName = displayNameParts[0].trim();
                    const location = displayNameParts.slice(1).join(',').trim();
                    const item = `<div class="result-item" data-name="${hospitalName}" data-location="${location}"><i class="fas fa-map-marker-alt"></i><span><strong>${hospitalName}</strong><br><small>${location}</small></span></div>`;
                    modalSearchResultsContainer.insertAdjacentHTML('beforeend', item);
                });
            } else {
                modalSearchResultsContainer.innerHTML = '<div class="result-item"><span>No results found.</span></div>';
            }
        } catch (error) {
            console.error("Error fetching suggestions from LocationIQ:", error);
            modalSearchResultsContainer.innerHTML = '<div class="result-item"><span>Error searching.</span></div>';
        }
    }

    if (modalSearchInput) {
        modalSearchInput.addEventListener('keyup', () => {
            clearTimeout(searchTimeout);
            const query = modalSearchInput.value;
            if (query.length > 2) {
                searchTimeout = setTimeout(() => fetchHospitalSuggestions(query), 400);
            } else {
                modalSearchResultsContainer.innerHTML = '';
            }
        });
    }

    if (modalSearchResultsContainer) {
        modalSearchResultsContainer.addEventListener('click', (e) => {
            const resultItem = e.target.closest('.result-item');
            if (resultItem && resultItem.dataset.name) {
                hospitalNameInput.value = resultItem.dataset.name;
                hospitalLocationInput.value = resultItem.dataset.location;
                hospitalNameInput.readOnly = true;
                hospitalLocationInput.readOnly = true;
                hospitalSearchStep.style.display = 'none';
                hospitalDetailsStep.style.display = 'block';
                modalSearchResultsContainer.innerHTML = '';
                if(saveHospitalBtn) saveHospitalBtn.disabled = false;
            }
        });
    }

    window.openHospitalModal = async function(mode, hospitalId = null) {
        const modalTitle = document.getElementById('modalTitle');
        const hospitalForm = document.getElementById('hospitalForm');
        hospitalForm.reset();
        hospitalForm.dataset.mode = mode;
        hospitalForm.dataset.id = hospitalId || '';
        if (mode === 'edit' && hospitalId) {
            modalTitle.textContent = 'Edit Hospital';
            hospitalSearchStep.style.display = 'none';
            hospitalDetailsStep.style.display = 'block';
            hospitalNameInput.readOnly = false;
            hospitalLocationInput.readOnly = false;
            try {
                const response = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, { headers: { 'Authorization': `Bearer ${JWT_TOKEN}` } });
                if (!response.ok) throw new Error('Failed to fetch hospital details.');
                const hospital = await response.json();
                hospitalNameInput.value = hospital.name;
                hospitalLocationInput.value = hospital.location;
                document.getElementById('hospitalStatus').value = hospital.status.toLowerCase();
                document.getElementById('hospitalClinics').value = hospital.clinicCount;
                if(saveHospitalBtn) saveHospitalBtn.disabled = false;
            } catch (error) {
                console.error('Error fetching hospital for edit:', error);
                alert('Could not load hospital data.');
                return;
            }
        } else { // 'add' mode
            modalTitle.textContent = 'Add New Hospital';
            hospitalDetailsStep.style.display = 'none';
            hospitalSearchStep.style.display = 'block';
            if (modalSearchInput) modalSearchInput.value = '';
            if(saveHospitalBtn) saveHospitalBtn.disabled = true;
        }
        hospitalModal.classList.add('show');
    }

    if (pageSearchInput && hospitalTableBody) {
        pageSearchInput.addEventListener('keyup', () => {
            const filter = pageSearchInput.value.toUpperCase();
            const tableRows = hospitalTableBody.getElementsByTagName("tr");
            for (let i = 0; i < tableRows.length; i++) {
                let hospitalNameCell = tableRows[i].getElementsByTagName("td")[0];
                if (hospitalNameCell) {
                    let txtValue = hospitalNameCell.textContent || hospitalNameCell.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tableRows[i].style.display = "";
                    } else {
                        tableRows[i].style.display = "none";
                    }
                }
            }
        });
    }
    
    // Initial load for the default view
    showSection('overview');
}
});