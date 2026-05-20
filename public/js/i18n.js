// i18n.js — EduStreamix Multilingual Engine

(function () {
  'use strict';

  const LANG_CODES = {
    'English':   'en',
    'Hindi':     'hi',
    'Telugu':    'te',
    'Tamil':     'ta',
    'Kannada':   'kn',
    'Malayalam': 'ml'
  };

  // Native-script display names for the UI
  const LANG_NATIVE = {
    'English':   'English',
    'Hindi':     'हिंदी',
    'Telugu':    'తెలుగు',
    'Tamil':     'தமிழ்',
    'Kannada':   'ಕನ್ನಡ',
    'Malayalam': 'മലയാളം'
  };

  // ── Cache busting: clear old locale cache on version mismatch ──
  const LOCALE_VERSION = 'v3';
  if (localStorage.getItem('localeVersion') !== LOCALE_VERSION) {
    Object.keys(LANG_CODES).forEach(langName => {
      localStorage.removeItem('locale_' + LANG_CODES[langName]);
    });
    localStorage.setItem('localeVersion', LOCALE_VERSION);
  }


  let currentLangCode = 'en';
  let i18nDict = {};
  const allLocales = {};   // memory cache keyed by lang code

  /* ── Load a locale JSON (memory → localStorage → network) ── */
  async function loadLocale(code) {
    if (allLocales[code]) return allLocales[code];

    const stored = localStorage.getItem('locale_' + code);
    if (stored) {
      try {
        allLocales[code] = JSON.parse(stored);
        return allLocales[code];
      } catch (e) { /* corrupted cache — fall through */ }
    }

    try {
      const res  = await fetch('/locales/' + code + '.json?v=3');
      const data = await res.json();
      allLocales[code] = data;
      // Store with version stamp so we can bust stale cache later
      localStorage.setItem('locale_' + code, JSON.stringify(data));
      return data;
    } catch (e) {
      console.error('[i18n] Failed to load locale:', code, e);
      return {};
    }
  }

  /* ── Apply a language to the whole page ── */
  async function applyLanguage(langName) {
    const code = LANG_CODES[langName] || 'en';
    currentLangCode = code;

    // Always make sure English is available as fallback
    if (!allLocales['en']) await loadLocale('en');

    i18nDict = await loadLocale(code);
    localStorage.setItem('appLang', langName);

    // Update <html lang="..."> for correct Unicode font rendering
    document.documentElement.lang = code;

    // Patch every [data-i18n] element
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key  = el.getAttribute('data-i18n');
      const val  = i18nDict[key] || (allLocales['en'] && allLocales['en'][key]) || null;
      if (!val) return;

      const attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, val);
      } else {
        el.innerHTML = val;
      }
    });

    // Sync all language selector dropdowns on the page to show current language
    document.querySelectorAll('.nav-lang-switcher').forEach(sel => {
      if (sel.value !== langName) sel.value = langName;
    });

    // Sync nav-lang-display spans (subjects page)
    document.querySelectorAll('#nav-lang-display').forEach(el => {
      el.textContent = LANG_NATIVE[langName] || langName;
    });

    // Broadcast so JS-generated elements can react
    window.i18nReady = true;
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: langName }));
  }

  /* ── Translation helper: use in JS-generated HTML ── */
  function t(key) {
    if (i18nDict && i18nDict[key] !== undefined) return i18nDict[key];
    if (allLocales['en'] && allLocales['en'][key] !== undefined) return allLocales['en'][key];
    return key;
  }

  /* ── Init on page load ── */
  async function initI18n() {
    // Pre-load English so t() always has a fallback instantly
    await loadLocale('en');

    const savedLang = localStorage.getItem('appLang') || 'English';
    await applyLanguage(savedLang);
  }

  /* ── Expose on window so every page/script can call them ── */
  window.applyLanguage  = applyLanguage;
  window.t              = t;
  window.LANG_CODES     = LANG_CODES;
  window.LANG_NATIVE    = LANG_NATIVE;
  window.i18nReady      = false;

  document.addEventListener('DOMContentLoaded', initI18n);
})();
