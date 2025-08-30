// ==========================================================
// === අලුතින් එකතු කළ යුතු MANAGE TOKEN MODAL SCRIPT ===
// ==========================================================
const manageTokenModal = $('#manageTokenModal');

// --- Modal විවෘත කිරීම ---
$('#manage-token-btn').on('click', function() {
    // ඔබට මෙහිදී modal එකට සැබෑ දත්ත ලබා දීමට පුළුවන්
    // ഉദാഹരണයක් ලෙස:
    // manageTokenModal.find('.token-details h4').text('Asiri Hospital - Diabetes');
    // manageTokenModal.find('.token-number-display h1').text(yourToken);
    
    manageTokenModal.addClass('show');
});

// --- Modal වැසීම (Close button එකෙන්) ---
$('#manageTokenModal .modal-close').on('click', function() {
    manageTokenModal.removeClass('show');
});

// --- Modal වැසීම (Overlay එක click කිරීමෙන්) ---
manageTokenModal.on('click', function(e) {
    if ($(e.target).is(manageTokenModal)) {
        manageTokenModal.removeClass('show');
    }
});

// --- Token Cancel කිරීමේ ක්‍රියාවලිය ---
$('#cancel-token-btn').on('click', function() {
    // වැරදීමකින් cancel වීම වැළැක්වීමට තහවුරු කිරීමක්
    if (confirm("Are you sure you want to cancel this token? This action cannot be undone.")) {
        // සැබෑ යෙදුමකදී, මෙතැනදී API call එකක් හරහා server එකට දැනුම් දෙනු ලැබේ.
        
        // Modal එක වැසීම
        manageTokenModal.removeClass('show');
        
        // සාර්ථක බවට notification එකක් පෙන්වීම
        showNotification("Your token has been successfully cancelled."); 
        
        // ඔබට අවශ්‍ය නම්, token display එක reset කිරීමටද හැකිය.
        // $('#yourTokenNumber').text('-');
    }
});

// --- Get Help Button ක්‍රියාවලිය ---
$('#get-help-btn').on('click', function() {
    showNotification("Contacting support...");
    // ඔබට මෙහිදී support chat එකක් විවෘත කිරීමට හෝ support පිටුවකට යොමු කිරීමට හැකිය.
});