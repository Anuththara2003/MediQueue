function updateUIForLanguage(langCode) {
    $('.language-btn').removeClass('active');
    $(`.language-btn[onclick*="'${langCode}'"]`).addClass('active');

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

    const textToTranslate = Object.values(sourceTexts).join('\n'); 
    
    // ඔබගේ API Key එක මෙතනට යොදන්න
    const rapidApiKey = '3fa5a69dd5mshe48bbff81a548a9p11fb77jsn848533fc4410'; 

    $.ajax({
        method: 'GET',
        url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
        headers: {
            'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com',
            'X-RapidAPI-Key': rapidApiKey
        },
        data: {
            text: textToTranslate,
            to: langCode,
            from: 'en'
        }
    }).done(function (response) {
        const translatedTextsArray = response.translated_text[langCode].split('\n');
        const newTranslations = {};
        const keys = Object.keys(sourceTexts);
        
        keys.forEach((key, index) => {
            newTranslations[key] = translatedTextsArray[index] || sourceTexts[key]; 
        });

        cachedTranslations[langCode] = newTranslations;
        applyTranslations(newTranslations);
        $(document).trigger('languageChange', langCode);

    }).fail(function (err) {
        console.error("RapidAPI Error:", err);
        applyTranslations(sourceTexts);
        $(document).trigger('languageChange', 'en');
    });
}