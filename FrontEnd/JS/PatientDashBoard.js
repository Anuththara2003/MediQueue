
let currentLanguage = 'en';
let smsEnabled = true;
let currentToken = 45;
let yourToken = 52;

const translations = {
    en: {
        welcomeTitle: "🏥 Patient Dashboard",
        welcomeText: "Welcome, Kamal Perera",
        hospitalSelectTitle: "Select Hospital & Clinic",
        tokenStatusTitle: "Current Token Status",
        currentTokenLabel: "Current Token",
        waitTimeLabel: "Estimated Wait",
        queueLabel: "In Queue",
        queueInfo: "7 more patients to go",
        alertsTitle: "SMS Alerts",
        smsStatusText: "SMS Notifications",
        smsDescription: "Get notified when your turn approaches",
        healthTipTitle: "💡 Health Tip of the Day",
        healthTipText: "Stay hydrated by drinking at least 8 glasses of water daily. Proper hydration helps maintain your body temperature and supports overall health.",
        registerBtn: "Register New Token",
        manageBtn: "Manage Token",
        waitTime: "25 minutes",
        queueCount: "12 patients"
    },
    si: {
        welcomeTitle: "🏥 රෝගී පුවරුව",
        welcomeText: "ආයුබෝවන්, කමල් පෙරේරා",
        hospitalSelectTitle: "රෝහල සහ ක්ලිනික තෝරන්න",
        tokenStatusTitle: "වර්තමාන ටෝකනය තත්වය",
        currentTokenLabel: "වර්තමාන ටෝකනය",
        waitTimeLabel: "ඇස්තමේන්තුගත බලාගැනීම",
        queueLabel: "පෝලිමේ",
        queueInfo: "තවත් රෝගීන් 7 දෙනෙක්",
        alertsTitle: "SMS අනතුරු ඇඟවීම්",
        smsStatusText: "SMS දැනුම්දීම්",
        smsDescription: "ඔබේ වරය ළං වන විට දැනුම් දෙන්න",
        healthTipTitle: "💡 දිනයේ සෞඛ්‍ය උපදෙස",
        healthTipText: "දිනකට වතුර වීදුරු 8 ක්වත් පානය කිරීමෙන් ජලය පානය කරන්න. නිසි ජලය පානය ඔබේ ශරීර උෂ්ණත්වය පවත්වා ගැනීමට සහ සමස්ත සෞඛ්‍යයට සහාය වේ.",
        registerBtn: "නව ටෝකනයක් ලියාපදිංචි කරන්න",
        manageBtn: "ටෝකනය කළමනාකරණය කරන්න",
        waitTime: "මිනිත්තු 25",
        queueCount: "රෝගීන් 12 දෙනෙක්"
    },
    ta: {
        welcomeTitle: "🏥 நோயாளி டாஷ்போர்டு",
        welcomeText: "வணக்கம், கமல் பெரேரா",
        hospitalSelectTitle: "மருத்துவமனை மற்றும் கிளினிக் தேர்வு",
        tokenStatusTitle: "தற்போதைய டோக்கன் நிலை",
        currentTokenLabel: "தற்போதைய டோக்கன்",
        waitTimeLabel: "மதிப்பிட்ட காத்திருப்பு",
        queueLabel: "வரிசையில்",
        queueInfo: "மேலும் 7 நோயாளிகள்",
        alertsTitle: "SMS எச்சரிக்கைகள்",
        smsStatusText: "SMS அறிவிப்புகள்",
        smsDescription: "உங்கள் முறை நெருங்கும் போது அறிவிக்கப்படும்",
        healthTipTitle: "💡 நாளின் சுகாதார குறிப்பு",
        healthTipText: "தினமும் குறைந்தது 8 கிளாஸ் தண்ணீர் குடிப்பதன் மூலம் நீரேற்றத்தை பராமரிக்கவும். சரியான நீரேற்றம் உங்கள் உடல் வெப்பநிலையை பராமரிக்க உதவுகிறது.",
        registerBtn: "புதிய டோக்கன் பதிவு செய்யவும்",
        manageBtn: "டோக்கன் நிர்வாகம்",
        waitTime: "25 நிமிடங்கள்",
        queueCount: "12 நோயாளிகள்"
    }
};

const healthTips = {
    en: [
        "Stay hydrated by drinking at least 8 glasses of water daily. Proper hydration helps maintain your body temperature and supports overall health.",
        "Regular exercise for 30 minutes daily can significantly improve your cardiovascular health and boost your immune system.",
        "Maintain a balanced diet rich in fruits, vegetables, and whole grains to provide your body with essential nutrients.",
        "Get 7-8 hours of quality sleep each night to allow your body to repair and rejuvenate itself.",
        "Practice deep breathing exercises to reduce stress and improve your mental well-being."
    ],
    si: [
        "දිනකට වතුර වීදුරු 8 ක්වත් පානය කිරීමෙන් ජලය පානය කරන්න. නිසි ජලය පානය ඔබේ ශරීර උෂ්ණත්වය පවත්වා ගැනීමට සහ සමස්ත සෞඛ්‍යයට සහාය වේ.",
        "දිනකට මිනිත්තු 30ක නිරන්තර ව්‍යායාම ඔබේ හෘද සෞඛ්‍යය සැලකිය යුතු ලෙස වැඩිදියුණු කළ හැකිය.",
        "ඔබේ ශරීරයට අත්‍යවශ්‍ය පෝෂ්‍ය පදාර්ථ ලබා දීම සඳහා පලතුරු, එළවළු සහ සම්පූර්ණ ධාන්‍ය වලින් පොහොසත් සමබර ආහාර වේලක් පවත්වා ගන්න.",
        "ඔබේ ශරීරය අලුත්වැඩියා කර පුනර්ජීවනය කිරීමට ඉඩ දීම සඳහා රාත්‍රියකට පැය 7-8ක ගුණාත්මක නින්දක් ලබා ගන්න.",
        "ආතතිය අඩු කිරීමට සහ ඔබේ மாறியது மன நலனை மேம்படுத்த ஆழ்ந்த சுவாச பயிற்சிகளை பயிற்சி செய்யுங்கள."
    ],
    ta: [
        "தினமும் குறைந்தது 8 கிளாஸ் தண்ணீர் குடிப்பதன் மூலம் நீரேற்றத்தை பராமரிக்கவும். சரியான நீரேற்றம் உங்கள் உடல் வெப்பநிலையை பராமரிக்க உதவுகிறது.",
        "தினமும் 30 நிமிட வழக்கமான உடற்பயிற்சி உங்கள் இதய ஆரோக்கியத்தை கணிசமாக மேம்படுத்தும்.",
        "உங்கள் உடலுக்கு அத்தியாவசிய ஊட்டச்சத்துக்களை வழங்க பழங்கள், காய்கறிகள் மற்றும் முழு தானியங்கள் நிறைந்த சமச்சீர் உணவை பராமரிக்கவும்.",
        "உங்கள் உடல் சரிசெய்து புத்துயிர் பெற இரவுக்கு 7-8 மணிநேர தரமான தூக்கம் பெறுங்கள்.",
        "மன அழுத்தத்தை குறைக்க மற்றும் உங்கள் மன நலனை மேம்படுத்த ஆழ்ந்த சுவாச பயிற்சிகளை பயிற்சி செய்யுங்கள."
    ]
};

function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Update active button
    document.querySelectorAll('.language-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update all text elements
    const elements = translations[lang];
    Object.keys(elements).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = elements[key];
        }
    });
    
    // Update health tip
    updateHealthTip();
    
    showNotification(lang === 'en' ? 'Language changed to English' : 
                   lang === 'si' ? 'භාෂාව සිංහලට වෙනස් කරන ලදී' : 
                   'மொழி தமிழாக மாற்றப்பட்டது');
}

function updateHealthTip() {
    const tips = healthTips[currentLanguage];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('healthTipText').textContent = randomTip;
}

function updateHospitalInfo() {
    const hospital = document.getElementById('hospitalSelect').value;
    if (hospital) {
        // Simulate token update based on selected hospital
        const tokens = {
            'colombo-general': 67,
            'kandy-general': 34,
            'galle-general': 23,
            'negombo-hospital': 45
        };
        
        currentToken = tokens[hospital] || 45;
        document.getElementById('currentToken').textContent = currentToken;
        
        // Update your token and queue info
        yourToken = currentToken + Math.floor(Math.random() * 15) + 5;
        document.getElementById('yourTokenNumber').textContent = yourToken;
        
        const remaining = yourToken - currentToken;
        const queueText = currentLanguage === 'en' ? `${remaining} more patients to go` :
                        currentLanguage === 'si' ? `තවත් රෝගීන් ${remaining} දෙනෙක්` :
                        `மேலும் ${remaining} நோயாளிகள்`;
        document.getElementById('queueInfo').textContent = queueText;
        
        showNotification(currentLanguage === 'en' ? 'Hospital updated successfully!' :
                       currentLanguage === 'si' ? 'රෝහල සාර්ථකව යාවත්කාලීන කරන ලදී!' :
                       'மருத்துவமனை வெற்றிகரமாக புதுப்பிக்கப்பட்டது!');
    }
}

function updateClinicInfo() {
    const clinic = document.getElementById('clinicSelect').value;
    if (clinic) {
        // Simulate wait time update based on clinic
        const waitTimes = {
            'cardiology': { en: '35 minutes', si: 'මිනිත්තු 35', ta: '35 நிமிடங்கள்' },
            'diabetes': { en: '20 minutes', si: 'මිනිත්තු 20', ta: '20 நிமிடங்கள்' },
            'orthopedic': { en: '45 minutes', si: 'මිනිත්තු 45', ta: '45 நிமிடங்கள்' },
            'pediatric': { en: '15 minutes', si: 'මිනිත්තු 15', ta: '15 நிமிடங்கள்' }
        };
        
        const waitTime = waitTimes[clinic] || { en: '25 minutes', si: 'මිනිත්තු 25', ta: '25 நிமிடங்கள்' };
        document.getElementById('waitTime').textContent = waitTime[currentLanguage];
        
        showNotification(currentLanguage === 'en' ? 'Clinic information updated!' :
                       currentLanguage === 'si' ? 'ක්ලිනික තොරතුරු යාවත්කාලීන කරන ලදී!' :
                       'கிளினிக் தகவல் புதுப்பிக்கப்பட்டது!');
    }
}

function toggleSMS() {
    const toggleSwitch = document.querySelector('.toggle-switch');
    smsEnabled = !smsEnabled;
    
    if (smsEnabled) {
        toggleSwitch.classList.add('active');
        showNotification(currentLanguage === 'en' ? 'SMS alerts enabled successfully!' :
                       currentLanguage === 'si' ? 'SMS අනතුරු ඇඟවීම් සාර්ථකව සක්‍රිය කරන ලදී!' :
                       'SMS எச்சரிக்கைகள் வெற்றிகரமாக இயக்கப்பட்டன!');
    } else {
        toggleSwitch.classList.remove('active');
        showNotification(currentLanguage === 'en' ? 'SMS alerts disabled!' :
                       currentLanguage === 'si' ? 'SMS අනතුරු ඇඟවීම් අක්‍රිය කරන ලදී!' :
                       'SMS எச்சரிக்கைகள் முடக்கப்பட்டன!');
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function registerToken() {
    const hospital = document.getElementById('hospitalSelect').value;
    const clinic = document.getElementById('clinicSelect').value;
    
    if (!hospital || !clinic) {
        showNotification(currentLanguage === 'en' ? 'Please select hospital and clinic first!' :
                       currentLanguage === 'si' ? 'කරුණාකර පළමුව රෝහල සහ ක්ලිනික තෝරන්න!' :
                       'தயவுசெய்து முதலில் மருத்துவமனை மற்றும் கிளினிக் தேர்வு செய்யவும்!');
        return;
    }
    
    // Simulate token registration
    const newToken = Math.floor(Math.random() * 50) + 1;
    yourToken = newToken;
    document.getElementById('yourTokenNumber').textContent = yourToken;
    
    const remaining = yourToken - currentToken;
    const queueText = currentLanguage === 'en' ? `${remaining} more patients to go` :
                    currentLanguage === 'si' ? `තවත් රෝගීන් ${remaining} දෙනෙක්` :
                    `மேலும் ${remaining} நோயாளிகள்`;
    document.getElementById('queueInfo').textContent = queueText;
    
    showNotification(currentLanguage === 'en' ? `Token ${newToken} registered successfully!` :
                   currentLanguage === 'si' ? `ටෝකනය ${newToken} සාර්ථකව ලියාපදිංචි කරන ලදී!` :
                   `டோக்கன் ${newToken} வெற்றிகரமாக பதிவு செய்யப்பட்டது!`);
}

function manageToken() {
    const hospital = document.getElementById('hospitalSelect').value;
    const clinic = document.getElementById('clinicSelect').value;
    
    if (!hospital || !clinic) {
        showNotification(currentLanguage === 'en' ? 'Please select hospital and clinic first!' :
                       currentLanguage === 'si' ? 'කරුණාකර පළමුව රෝහල සහ ක්ලිනික තෝරන්න!' :
                       'தயவுசெய்து முதலில் மருத்துவமனை மற்றும் கிளினிக் தேர்வு செய்யவும்!');
        return;
    }
    
    // Simulate token management options
    const options = currentLanguage === 'en' ? 
        ['Cancel Token', 'Reschedule', 'View Details'] :
        currentLanguage === 'si' ? 
        ['ටෝකනය අවලංගු කරන්න', 'නැවත කාලසටහන', 'විස්තර බලන්න'] :
        ['டோக்கன் ரத்து செய்', 'மறு கால அட்டவணை', 'விவரங்களைக் காண்க'];
    
    const action = prompt(currentLanguage === 'en' ? 
        'Select action:\n1. Cancel Token\n2. Reschedule\n3. View Details' :
        currentLanguage === 'si' ? 
        'ක්‍රියාව තෝරන්න:\n1. ටෝකනය අවලංගු කරන්න\n2. නැවත කාලසටහන\n3. විස්තර බලන්න' :
        'செயலைத் தேர்ந்தெடுக்கவும்:\n1. டோக்கன் ரத்து செய்\n2. மறு கால அட்டவணை\n3. விவரங்களைக் காண்க');
    
    if (action) {
        showNotification(currentLanguage === 'en' ? 
            `Action "${action}" completed successfully!` :
            currentLanguage === 'si' ? 
            `ක්‍රියාව "${action}" සාර්ථකව සම්පූර්ණ කරන ලදී!` :
            `செயல் "${action}" வெற்றிகரமாக முடிக்கப்பட்டது!`);
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Set initial health tip
    updateHealthTip();
    
    // Auto-update current token every 30 seconds
    setInterval(() => {
        if (currentToken < yourToken) {
            currentToken++;
            document.getElementById('currentToken').textContent = currentToken;
            
            const remaining = yourToken - currentToken;
            if (remaining <= 0) {
                showNotification(currentLanguage === 'en' ? 'Your turn is next!' :
                               currentLanguage === 'si' ? 'ඔබේ වරය ඊළඟ!' :
                               'உங்கள் முறை அடுத்தது!');
            }
        }
    }, 30000);
});
