// i18n.js - Handles local dynamic translation

const langCodes = {
  'English': 'en',
  'Hindi': 'hi',
  'Telugu': 'te',
  'Tamil': 'ta',
  'Kannada': 'kn',
  'Malayalam': 'ml'
};

let currentLangCode = 'en';
let i18nDict = {};
let allLocales = {}; // Cache all locales

async function initI18n() {
  const savedLang = localStorage.getItem('appLang') || 'English';
  currentLangCode = langCodes[savedLang] || 'en';
  
  // Preload all locales at startup
  await Promise.all(
    Object.values(langCodes).map(async (code) => {
      try {
        const res = await fetch(`/locales/${code}.json`);
        allLocales[code] = await res.json();
      } catch (e) {
        console.error(`Failed to load locale: ${code}`, e);
        allLocales[code] = {};
      }
    })
  );

  applyLanguage(savedLang);
}

function applyLanguage(langName) {
  const code = langCodes[langName] || 'en';
  currentLangCode = code;
  i18nDict = allLocales[code] || {};
  localStorage.setItem('appLang', langName);

  // Translate all DOM elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18nDict[key]) {
      // Check if we translate a specific attribute
      const attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, i18nDict[key]);
      } else {
        el.innerHTML = i18nDict[key];
      }
    }
  });

  // Also broadcast event so JS generated elements can update
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: langName }));
}

function t(key) {
  if (i18nDict[key]) return i18nDict[key];
  if (currentLangCode === 'en') return key;
  
  // Strict language lock: fallback to a placeholder in the requested language
  const fallbacks = {
    'hi': '[अनुवाद उपलब्ध नहीं है]',
    'te': '[అనువాదం అందుబాటులో లేదు]',
    'ta': '[மொழிபெயர்ப்பு கிடைக்கவில்லை]',
    'kn': '[ಅನುವಾದ ಲಭ್ಯವಿಲ್ಲ]',
    'ml': '[വിവർത്തനം ലഭ്യമല്ല]'
  };
  return fallbacks[currentLangCode] || '[Translation unavailable]';
}

// Call on startup
document.addEventListener('DOMContentLoaded', initI18n);
