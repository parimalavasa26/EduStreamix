// global-nav.js — EduStreamix Global Back/Next Navigation

(function () {
  'use strict';

  function initGlobalNav() {
    if (document.getElementById('global-btn-back')) return;

    const backBtn = document.createElement('button');
    backBtn.className = 'global-nav-btn btn-back';
    backBtn.id = 'global-btn-back';
    backBtn.innerHTML = '← Back';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'global-nav-btn btn-next';
    nextBtn.id = 'global-btn-next';
    nextBtn.innerHTML = 'Next →';

    document.body.appendChild(backBtn);
    document.body.appendChild(nextBtn);

    function getQueryParam(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }

    function updateNavButtons() {
      const path = window.location.pathname;
      const grade = getQueryParam('grade') || '8';
      const board = getQueryParam('board') || localStorage.getItem('selectedBoard') || 'CBSE';
      
      let lang = getQueryParam('language') || localStorage.getItem('appLang') || 'English';
      // Normalize language name if needed
      if (lang === 'en') lang = 'English';

      // Set translated labels
      const backText = window.t ? window.t('Back') : 'Back';
      const nextText = window.t ? window.t('Next') : 'Next';
      backBtn.innerHTML = '← ' + backText;
      nextBtn.innerHTML = nextText + ' →';

      // Reset default displays
      backBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
      backBtn.disabled = false;
      nextBtn.disabled = false;

      if (path === '/') {
        backBtn.style.display = 'none';
        nextBtn.onclick = () => {
          window.location.href = `/boards?grade=${grade}&language=${encodeURIComponent(lang)}`;
        };
      } else if (path === '/boards') {
        backBtn.onclick = () => {
          window.location.href = '/';
        };
        const currentBoard = localStorage.getItem('selectedBoard');
        if (!currentBoard) {
          nextBtn.disabled = true;
        } else {
          nextBtn.onclick = () => {
            window.location.href = `/subjects?grade=${grade}&board=${currentBoard}&language=${encodeURIComponent(lang)}`;
          };
        }
      } else if (path === '/languages') {
        backBtn.onclick = () => {
          window.location.href = '/';
        };
        const selectedLang = localStorage.getItem('appLang') || '';
        if (!selectedLang) {
          nextBtn.disabled = true;
        } else {
          nextBtn.disabled = false;
          nextBtn.onclick = () => {
            window.location.href = `/boards?grade=${grade}&language=${encodeURIComponent(selectedLang)}`;
          };
        }
      } else if (path === '/subjects') {
        backBtn.onclick = () => {
          window.location.href = `/boards?grade=${grade}&language=${encodeURIComponent(lang)}`;
        };
        const currentSubject = localStorage.getItem('selectedSubject');
        if (!currentSubject) {
          nextBtn.disabled = true;
        } else {
          nextBtn.onclick = () => {
            window.location.href = `/study?grade=${grade}&board=${board}&subject=${encodeURIComponent(currentSubject)}&language=${encodeURIComponent(lang)}`;
          };
        }
      } else if (path === '/study') {
        // Study page sub-states are managed by app.js callbacks
        if (window.globalNavCallbacks && typeof window.globalNavCallbacks.update === 'function') {
          window.globalNavCallbacks.update(backBtn, nextBtn);
        } else {
          // Default fallback
          backBtn.onclick = () => {
            window.location.href = `/subjects?grade=${grade}&board=${board}&language=${encodeURIComponent(lang)}`;
          };
          nextBtn.disabled = true;
        }
      }
    }

    updateNavButtons();

    window.addEventListener('storage', updateNavButtons);
    document.addEventListener('languageChanged', updateNavButtons);
    document.addEventListener('selectionChanged', updateNavButtons);
    
    window.updateGlobalNav = updateNavButtons;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalNav);
  } else {
    initGlobalNav();
  }
})();
