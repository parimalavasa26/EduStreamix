/* EduStreamix — Client-Side Study Page Logic */
(function () {
  'use strict';

  const GRADE   = window.__GRADE__;
  const BOARD   = window.__BOARD__;
  const SUBJECT = window.__SUBJECT__;
  const DISPLAY_SUBJECT = window.__DISPLAY_SUBJECT__ || SUBJECT;
  let LANGUAGE  = localStorage.getItem('appLang') || window.__LANGUAGE__ || 'English';
  let currentChapterData = null;
  let ytPlayer = null;

  // Frontend-only display name mapping for ICSE English (safe; does not change internal keys)
  // Maps lessonNo -> display label for chapters where internal chapterName must remain unchanged
  const ICSE_EN_DISPLAY_MAP = {
    '3': 'Present Tense',
    '4': 'Past Tense',
    '5': 'Future Tense',
    '6': 'Sentences - Part 1',
    '7': 'Sentences - Part 2',
    '14': 'Active and Passive Voice - Part 1',
    '15': 'Active and Passive Voice - Part 2',
    '20': 'Reported Speech - Part 1',
    '21': 'Reported Speech - Part 2',
    '23': 'Transformation of Sentences - Part 1',
    '24': 'Transformation of Sentences - Part 2'
  };

  function getDisplayLabelForChapter(ch) {
    if (!ch) return null;
    // Only apply mapping for ICSE board when the selected subject is English
    if ((BOARD || '').toUpperCase() === 'ICSE' && (SUBJECT || '').toLowerCase() === 'english') {
      const key = String(ch.lessonNo != null ? ch.lessonNo : (ch.lesson != null ? ch.lesson : '')).trim();
      if (key && ICSE_EN_DISPLAY_MAP[key]) return ICSE_EN_DISPLAY_MAP[key];
    }
    return null;
  }

  // Inject YouTube API
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  if (firstScriptTag) firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  else document.head.appendChild(tag);

  // DOM
  const chaptersSection = document.getElementById('chapters-section');
  const chaptersList    = document.getElementById('chapters-list');
  const videoSection    = document.getElementById('video-section');

  /* ── Fetch chapters (cache per lang+grade+board+subject) ── */
  async function getFinalChapters(grade, board, subject, selectedLanguage) {
    const cacheKey = `chapters_v5_${selectedLanguage}_${grade}_${board}_${subject}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }

    const params = new URLSearchParams({ grade, board, subject, lang: selectedLanguage });
    const res  = await fetch('/api/chapters?' + params.toString());
    const data = await res.json();

    if (data.chapters) {
      sessionStorage.setItem(cacheKey, JSON.stringify(data.chapters));
      return data.chapters;
    }
    return [];
  }

  function cleanChapterTitle(title) {
    if (!title) return title;
    return title.replace(/\s*\([^)]*\)\s*$/g, '').trim();
  }

  /* ── Render chapters table ── */
  async function showChapters() {
    hideAllSections();
    chaptersSection.style.display = '';
    if (window.updateGlobalNav) window.updateGlobalNav();
    chaptersList.innerHTML = `
      <div class="loader-spinner" style="margin: 0 auto;"></div>
      ${Array(3).fill('<div class="skeleton-item" style="margin-top:1rem;"></div>').join('')}
    `;

    try {
      const finalChapters = await getFinalChapters(GRADE, BOARD, SUBJECT, LANGUAGE);

      if (!finalChapters || !finalChapters.length) {
        chaptersList.innerHTML = '<p class="no-data-msg">' + (window.t ? window.t('No chapters found.') : 'No chapters found.') + '</p>';
        return;
      }

      chaptersList.innerHTML = '';

      const units = {};
      finalChapters.forEach(ch => {
        const u = ch.unitName || 'General';
        if (!units[u]) units[u] = [];
        units[u].push(ch);
      });

      for (const [unitName, chaps] of Object.entries(units)) {
        const table = document.createElement('table');
        table.className = 'chapters-table';

        const thead = document.createElement('thead');

        // Translate static UI labels using t()
        const lessonNoLabel    = window.t ? window.t('Lesson No.')    : 'Lesson No.';
        const chapterTitleLabel = window.t ? window.t('Chapter Title') : 'Chapter Title';

        thead.innerHTML = `
          <tr class="unit-title-row">
            <th colspan="2">${unitName}</th>
          </tr>
          <tr class="col-headers-row">
            <th>${lessonNoLabel}</th>
            <th>${chapterTitleLabel}</th>
          </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const watchedKey = `watched_${GRADE}_${BOARD}_${SUBJECT}`;
        const watchedChapters = JSON.parse(localStorage.getItem(watchedKey) || '[]');
        
        chaps.forEach(ch => {
          const tr = document.createElement('tr');
          const isWatched = watchedChapters.includes(ch.chapterName);
          tr.className = 'chapter-row' + (isWatched ? ' watched' : '');
          
          tr.addEventListener('click', () => {
            currentChapterData = ch;
            showVideoMode(LANGUAGE);
          });

          const chapterTitle = cleanChapterTitle(ch.chapterName || '-');
          // apply frontend display mapping when applicable (ICSE English)
          const mapped = getDisplayLabelForChapter(ch);
          const displayTitle = mapped || chapterTitle;
          const checkmark = isWatched ? '<span class="watched-check">✔️</span>' : '';
          tr.innerHTML = `
            <td class="col-lesson">${ch.lessonNo || '-'}${checkmark}</td>
            <td class="col-title">${displayTitle}</td>
          `;
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        chaptersList.appendChild(table);
      }
    } catch (e) {
      console.error(e);
      chaptersList.innerHTML = '<p class="no-data-msg error-msg">' + (window.t ? window.t('Error loading chapters.') : 'Error loading chapters.') + '</p>';
    }
  }

  /* ── Video Mode ── */
  async function showVideoMode(selectedLanguage, instantSwitch) {
    selectedLanguage = selectedLanguage || LANGUAGE;
    const titleEl    = document.getElementById('video-title');
    const metaEl     = document.getElementById('video-meta');
    const loader     = document.getElementById('video-loader');

    const wrapper = document.getElementById('video-wrapper');
    let placeholder = document.getElementById('video-iframe-container');
    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.id = 'video-iframe-container';
      placeholder.style.cssText = 'display:none; position:absolute; top:0; left:0; width:100%; height:100%;';
      wrapper.appendChild(placeholder);
    }

    if (!instantSwitch) {
      hideAllSections();
      videoSection.style.display = '';
      if (window.updateGlobalNav) window.updateGlobalNav();
      loader.style.display = 'flex';
      placeholder.style.display = 'none';
      titleEl.textContent = window.t ? window.t('Loading video...') : 'Loading video...';
      titleEl.setAttribute('data-i18n', 'Loading video...');
      metaEl.innerHTML = '';
      resetQuizSection();
    }

    try {
      let videoData = null;
      let cachedFlag = false;

      if (currentChapterData.link) {
        let videoId = '';
        if (currentChapterData.link.includes('embed/')) {
          videoId = currentChapterData.link.split('embed/')[1].split('?')[0];
        } else if (currentChapterData.link.includes('v=')) {
          videoId = currentChapterData.link.split('v=')[1].split('&')[0];
        }

        if (videoId) {
          videoData = {
            youtubeVideoId: videoId,
            title: currentChapterData.chapterName + ' — ' + DISPLAY_SUBJECT
          };
          cachedFlag = true;
        } else {
          window.open(currentChapterData.link, '_blank');
          hideAllSections();
          chaptersSection.style.display = '';
          return;
        }
      }

      if (!videoData) {
        const params = new URLSearchParams({
          chapter:  currentChapterData.originalChapterName || currentChapterData.chapterName,
          grade:    GRADE,
          language: selectedLanguage,
          board:    BOARD,
          subject:  SUBJECT
        });
        const res  = await fetch('/api/video?' + params.toString());
        const data = await res.json();

        if (!data.video) {
          titleEl.textContent = window.t ? window.t('No video found') : 'No video found';
          loader.innerHTML = '<p class="no-data-msg error-msg">' + (window.t ? window.t('No video found for this topic.') : 'No video found for this topic.') + '</p>';
          return;
        }
        videoData  = data.video;
        cachedFlag = data.cached;
      }

      // prefer frontend display mapping for the video title when applicable
      const mappedVideoTitle = getDisplayLabelForChapter(currentChapterData);
      videoData.title = mappedVideoTitle || cleanChapterTitle(currentChapterData.chapterName) || videoData.title || '';
      videoData.viewCount = null;
      videoData.likeCount = null;

      const langCodes = { 'English':'en', 'Hindi':'hi', 'Telugu':'te', 'Tamil':'ta', 'Kannada':'kn', 'Malayalam':'ml' };
      const code = langCodes[selectedLanguage] || 'en';

      if (ytPlayer) { ytPlayer.destroy(); ytPlayer = null; }

      placeholder = document.getElementById('video-iframe-container');
      if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.id = 'video-iframe-container';
        placeholder.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%;';
        wrapper.appendChild(placeholder);
      } else {
        placeholder.style.display = 'block';
      }

      ytPlayer = new YT.Player('video-iframe-container', {
        videoId: videoData.youtubeVideoId,
        playerVars: {
          autoplay: 1, rel: 0, modestbranding: 1,
          cc_load_policy: 1, hl: code, cc_lang_pref: code
        },
        events: {
          'onReady': (event) => {
            try {
              event.target.loadModule('captions');
              event.target.setOption('captions', 'track', { languageCode: code });
            } catch (e) {}
          }
        }
      });

      loader.style.display = 'none';
      titleEl.textContent = videoData.title || (currentChapterData.chapterName + ' — ' + DISPLAY_SUBJECT);
      titleEl.removeAttribute('data-i18n');

      let meta = '';
      if (videoData.viewCount) meta += '<span>👁️ ' + Number(videoData.viewCount).toLocaleString() + ' views</span>';
      if (videoData.likeCount) meta += '<span>👍 ' + Number(videoData.likeCount).toLocaleString() + ' likes</span>';
      metaEl.innerHTML = meta;

    } catch (e) {
      titleEl.textContent = 'Error loading video';
      loader.innerHTML = '<p class="no-data-msg error-msg">Could not load video.</p>';
    }
  }

  /* ── Quiz ── */
  let currentQuizData = null;

  function resetQuizSection() {
    const section   = document.getElementById('quiz-section');
    const body      = document.getElementById('quiz-body');
    const actions   = document.getElementById('quiz-actions');
    const result    = document.getElementById('quiz-result');
    const retakeBtn = document.getElementById('quiz-retake-btn');
    const generateBtn = document.getElementById('quiz-generate-btn');

    if (!section || !body || !generateBtn) return;

    section.style.display    = '';
    actions.style.display    = 'none';
    result.style.display     = 'none';
    retakeBtn.style.display  = 'none';
    generateBtn.style.display = 'inline-flex';
    generateBtn.disabled     = false;
    generateBtn.textContent  = window.t ? window.t('Generate Quiz') : 'Generate Quiz';
    generateBtn.setAttribute('data-i18n', 'Generate Quiz');

    body.innerHTML = `<p class="quiz-prompt" data-i18n="Generate a practice quiz for this lesson.">Generate a practice quiz for this lesson.</p>`;
    generateBtn.onclick = generateQuiz;
  }

  async function generateQuiz() {
    const body      = document.getElementById('quiz-body');
    const actions   = document.getElementById('quiz-actions');
    const result    = document.getElementById('quiz-result');
    const retakeBtn = document.getElementById('quiz-retake-btn');
    const generateBtn = document.getElementById('quiz-generate-btn');
    const submitBtn = document.getElementById('quiz-submit-btn');

    if (!generateBtn || !body) return;
    if (!currentChapterData) {
      body.innerHTML = `<p class="error-msg">${window.t ? window.t('No chapter selected.') : 'No chapter selected.'}</p>`;
      return;
    }

    generateBtn.disabled = true;
    actions.style.display = 'none';
    result.style.display  = 'none';
    retakeBtn.style.display = 'none';
    body.innerHTML = `
      <div class="loader-spinner"></div>
      <p class="quiz-loading-text">${window.t ? window.t('Generating AI Quiz...') : 'Generating AI Quiz... This may take up to a minute.'}</p>
    `;

    try {
      const response = await fetch('/api/quiz/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board:       BOARD,
          grade:       GRADE,
          subject:     SUBJECT,
          focusTopic:  currentChapterData.chapterName,
          difficulty:  'medium',
          numQuestions: 5,
          lang:        LANGUAGE
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Quiz generation failed.');

      currentQuizData = data.questions;
      body.innerHTML  = '';

      const explanationLabel = window.t ? window.t('Explanation:') : 'Explanation:';

      currentQuizData.forEach((q, qi) => {
        let html = `
          <div class="quiz-question" id="q-container-${qi}">
            <p>${qi + 1}. ${q.question}</p>
            <div class="quiz-options">
        `;
        q.options.forEach((opt, oi) => {
          html += `
            <label class="quiz-option" id="label-${qi}-${oi}">
              <input type="radio" name="q${qi}" value="${oi}">
              ${opt}
            </label>
          `;
        });
        html += `
            </div>
            <div class="quiz-explanation" id="explanation-${qi}" style="display:none; margin-top:10px; padding:10px; background:#fef3c7; border-radius:8px; font-size:0.9rem; color:#78350f; border-left:4px solid var(--accent-1);">
              <strong>${explanationLabel}</strong> ${q.explanation}
            </div>
          </div>
        `;
        body.innerHTML += html;
      });

      actions.style.display = 'block';
      submitBtn.onclick = handleQuizSubmit;
    } catch (err) {
      body.innerHTML = `<p class="error-msg">Error: ${err.message}</p>`;
      generateBtn.disabled = false;
      generateBtn.textContent = window.t ? window.t('Generate Quiz') : 'Generate Quiz';
    }
  }

  // Expose generateQuiz for any retry paths
  window._generateQuiz = generateQuiz;

  function handleQuizSubmit() {
    let score = 0;
    const body      = document.getElementById('quiz-body');
    const submitBtn = document.getElementById('quiz-submit-btn');
    const retakeBtn = document.getElementById('quiz-retake-btn');
    const resultEl  = document.getElementById('quiz-result');

    currentQuizData.forEach((q, qi) => {
      const selected    = document.querySelector(`input[name="q${qi}"]:checked`);
      const correctIdx  = q.correctAnswerIndex;
      const explanationEl = document.getElementById(`explanation-${qi}`);

      const correctLabel = document.getElementById(`label-${qi}-${correctIdx}`);
      if (correctLabel) correctLabel.classList.add('correct');

      if (selected) {
        const userIdx   = parseInt(selected.value);
        const userLabel = document.getElementById(`label-${qi}-${userIdx}`);
        if (userIdx === correctIdx) {
          score++;
        } else {
          if (userLabel) userLabel.classList.add('wrong');
          if (explanationEl) explanationEl.style.display = 'block';
        }
      } else {
        if (explanationEl) explanationEl.style.display = 'block';
      }

      document.querySelectorAll(`input[name="q${qi}"]`).forEach(i => i.disabled = true);
    });

    // Build translated score string
    const youScored = window.t ? window.t('You scored') : 'You scored';
    const outOf     = window.t ? window.t('out of')     : 'out of';
    resultEl.style.display = 'block';
    resultEl.innerHTML     = `${youScored} ${score} ${outOf} ${currentQuizData.length}!`;
    resultEl.className     = 'quiz-result ' + (score === currentQuizData.length ? 'good' : (score > currentQuizData.length / 2 ? 'ok' : 'bad'));

    submitBtn.style.display  = 'none';
    retakeBtn.style.display  = 'block';
    retakeBtn.onclick        = generateQuiz;
  }

  /* ── Helpers ── */
  function hideAllSections() {
    chaptersSection.style.display = 'none';
    videoSection.style.display    = 'none';
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
      ytPlayer.stopVideo();
    }
  }

  /* ── React to language changes ── */
  document.addEventListener('languageChanged', (e) => {
    const newLang = e.detail;
    LANGUAGE = newLang;

    // Update YT captions seamlessly
    if (ytPlayer && typeof ytPlayer.setOption === 'function') {
      const langCodes = { 'English':'en', 'Hindi':'hi', 'Telugu':'te', 'Tamil':'ta', 'Kannada':'kn', 'Malayalam':'ml' };
      const code = langCodes[newLang] || 'en';
      try { ytPlayer.setOption('captions', 'track', { languageCode: code }); } catch (err) {}
    }

    // Re-render chapters on language change (clears session cache for new lang)
    showChapters();
  });

  /* ── Back Button ── */
  const backFromVideo = document.getElementById('back-from-video');
  if (backFromVideo) {
    backFromVideo.addEventListener('click', showChapters);
  }

  // Set up global nav callbacks to control Back / Next buttons on study page
  window.globalNavCallbacks = {
    update: (backBtn, nextBtn) => {
      const isVideoVisible = (videoSection.style.display !== 'none');
      if (isVideoVisible) {
        backBtn.onclick = () => {
          showChapters();
        };
        nextBtn.style.display = 'none';
      } else {
        backBtn.onclick = () => {
          window.location.href = `/subjects?grade=${GRADE}&board=${BOARD}&language=${encodeURIComponent(LANGUAGE)}`;
        };
        nextBtn.style.display = 'flex';
        nextBtn.disabled = true;
      }
    }
  };

  function triggerConfetti() {
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => {
        if (window.confetti) {
          window.confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      };
      document.head.appendChild(script);
    }
  }

  /* ── Init: wait for languageChanged from i18n.js so t() is ready ── */
  // The first languageChanged fires on DOMContentLoaded from i18n.js
  document.addEventListener('languageChanged', () => {
    // Only call showChapters once per page load to avoid multiple fetches on bootstrap
    if (!window.__initialized_chapters__) {
      window.__initialized_chapters__ = true;
      showChapters();
    }
  });
})();
