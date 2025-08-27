document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary elements from the DOM
    const modal = document.getElementById('registrationModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeBtn = document.querySelector('.close-btn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const tokenForm = document.getElementById('tokenForm');

    let currentStep = 1;

    // --- Event Listeners ---
    openModalBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });
    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);
    tokenForm.addEventListener('submit', handleSubmit);


    // --- Functions ---
    function openModal() {
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
        resetForm();
    }
    
    function handleNext() {
        // Simple check for step 1
        if (currentStep === 1) {
            const mobileInput = document.getElementById('mobileNumber');
            if (mobileInput.value.trim() === '') {
                alert('Please enter the mobile number..');
                return;
            }
            // Simulate checking if patient exists
            // If mobile is a specific number, we assume patient exists
            if (mobileInput.value === '0771234567') {
                 // Pre-fill data for existing patient and skip to step 3
                document.getElementById('patientName').value = "Saman Kumara";
                document.getElementById('dob').value = "1990-05-15";
                document.getElementById('gender').value = "Male";
                currentStep = 3; // Skip to step 3
            } else {
                currentStep++; // Go to step 2 for new patient
            }
        } else {
            if (currentStep < formSteps.length) {
                currentStep++;
            }
        }
        
        updateFormSteps();
        updateProgressBar();
        updateButtons();
    }

    function handlePrev() {
         // If we are at step 3 and came from step 1 (skipped step 2)
         const mobileInput = document.getElementById('mobileNumber');
         if(currentStep === 3 && mobileInput.value === '0771234567'){
             currentStep = 1; // Go back to step 1
         } else {
            if (currentStep > 1) {
                currentStep--;
            }
         }
        
        updateFormSteps();
        updateProgressBar();
        updateButtons();
    }

    function updateFormSteps() {
        formSteps.forEach((step, index) => {
            step.classList.remove('active');
            if ((index + 1) === currentStep) {
                step.classList.add('active');
            }
        });
        
        // Populate confirmation details when we reach step 4
        if (currentStep === 4) {
            populateConfirmation();
        }
    }

    function updateProgressBar() {
        progressSteps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function updateButtons() {
        if (currentStep === 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
            nextBtn.textContent = 'Check'; // Change button text for step 1
        } else if (currentStep === formSteps.length) {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
            nextBtn.textContent = ' Next';
        }
    }
    
    function populateConfirmation() {
        document.getElementById('confirmName').textContent = document.getElementById('patientName').value;
        document.getElementById('confirmMobile').textContent = document.getElementById('mobileNumber').value;
        document.getElementById('confirmDoctor').textContent = document.getElementById('doctor').options[document.getElementById('doctor').selectedIndex].text;
        document.getElementById('confirmDate').textContent = document.getElementById('appointmentDate').value;
    }

    function handleSubmit(event) {
        event.preventDefault(); // Prevent actual form submission
        alert('The token has been successfully registered.!');
        console.log('Form Submitted Data:', {
            mobile: document.getElementById('mobileNumber').value,
            name: document.getElementById('patientName').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            doctor: document.getElementById('doctor').value,
            date: document.getElementById('appointmentDate').value,
            reason: document.getElementById('reason').value
        });
        closeModal();
    }

    function resetForm() {
        tokenForm.reset();
        currentStep = 1;
        updateFormSteps();
        updateProgressBar();
        updateButtons();
    }

    // Initialize button text
    updateButtons();
});