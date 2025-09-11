
$(function() {
    
    const $modal = $('#registrationModal');
    const $openModalBtn = $('#openModalBtn');
    const $closeBtn = $('.close-btn');
    const $nextBtn = $('#nextBtn');
    const $prevBtn = $('#prevBtn');
    const $submitBtn = $('#submitBtn');
    const $formSteps = $('.form-step');
    const $progressSteps = $('.progress-step');
    const $tokenForm = $('#tokenForm');

    let currentStep = 1;

    // --- Event Listeners (jQuery .on() method එක භාවිතයෙන්) ---
    $openModalBtn.on('click', openModal);
    $closeBtn.on('click', closeModal);
    $(window).on('click', (event) => {
        // modal එකෙන් පිටත click කළ විට එය close කිරීම
        if ($(event.target).is($modal)) {
            closeModal();
        }
    });

    $nextBtn.on('click', handleNext);
    $prevBtn.on('click', handlePrev);
    $tokenForm.on('submit', handleSubmit);


    // --- Functions (ඔබගේ මුල් functions එලෙසම තබා ඇත) ---
    function openModal() {
        $modal.show(); // jQuery .show() method
    }

    function closeModal() {
        $modal.hide(); // jQuery .hide() method
        resetForm();
    }
    
  // =======================================================
// === යාවත්කාලීන කළ handleNext Function එක ===
// =======================================================

function handleNext() {
    // Step 1: Patient Identification
    if (currentStep === 1) {
        const $mobileInput = $('#mobileNumber');
        const mobileNumber = $mobileInput.val().trim();
        const $nextButton = $('#nextBtn'); // "Next" button එක select කරගන්නවා
        const JWT_TOKEN = localStorage.getItem('jwtToken'); // Patient ගේ token එක

        if (mobileNumber.length < 10) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }

        // 1. Loading state එක පෙන්වීම
        $nextButton.text('Checking...').prop('disabled', true);

        // 2. Backend එකට AJAX call එක යැවීම
       // ... handleNext function ඇතුලේ
                    $.ajax({
                    // <<--- ගැටලුව ඇත්තේ මෙම පේළියේ ---
                    url: `http://localhost:8080/api/v1/patient/details/contact/${mobileNumber}`, 
                    type: 'GET',
                    headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
                    })
// ...
      // handleNext function එකේ
                .done(function(patientData) {
                    // SUCCESS: Patient හමු වුණා!
                    console.log("Patient Found:", patientData);
                    
                    // === මෙන්න මෙම පේළිය අලුතින් එකතු කරන්න ===
                    // Patient ID එක, පසුව handleSubmit එකේදී ලබාගැනීම සඳහා, form එකේම data attribute එකක් ලෙස ගබඩා කරගන්නවා.
                    $('#tokenForm').data('patient-id', patientData.id);
                    // ============================================

                    // Step 2 හි fields, ලැබුණු දත්ත වලින් auto-fill කරනවා
                    $('#patientName').val(`${patientData.firstName} ${patientData.lastName}`).prop('readonly', true);
                    $('#dob').val(patientData.dateOfBirth).prop('readonly', true);
                    $('#gender').val(patientData.gender).prop('readonly', true);
                    
                    currentStep++;
                })
        .fail(function(jqXHR) {
            // 3b. FAILURE: Patient හමු වුණේ නැහැ හෝ වෙනත් දෝෂයක්
            if (jqXHR.status === 404) {
                // 404 Not Found - අලුත් patient කෙනෙක්
                alert("This mobile number is not registered. Please enter your details.");
                
                // Step 2 හි fields, අලුතින් ඇතුලත් කිරීමට හිස්ව තබනවා
                $('#patientName').val('').prop('readonly', false);
                $('#dob').val('').prop('readonly', false);
                $('#gender').val('').prop('readonly', false);
                
                currentStep++; // ඊළඟ step එකට (Step 2) යනවා
            } else {
                // වෙනත් දෝෂ (403, 500 etc.)
                alert("An error occurred while checking the number. Please try again.");
            }
        })
        .always(function() {
            // 4. AJAX call එක success උනත් fail උනත්, අවසානයේදී මෙම කොටස ක්‍රියාත්මක වෙනවා
            $nextButton.text('Next').prop('disabled', false); // Button එක නැවත සක්‍රීය කරනවා
            
            // UI එක update කරන functions call කිරීම
            updateFormSteps();
            updateProgressBar();
            updateButtons();
        });
        
        // AJAX call එක asynchronous නිසා, UI update functions .always() එකට දමන ලදී.

    } else {
        // අනෙකුත් steps සඳහා (Step 2, 3)
        if (currentStep < $formSteps.length) {
            currentStep++;
        }
        updateFormSteps();
        updateProgressBar();
        updateButtons();
    }
}








    // RegisterToken.js

/**
 * Loads the list of available doctors into the Step 3 dropdown.
 */
function loadDoctorsIntoDropdown() {
    const $doctorSelect = $('#doctor'); // HTML එකේ ඇති select id එක
    const JWT_TOKEN = localStorage.getItem('jwtToken');

    $doctorSelect.prop('disabled', true).html('<option value="">Loading doctors...</option>');

    $.ajax({
        url: 'http://localhost:8080/api/v1/patient/details/doctors', // අපි සෑදූ නව Patient endpoint එක
        type: 'GET',
        headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    })
    .done(function(doctors) {
        $doctorSelect.empty().append('<option value="">Select a Doctor...</option>');
        if (doctors && doctors.length > 0) {
            $.each(doctors, function(index, doctor) {
                // value එකට doctor ගේ ID එකත්, text එකට නම සහ specialization එකත් යොදනවා
                $doctorSelect.append(`<option value="${doctor.id}">${doctor.fullName} - ${doctor.specialization || 'General'}</option>`);
            });
            $doctorSelect.prop('disabled', false);
        } else {
            $doctorSelect.html('<option value="">No doctors available at the moment.</option>');
        }
    })
    .fail(function() {
        console.error("Failed to load doctors for dropdown.");
        $doctorSelect.html('<option value="">Could not load doctors.</option>');
    });
}



    function handlePrev() {
         // Step 3 සිට step 1 ට ආපසු යෑමේ logic එක
         const mobileInput = $('#mobileNumber');
         if (currentStep === 3 && mobileInput.val() === '0771234567') {
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

   // RegisterToken.js

function updateFormSteps() {
    $formSteps.removeClass('active');
    $formSteps.eq(currentStep - 1).addClass('active');
    
    // === මෙම කොටස අලුතින් එකතු කරන්න ===
    // Step 3 එක active වන විට, doctor ලැයිස්තුව load කිරීම
    if (currentStep === 3) {
        loadDoctorsIntoDropdown();
    }
    // =====================================
    
    if (currentStep === 4) {
        populateConfirmation();
    }
}

    function updateProgressBar() {
        $progressSteps.each(function(index) {
            if (index < currentStep) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }

    function updateButtons() {
        if (currentStep === 1) {
            $prevBtn.hide();
            $nextBtn.show();
            $submitBtn.hide();
            $nextBtn.text('Check'); // jQuery .text() to change text
        } else if (currentStep === $formSteps.length) {
            $prevBtn.show();
            $nextBtn.hide();
            $submitBtn.show();
        } else {
            $prevBtn.show();
            $nextBtn.show();
            $submitBtn.hide();
            $nextBtn.text('Next'); // 'Next' button text fix
        }
    }
    
    function populateConfirmation() {
        $('#confirmName').text($('#patientName').val());
        $('#confirmMobile').text($('#mobileNumber').val());
        // Dropdown එකකින් තෝරාගත් option එකේ text එක ලබාගැනීමේ පහසු jQuery ක්‍රමය
        $('#confirmDoctor').text($('#doctor option:selected').text());
        $('#confirmDate').text($('#appointmentDate').val());
    }




// RegisterToken.js -> // --- Functions --- කොටස යටතට

/**
 * Handles the final submission of the token registration form.
 * Sends the collected data to the backend to create a new token.
 */
function handleSubmit(event) {
    event.preventDefault(); // Default form submission එක නවත්වනවා

    // 1. Form එකේ විවිධ තැන් වලින් දත්ත ලබාගැනීම
    const patientId = $('#tokenForm').data('patient-id'); // Step 1න් පසුව save කරගත් patient ID එක
    const doctorId = $('#doctor').val();
    const appointmentDate = $('#appointmentDate').val();
    const reason = $('#reason').val();

    // --- Frontend Validation ---
    if (!patientId) {
        alert("Critical Error: Patient could not be identified. Please start over from Step 1.");
        resetForm();
        return;
    }
    if (!doctorId || !appointmentDate) {
        alert("Please ensure you have selected a doctor and an appointment date in Step 3.");
        return;
    }

    // 2. Backend DTO එකට ගැලපෙන object එකක් සෑදීම
    // (ඔබගේ නව Token entity එකට ගැලපෙන ලෙස DTO එක යාවත්කාලීන කර ඇත)
    const tokenData = {
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        clinicId: 1, // **වැදගත්:** දැනට Clinic ID එක 1 ලෙස hardcode කර ඇත. UI එකට clinic dropdown එකක් එකතු කළ යුතුය.
        appointmentDate: appointmentDate
        // 'reason' එක DTO එකේ නැති නිසා, එය යවන්නේ නැත.
    };

    // 3. Backend එකට AJAX POST request එක යැවීම
    $.ajax({
        url: 'http://localhost:8080/api/v1/patient/tokens', // අපි කලින් සෑදූ නිවැරදි endpoint එක
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(tokenData) // සකස් කරගත් tokenData object එක යැවීම
    })
    .done(function(response) {
        // සාර්ථකව Token එක save වූ පසු
        alert(`Token registered successfully! Your token number is: ${response.tokenNumber}`);
        closeModal();
    })
    .fail(function(jqXHR) {
        // යම් දෝෂයක් ඇතිවුවහොත්
        const errorMsg = jqXHR.responseJSON ? jqXHR.responseJSON.message : (jqXHR.responseText || "An unknown error occurred.");
        alert(`Failed to register token: ${errorMsg}`);
        console.error("Token Registration Failed:", jqXHR);
    });
}






    function resetForm() {
        // jQuery object එකෙන් DOM element එක ලබාගෙන reset() කිරීම
        $tokenForm[0].reset(); 
        currentStep = 1;
        updateFormSteps();
        updateProgressBar();
        updateButtons();
    }




    // පිටුව load වූ විට button වල නිවැරදි තත්ත්වය පෙන්වීමට
    updateButtons();
});