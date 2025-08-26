
        // Global variables
        let currentSection = 'overview';
        let hospitals = [
            { id: 1, name: 'Colombo General Hospital', location: 'Colombo', clinics: 8, status: 'active' },
            { id: 2, name: 'Kandy General Hospital', location: 'Kandy', clinics: 6, status: 'active' },
            { id: 3, name: 'Kurunegala Base Hospital', location: 'Kurunegala', clinics: 5, status: 'active' }
        ];

        let staff = [
            { id: 1, name: 'Dr. Samantha Silva', staffId: 'ST001', hospital: 'Colombo General', department: 'Cardiology', status: 'active' },
            { id: 2, name: 'Dr. Kamal Perera', staffId: 'ST002', hospital: 'Kandy General', department: 'Diabetes', status: 'active' }
        ];

        // Navigation functions
        function showSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.dashboard-section').forEach(section => {
                section.classList.remove('active');
            });

            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });

            // Show selected section
            document.getElementById(sectionName).classList.add('active');

            // Add active class to clicked nav item
            event.target.closest('.nav-item').classList.add('active');

            // Update page title and breadcrumb
            updatePageInfo(sectionName);

            currentSection = sectionName;
        }

        function updatePageInfo(sectionName) {
            const titles = {
                'overview': 'Dashboard Overview',
                'hospitals': 'Hospitals & Clinics',
                'staff': 'Staff Management',
                'reports': 'Reports & Analytics',
                'sms': 'SMS Management',
                'system': 'System Health'
            };

            const breadcrumbs = {
                'overview': 'Admin / Dashboard',
                'hospitals': 'Admin / Hospitals',
                'staff': 'Admin / Staff',
                'reports': 'Admin / Reports',
                'sms': 'Admin / SMS',
                'system': 'Admin / System'
            };

            document.getElementById('pageTitle').textContent = titles[sectionName];
            document.getElementById('breadcrumb').textContent = breadcrumbs[sectionName];
        }

        // Modal functions
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            // Clear form fields
            const inputs = document.querySelectorAll(`#${modalId} input, #${modalId} select`);
            inputs.forEach(input => input.value = '');
        }

        // Hospital management
        function saveHospital() {
            const name = document.getElementById('hospitalName').value;
            const location = document.getElementById('hospitalLocation').value;
            const clinics = document.getElementById('hospitalClinics').value;

            if (!name || !location || !clinics) {
                showNotification('Please fill all fields', 'error');
                return;
            }

            const newHospital = {
                id: hospitals.length + 1,
                name: name,
                location: location,
                clinics: parseInt(clinics),
                status: 'active'
            };

            hospitals.push(newHospital);
            updateHospitalsTable();
            closeModal('hospitalModal');
            showNotification('Hospital added successfully!');
        }

        function editHospital(id) {
            const hospital = hospitals.find(h => h.id === id);
            if (hospital) {
                document.getElementById('hospitalName').value = hospital.name;
                document.getElementById('hospitalLocation').value = hospital.location;
                document.getElementById('hospitalClinics').value = hospital.clinics;
                openModal('hospitalModal');
            }
        }

        function deleteHospital(id) {
            if (confirm('Are you sure you want to delete this hospital?')) {
                hospitals = hospitals.filter(h => h.id !== id);
                updateHospitalsTable();
                showNotification('Hospital deleted successfully!');
            }
        }

        function updateHospitalsTable() {
            const tbody = document.getElementById('hospitalsTable');
            tbody.innerHTML = '';

            hospitals.forEach(hospital => {
                const row = `
                    <tr>
                        <td>${hospital.name}</td>
                        <td>${hospital.location}</td>
                        <td>${hospital.clinics}</td>
                        <td><span class="status-badge status-${hospital.status}">${hospital.status}</span></td>
                        <td>
                            <button class="btn btn-warning" onclick="editHospital(${hospital.id})">Edit</button>
                            <button class="btn btn-danger" onclick="deleteHospital(${hospital.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        // Staff management
        function saveStaff() {
            const name = document.getElementById('staffName').value;
            const staffId = document.getElementById('staffId').value;
            const hospital = document.getElementById('staffHospital').value;
            const department = document.getElementById('staffDepartment').value;

            if (!name || !staffId || !hospital || !department) {
                showNotification('Please fill all fields', 'error');
                return;
            }

            const newStaff = {
                id: staff.length + 1,
                name: name,
                staffId: staffId,
                hospital: hospital,
                department: department,
                status: 'active'
            };

            staff.push(newStaff);
            updateStaffTable();
            closeModal('staffModal');
            showNotification('Staff added successfully!');
        }

        function editStaff(id) {
            const staffMember = staff.find(s => s.id === id);
            if (staffMember) {
                document.getElementById('staffName').value = staffMember.name;
                document.getElementById('staffId').value = staffMember.staffId;
                document.getElementById('staffHospital').value = staffMember.hospital;
                document.getElementById('staffDepartment').value = staffMember.department;
                openModal('staffModal');
            }
        }

        function deleteStaff(id) {
            if (confirm('Are you sure you want to delete this staff member?')) {
                staff = staff.filter(s => s.id !== id);
                updateStaffTable();
                showNotification('Staff deleted successfully!');
            }
        }

        function updateStaffTable() {
            const tbody = document.getElementById('staffTable');
            tbody.innerHTML = '';

            staff.forEach(staffMember => {
                const row = `
                    <tr>
                        <td>${staffMember.name}</td>
                        <td>${staffMember.staffId}</td>
                        <td>${staffMember.hospital}</td>
                        <td>${staffMember.department}</td>
                        <td><span class="status-badge status-${staffMember.status}">${staffMember.status}</span></td>
                        <td>
                            <button class="btn btn-warning" onclick="editStaff(${staffMember.id})">Edit</button>
                            <button class="btn btn-danger" onclick="deleteStaff(${staffMember.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        // Report generation
        function generateReport(type) {
            const reportType = document.getElementById('reportType').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            if (!startDate || !endDate) {
                showNotification('Please select date range', 'error');
                return;
            }

            showNotification(`Generating ${reportType} report in ${type.toUpperCase()} format...`);
            
            // Simulate report generation
            setTimeout(() => {
                showNotification(`${reportType} report generated successfully!`);
            }, 2000);
        }

        // SMS management
        function testSMS() {
            const apiKey = document.getElementById('smsApiKey').value;
            if (!apiKey) {
                showNotification('Please enter API key first', 'error');
                return;
            }

            showNotification('Testing SMS configuration...');
            setTimeout(() => {
                showNotification('SMS test successful! Configuration is working.', 'success');
            }, 1500);
        }

        function saveSMSConfig() {
            const provider = document.getElementById('smsProvider').value;
            const apiKey = document.getElementById('smsApiKey').value;
            const senderId = document.getElementById('smsSenderId').value;

            if (!apiKey || !senderId) {
                showNotification('Please fill all required fields', 'error');
                return;
            }

            showNotification('SMS configuration saved successfully!');
        }

        // System health
        function refreshSystemLog() {
            const log = document.getElementById('systemLog');
            const timestamp = new Date().toLocaleTimeString();
            
            const newEntry = document.createElement('div');
            newEntry.className = 'log-entry log-info';
            newEntry.textContent = `[INFO] System log refreshed at ${timestamp}`;
            
            log.appendChild(newEntry);
            log.scrollTop = log.scrollHeight;
            
            showNotification('System log refreshed');
        }

        // Notification system
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Logout function
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                showNotification('Logging out...');
                setTimeout(() => {
                    window.location.href = '/StyleSheet/Login.html';
                }, 1000);
            }
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        }

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            // Set current date for date inputs
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('startDate').value = today;
            document.getElementById('endDate').value = today;

            // Initialize tables
            updateHospitalsTable();
            updateStaffTable();

            showNotification('Admin Dashboard loaded successfully!');
        });

        // Auto-refresh system stats every 30 seconds
        setInterval(() => {
            // Update system statistics
            const systemHealth = document.querySelector('.stat-card:last-child .stat-value');
            if (systemHealth) {
                const health = (98 + Math.random() * 2).toFixed(1);
                systemHealth.textContent = health + '%';
            }
        }, 30000);
 