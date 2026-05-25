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
            showVideoMode();
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
  async function showVideoMode(instantSwitch) {
    currentQuizKey = getQuizKey(currentChapterData);
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
      const videoUrl = currentChapterData?.videoUrl || '';

      if (!videoUrl) {
        titleEl.textContent = window.t ? window.t('No video found') : 'No video found';
        loader.innerHTML = '<p class="no-data-msg error-msg">' + (window.t ? window.t('Video unavailable for this chapter') : 'Video unavailable for this chapter') + '</p>';
        return;
      }

      // Use the chapter name for the video title (same for all languages)
      const mappedVideoTitle = getDisplayLabelForChapter(currentChapterData);
      const displayVideoTitle = (mappedVideoTitle ? cleanChapterTitle(mappedVideoTitle) : cleanChapterTitle(currentChapterData.chapterName)) || '';

      placeholder.style.display = 'block';
      let iframe = document.getElementById('video-iframe');
      if (!iframe) {
        placeholder.innerHTML = `<iframe id="video-iframe" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%;"></iframe>`;
      } else if (currentChapterData?.videoUrl) {
        iframe.src = currentChapterData.videoUrl;
      }

      loader.style.display = 'none';
      titleEl.textContent = displayVideoTitle || (currentChapterData.chapterName + ' — ' + DISPLAY_SUBJECT);
      titleEl.removeAttribute('data-i18n');
      metaEl.innerHTML = '';

    } catch (e) {
      console.error(e);
      titleEl.textContent = 'Error loading video';
      loader.innerHTML = '<p class="no-data-msg error-msg">Could not load video.</p>';
    }
  }

  /* ── Quiz ── */
  const quizStateCache = {};
  let currentQuizData = null;
  let currentQuizKey = null;

  function getQuizKey(chapter) {
    if (!chapter || !chapter.chapterName) return null;
    return `${GRADE}_${BOARD}_${SUBJECT}_${LANGUAGE}_${chapter.chapterName}`;
  }

  function resetQuizSection() {
    const section   = document.getElementById('quiz-section');
    const body      = document.getElementById('quiz-body');
    const actions   = document.getElementById('quiz-actions');
    const result    = document.getElementById('quiz-result');
    const retakeBtn = document.getElementById('quiz-retake-btn');
    const generateBtn = document.getElementById('quiz-generate-btn');
    const submitBtn = document.getElementById('quiz-submit-btn');

    if (!section || !body || !generateBtn) return;

    currentQuizData = null;
    if (currentQuizKey) {
      quizStateCache[currentQuizKey] = null;
      section.dataset.quizKey = currentQuizKey;
    }

    section.style.display     = '';
    actions.style.display     = 'none';
    result.style.display      = 'none';
    retakeBtn.style.display   = 'none';
    if (submitBtn) submitBtn.style.display = 'none';
    generateBtn.style.display = 'inline-flex';
    generateBtn.disabled      = false;
    generateBtn.textContent   = window.t ? window.t('Generate Quiz') : 'Generate Quiz';
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

    currentQuizKey = getQuizKey(currentChapterData);
    currentQuizData = null;
    if (currentQuizKey) quizStateCache[currentQuizKey] = null;

    generateBtn.disabled   = true;
    actions.style.display   = 'none';
    result.style.display    = 'none';
    submitBtn.style.display = 'none';
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
      if (currentQuizKey) quizStateCache[currentQuizKey] = currentQuizData;
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

      actions.style.display          = 'block';
      submitBtn.style.display         = 'inline-flex';
      submitBtn.disabled              = false;
      submitBtn.onclick               = handleQuizSubmit;
      generateBtn.style.display       = 'none';
      generateBtn.disabled            = false;
      retakeBtn.style.display         = 'inline-flex';
      retakeBtn.onclick               = generateQuiz;
    } catch (err) {
      body.innerHTML = `<p class="error-msg">Error: ${err.message}</p>`;
      generateBtn.disabled = false;
      generateBtn.style.display = 'inline-flex';
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

    if (!currentQuizData || !Array.isArray(currentQuizData)) return;

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
    retakeBtn.style.display  = 'inline-flex';
    retakeBtn.onclick        = generateQuiz;
  }

  /* ── Helpers ── */
  function hideAllSections() {
    chaptersSection.style.display = 'none';
    videoSection.style.display    = 'none';
    const iframe = document.getElementById('video-iframe');
    if (iframe) {
      iframe.src = '';
    }
  }

  /* ── React to language changes ── */
  document.addEventListener('languageChanged', (e) => {
    const newLang = e.detail;
    LANGUAGE = newLang;

    // Only re-render chapters if NOT currently viewing a video
    const isVideoVisible = (videoSection.style.display !== 'none');
    if (!isVideoVisible) {
      showChapters();
    }
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
