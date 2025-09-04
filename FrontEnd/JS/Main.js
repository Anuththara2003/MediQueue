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
                            <td><span class="status-badge status-active">${h.status || 'N/A'}</span></td>
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
        const modalTitle = document.getElementById('modalTitle');
        const hospitalForm = document.getElementById('hospitalForm');
        
        // === යාවත්කාලීන කරන ලද openHospitalModal function එක ===
        window.openHospitalModal = async function(mode, hospitalId = null) {
            hospitalForm.reset();
            hospitalForm.dataset.mode = mode;
            hospitalForm.dataset.id = hospitalId || '';
            
            if (mode === 'edit' && hospitalId) {
                modalTitle.textContent = 'Edit Hospital';
                try {
                    const response = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
                        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch hospital details.');
                    }
                    const hospital = await response.json();

                    document.getElementById('hospitalName').value = hospital.name;
                    document.getElementById('hospitalLocation').value = hospital.location;
                    document.getElementById('hospitalStatus').value = hospital.status.toLowerCase();

                } catch (error) {
                    console.error('Error fetching hospital for edit:', error);
                    alert('Could not load hospital data. Please try again.');
                    return;
                }
            } else {
                modalTitle.textContent = 'Add New Hospital';
            }
            
            hospitalModal.classList.add('show');
        }

        hospitalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mode = hospitalForm.dataset.mode;
            
            const hospitalData = {
        name: document.getElementById('hospitalName').value,
        location: document.getElementById('hospitalLocation').value, 
        status: document.getElementById('hospitalStatus').value
    };

            const url = mode === 'edit' 
                ? `${API_BASE_URL}/hospitals/${hospitalForm.dataset.id}` 
                : `${API_BASE_URL}/hospitals`;
            const method = mode === 'edit' ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    },
                    body: JSON.stringify(hospitalData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to save data to the server.');
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
        closeBtn.addEventListener('click', () => hospitalModal.classList.remove('show'));
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
    
    // ===================================
    // 3. PROFILE MODAL & OTHER FUNCTIONS
    // ===================================
    
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        const openTrigger = document.getElementById('adminProfileTrigger');
        const closeBtn = profileModal.querySelector('.modal-close-btn');
        openTrigger.addEventListener('click', () => profileModal.classList.add('show'));
        closeBtn.addEventListener('click', () => profileModal.classList.remove('show'));
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) profileModal.classList.remove('show');
        });
    }

    window.logout = () => { 
        if(confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('jwtToken');
            window.location.href = '../HTML/login.html';
        }
    }

    // =================================================================
    // LOCATIONIQ SEARCH SCRIPT
    // =================================================================

    const LOCATIONIQ_API_KEY = 'pk.620a0f57de48be49621910e59f1a0ec9';
    let searchTimeout;

    const searchInput = document.getElementById('hospitalSearchInput');
    const searchResultsContainer = document.getElementById('hospitalSearchResults');

    async function fetchHospitalSuggestions(query) {
        const searchQuery = `hospital ${query}`;
        const url = `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=7&countrycodes=LK`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            searchResultsContainer.innerHTML = '';

            if (data && data.length > 0) {
                data.forEach(place => {
                    const item = `
                        <div class="result-item" data-name="${place.display_name}">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${place.display_name}</span>
                        </div>
                    `;
                    searchResultsContainer.insertAdjacentHTML('beforeend', item);
                });
            } else {
                searchResultsContainer.innerHTML = '<div class="result-item"><span>No results found.</span></div>';
            }
        } catch (error) {
            console.error("Error fetching suggestions from LocationIQ:", error);
            searchResultsContainer.innerHTML = '<div class="result-item"><span>Error searching.</span></div>';
        }
    }

    if (searchInput && searchResultsContainer) {
        searchInput.addEventListener('keyup', () => {
            clearTimeout(searchTimeout);
            const query = searchInput.value;
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    fetchHospitalSuggestions(query);
                }, 400);
            } else {
                searchResultsContainer.innerHTML = '';
            }
        });

        searchResultsContainer.addEventListener('click', (e) => {
            const resultItem = e.target.closest('.result-item');
            if (resultItem && resultItem.dataset.name) {
                searchInput.value = resultItem.dataset.name;
                searchResultsContainer.innerHTML = '';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (searchResultsContainer && !e.target.closest('.search-container')) {
            searchResultsContainer.innerHTML = '';
        }
    });

    // Initial load for the default view
    showSection('overview');
});