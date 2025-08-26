
        // Role selection functionality
        function selectRole(role) {
            // Remove selected class from all options
            document.querySelectorAll('.role-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            document.querySelector(`[onclick="selectRole('${role}')"]`).classList.add('selected');
            
            // Update radio button
            document.getElementById(role).checked = true;
            
            // Update login button text based on role
            const loginBtn = document.querySelector('.login-btn');
            const roleTexts = {
                'patient': '🤒 Sign In as Patient',
                'hospital_staff': '👩‍⚕️ Sign In as Staff',
                'admin': '⚙️ Sign In as Admin'
            };
            loginBtn.innerHTML = roleTexts[role] || '🩺 Sign In to Medique';
        }

        // Form submission with role-based authentication
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const selectedRole = document.querySelector('input[name="role"]:checked');
            
            if (!selectedRole) {
                alert('⚠️ Please select your role before signing in.');
                return;
            }
            
            if (email && password) {
                const loginBtn = document.querySelector('.login-btn');
                const originalText = loginBtn.innerHTML;
                loginBtn.innerHTML = '🔄 Authenticating...';
                loginBtn.disabled = true;
                
                setTimeout(() => {
                    const roleNames = {
                        'patient': 'Patient',
                        'hospital_staff': 'Hospital Staff',
                        'admin': 'Administrator'
                    };
                    
                    const dashboardUrls = {
                        'patient': '/patient-dashboard',
                        'hospital_staff': '/staff-dashboard',
                        'admin': '/admin-dashboard'
                    };
                    
                    alert(`🏥 Welcome to Medique!\n\nLogin successful as: ${roleNames[selectedRole.value]}\nEmail: ${email}\n\nYou would now be redirected to your ${roleNames[selectedRole.value]} dashboard at: ${dashboardUrls[selectedRole.value]}`);
                    
                    loginBtn.innerHTML = originalText;
                    loginBtn.disabled = false;
                }, 2000);
            }
        });

        // Toggle password visibility
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleBtn = document.querySelector('.show-password');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = 'Hide';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = 'Show';
            }
        }

        // Google sign in with role awareness
        function signInWithGoogle() {
            const selectedRole = document.querySelector('input[name="role"]:checked');
            
            if (!selectedRole) {
                alert('⚠️ Please select your role before continuing with Google.');
                return;
            }
            
            const googleBtn = document.querySelector('.google-btn');
            const originalContent = googleBtn.innerHTML;
            googleBtn.innerHTML = '<span style="opacity: 0.7;">🔄 Connecting to Google Healthcare...</span>';
            googleBtn.disabled = true;
            
            setTimeout(() => {
                const roleNames = {
                    'patient': 'Patient',
                    'hospital_staff': 'Hospital Staff',
                    'admin': 'Administrator'
                };
                
                alert(`🏥 Google Healthcare Sign-In\n\nSigning in as: ${roleNames[selectedRole.value]}\n\nSecure authentication with Google would be implemented here for HIPAA compliance!`);
                googleBtn.innerHTML = originalContent;
                googleBtn.disabled = false;
            }, 1500);
        }

        // Role-aware forgot password
        function forgotPassword() {
            const selectedRole = document.querySelector('input[name="role"]:checked');
            let roleText = selectedRole ? ` for ${selectedRole.value}` : '';
            alert(`🔐 Secure Password Reset${roleText}\n\nFor security compliance, you would receive a secure reset link via your registered email and SMS.`);
        }

        // Role-aware sign up
        function signUp() {
            alert('🩺 Join Medique\n\nChoose your role during registration:\n• Patient - Access your health records\n• Hospital Staff - Manage patient care\n• Administrator - System management\n\nNew user registration would redirect to our secure HIPAA-compliant registration form.');
        }

        // Enhanced input animations
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Add pulse animation for online indicator
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);

        // Auto-select patient role by default
        window.addEventListener('load', function() {
            selectRole('patient');
        });
