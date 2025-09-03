// =======================================================
// MEDIQUEUE ADMIN DASHBOARD - MAIN JAVASCRIPT FILE
// =======================================================

document.addEventListener('DOMContentLoaded', function () {

    // --- GLOBAL ELEMENTS ---
    const pageTitle = document.getElementById('pageTitle');
    const breadcrumb = document.getElementById('breadcrumb');

    // ===================================
    // 1. SECTION SWITCHING LOGIC
    // ===================================
    window.showSection = function(sectionId) {
        // Hide all sections, deactivate all nav items
        document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        
        // Show target section and activate target nav item
        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.add('active');
        
        const targetNav = document.querySelector(`.nav-item[onclick="showSection('${sectionId}')"]`);
        if (targetNav) targetNav.classList.add('active');
        
        // Update header
        updateHeader(sectionId);
    }

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

    // ===================================
    // 2. PROFILE MODAL LOGIC
    // ===================================
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        const openTrigger = document.getElementById('adminProfileTrigger');
        const closeBtn = profileModal.querySelector('.modal-close-btn');

        openTrigger.addEventListener('click', () => profileModal.classList.add('show'));
        closeBtn.addEventListener('click', () => profileModal.classList.remove('show'));
        
        profileModal.addEventListener('click', (event) => {
            if (event.target === profileModal) profileModal.classList.remove('show');
        });

        const profileForm = document.getElementById('profileForm');
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Profile Updated!');
            profileModal.classList.remove('show');
        });
    }

    // ===================================
    // 3. HOSPITAL MODAL LOGIC
    // ===================================
    const hospitalModal = document.getElementById('hospitalModal');
    if (hospitalModal) {
        const closeBtn = hospitalModal.querySelector('.modal-close-btn');
        const modalTitle = document.getElementById('modalTitle');
        const hospitalForm = document.getElementById('hospitalForm');

        window.openHospitalModal = function(mode, hospitalId = null) {
            if (mode === 'add') {
                modalTitle.textContent = 'Add New Hospital';
                hospitalForm.reset();
            } else if (mode === 'edit') {
                modalTitle.textContent = 'Edit Hospital';
                // Placeholder: Here you would fetch data for the hospitalId and fill the form
                document.getElementById('hospitalName').value = 'Fetched Hospital Name';
            }
            hospitalModal.classList.add('show');
        }
        
        closeBtn.addEventListener('click', () => hospitalModal.classList.remove('show'));
        hospitalModal.addEventListener('click', (event) => {
            if (event.target === hospitalModal) hospitalModal.classList.remove('show');
        });

        hospitalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Hospital Data Saved!');
            hospitalModal.classList.remove('show');
        });
    }

    // ===================================
    // 4. GLOBAL FUNCTIONS
    // ===================================
    window.deleteHospital = (id) => { 
        if(confirm(`Are you sure you want to delete hospital ${id}?`)) {
            alert(`Deleted hospital ${id}`); 
        }
    }
    window.logout = () => { 
        if(confirm('Are you sure you want to logout?')) {
            alert('Logged out');
        }
    }
});