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
  await applyLanguage(savedLang);
}

async function loadLocale(code) {
  if (allLocales[code]) return allLocales[code];
  
  // Try localStorage cache first
  const cached = localStorage.getItem('locale_' + code);
  if (cached) {
    try {
      allLocales[code] = JSON.parse(cached);
      return allLocales[code];
    } catch(e) {}
  }
  
  // Fetch from server if not cached
  try {
    const res = await fetch(`/locales/${code}.json`);
    const data = await res.json();
    allLocales[code] = data;
    localStorage.setItem('locale_' + code, JSON.stringify(data));
    return data;
  } catch (e) {
    console.error(`Failed to load locale: ${code}`, e);
    return {};
  }
}

async function applyLanguage(langName) {
  const code = langCodes[langName] || 'en';
  currentLangCode = code;
  
  // Lazy load the dictionary
  i18nDict = await loadLocale(code);
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
  window.i18nReady = true;
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: langName }));
}

function t(key) {
  if (i18nDict && i18nDict[key]) return i18nDict[key];
  if (allLocales['en'] && allLocales['en'][key]) return allLocales['en'][key];
  return key;
}

// Call on startup
document.addEventListener('DOMContentLoaded', initI18n);
