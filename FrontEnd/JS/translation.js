// =================================================================
// MEDIQUE - CENTRAL TRANSLATION SCRIPT (USING MYMEMORY API - FINAL)
// =================================================================

const sourceTexts = {};
const cachedTranslations = {};

// 1. පිටුව load වූ විට, HTML එකෙන් මුල් English text ටික ස්වයංක්‍රීයව ලබාගැනීම
function initializeSourceTexts() {
    $('[data-translate-key]').each(function() {
        const key = $(this).data('translate-key');
        if (key) {
            const text = $(this).text().trim();
            sourceTexts[key] = text;
        }
    });
}

// 2. භාෂාවක් තේරූ විට ක්‍රියාත්මක වන ප්‍රධාන function එක
function changeLanguage(langCode) {
    if (!langCode) return;
    localStorage.setItem('preferredLanguage', langCode);
    updateUIForLanguage(langCode);
}

// 3. UI එකේ text යාවත්කාලීන කරන function එක (MyMemory API සමඟ)
function updateUIForLanguage(langCode) {
    $('.language-btn').removeClass('active');
    $(`.language-btn[data-lang='${langCode}']`).addClass('active');

    if (langCode === 'en') {
        applyTranslations(sourceTexts);
        $(document).trigger('languageChange', 'en');
        return;
    }

    if (cachedTranslations[langCode]) {
        applyTranslations(cachedTranslations[langCode]);
        $(document).trigger('languageChange', langCode);
        return;
    }

    const keys = Object.keys(sourceTexts);
    const translationPromises = keys.map(key => {
        const textToTranslate = sourceTexts[key];
        const langPair = `en|${langCode}`;
        
        return $.ajax({
            method: 'GET',
            url: `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${langPair}`
        });
    });

    Promise.all(translationPromises)
        .then(responses => {
            const newTranslations = {};
            responses.forEach((response, index) => {
                const key = keys[index];
                if (response.responseStatus === 200) {
                    newTranslations[key] = response.responseData.translatedText;
                } else {
                    newTranslations[key] = sourceTexts[key]; // Fallback
                }
            });

            cachedTranslations[langCode] = newTranslations;
            applyTranslations(newTranslations);
            $(document).trigger('languageChange', langCode);
        })
        .catch(err => {
            console.error("MyMemory API Error:", err);
            alert("Sorry, the translation service is currently unavailable.");
            applyTranslations(sourceTexts);
            $(document).trigger('languageChange', 'en');
        });
}

// 4. ලැබුණු පරිවර්තන HTML elements වලට යොදන function එක
function applyTranslations(translations) {
    $('[data-translate-key]').each(function() {
        const key = $(this).data('translate-key');
        if (translations[key]) {
             $(this).text(translations[key]);
        }
    });
}

// 5. පිටුව load වූ පසු, translator එක ක්‍රියාත්මක කිරීම
$(document).ready(function() {
    $('.language-btn').on('click', function() {
        const langCode = $(this).data('lang');
        changeLanguage(langCode);
    });
    
    initializeSourceTexts();
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
    updateUIForLanguage(preferredLanguage);
});