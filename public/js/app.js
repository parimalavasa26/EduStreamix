/* ════════════════════════════════════════════════
   EduStreamix — Client-Side Study Page Logic
   ════════════════════════════════════════════════ */
(function () {
  'use strict';

  const GRADE = window.__GRADE__;
  const BOARD = window.__BOARD__;
  const SUBJECT = window.__SUBJECT__;
  let LANGUAGE = window.__LANGUAGE__ || 'English';
  let currentChapterData = null;
  let ytPlayer = null;

  // Inject YouTube API
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  if(firstScriptTag) firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  else document.head.appendChild(tag);

  // DOM
  const chaptersSection = document.getElementById('chapters-section');
  const chaptersList = document.getElementById('chapters-list');

  const videoSection = document.getElementById('video-section');

  async function translateChaptersDeep(chapters, lang) {
    if (lang === 'English' || lang === 'en') return chapters;

    // Collect all unique strings
    const textsToTranslate = [];
    
    if (SUBJECT && !textsToTranslate.includes(SUBJECT)) textsToTranslate.push(SUBJECT);

    chapters.forEach(ch => {
      if (ch.unitName && !textsToTranslate.includes(ch.unitName)) textsToTranslate.push(ch.unitName);
      if (ch.chapterName && !textsToTranslate.includes(ch.chapterName)) textsToTranslate.push(ch.chapterName);
      if (ch.type && !textsToTranslate.includes(ch.type)) textsToTranslate.push(ch.type);
    });

    if (textsToTranslate.length === 0) return chapters;

    try {
      const res = await fetch('/translate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: textsToTranslate, targetLang: lang })
      });
      const translations = await res.json();

      const dict = {};
      textsToTranslate.forEach((txt) => {
        // Enforce dict mapping. Never fallback to English if translation exists!
        if (translations[txt] && translations[txt] !== txt) {
          dict[txt] = translations[txt];
        }
      });

      // Update Subject Name globally via dict mapping strictly
      if (dict[SUBJECT]) {
        const subjDisplay = document.getElementById('subject-display');
        if (subjDisplay) subjDisplay.textContent = dict[SUBJECT];
      }

      const mappedChapters = chapters.map(ch => ({
        ...ch,
        unitName: dict[ch.unitName] || ch.unitName,
        chapterName: dict[ch.chapterName] || ch.chapterName,
        type: dict[ch.type] || ch.type,
        lessonNo: ch.lessonNo || '-'
      }));

      console.log("Dictionary Mapping:", dict);
      console.log("Mapped unitNames:", mappedChapters.map(c => c.unitName));
      console.log("Mapped chapter titles:", mappedChapters.map(c => c.chapterName));

      return mappedChapters;
    } catch (e) {
      console.error('Batch translation failed:', e);
      return chapters;
    }
  }

  async function getFinalChapters(grade, board, subject, selectedLanguage) {
    const res = await fetch('/api/chapters?grade=' + grade + '&board=' + board + '&subject=' + encodeURIComponent(subject));
    const data = await res.json();
    if (!data.chapters || !data.chapters.length) return [];
    
    if (selectedLanguage === 'English' || selectedLanguage === 'en') {
      return data.chapters;
    }
    
    // Use v3 cache key to bust the old english transliteration cache!
    const cacheKey = `chapters_v3_${selectedLanguage}_${grade}_${board}_${subject}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch(e) {}
    }
    
    let isDone = false;
    const translationPromise = translateChaptersDeep(data.chapters, selectedLanguage)
      .then(translated => {
        isDone = true;
        // Temporary Debug Safety
        console.log("Selected Language:", selectedLanguage);
        console.log("Translated Chapters:", translated);
        
        // Only cache if translation was successful
        if (window.i18nReady) {
          localStorage.setItem(cacheKey, JSON.stringify(translated));
        }
        return translated;
      })
      .catch(e => {
        console.error(e);
        isDone = true;
        return data.chapters;
      });

    // 3 Second Maximum Loading Limit!
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        if (!isDone) resolve(data.chapters);
      }, 3000);
    });

    const result = await Promise.race([translationPromise, timeoutPromise]);

    // If it timed out, result is English. We setup a listener to update the UI when the slow translation finishes.
    if (result === data.chapters && !isDone) {
      console.warn("Translation taking longer than 3s. Falling back to English temporarily.");
      translationPromise.then(finalTranslated => {
        if (LANGUAGE === selectedLanguage) {
          console.log("Background translation finished! Re-rendering UI.");
          showChapters(); // Safe to recall, as it will instantly hit the cached data now!
        }
      });
    }

    return result;
  }

  // ── Load Chapters on Init ─────────────────
  async function showChapters() {
    hideAllSections();
    chaptersSection.style.display = '';
    chaptersList.innerHTML = `
      <div class="loader-spinner" style="margin: 0 auto;"></div>
      <p style="text-align:center; margin-top:1rem; color:var(--text-secondary);" data-i18n="Translating...">Translating...</p>
      ${Array(3).fill('<div class="skeleton-item" style="margin-top:1rem;"></div>').join('')}
    `;
    try {
      const finalChapters = await getFinalChapters(GRADE, BOARD, SUBJECT, LANGUAGE);
      
      if (!finalChapters || !finalChapters.length) {
        chaptersList.innerHTML = '<p class="no-data-msg">No chapters found.</p>';
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
        
        // Use the ALREADY TRANSLATED unitName from the data!
        // Do NOT pass it through window.t() again!
        const unitNameLabel = unitName;
        
        // Translate static UI labels
        const lessonNoLabel = window.t ? window.t('Lesson No.') : 'Lesson No.';
        const chapterTitleLabel = window.t ? window.t('Chapter Title') : 'Chapter Title';
        const typeLabel = window.t ? window.t('Type') : 'Type';

        const hideType = (GRADE == 8 && BOARD === 'SSC');
        const colspan = hideType ? 2 : 3;

        thead.innerHTML = `
          <tr class="unit-title-row">
            <th colspan="${colspan}">${unitNameLabel}</th>
          </tr>
          <tr class="col-headers-row">
            <th>${lessonNoLabel}</th>
            <th>${chapterTitleLabel}</th>
            ${hideType ? '' : `<th>${typeLabel}</th>`}
          </tr>
        `;
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        chaps.forEach(ch => {
          const tr = document.createElement('tr');
          tr.className = 'chapter-row';
          tr.addEventListener('click', () => {
            currentChapterData = ch;
            showVideoMode(LANGUAGE);
          });
          
          tr.innerHTML = `
            <td class="col-lesson">${ch.lessonNo || '-'}</td>
            <td class="col-title">${ch.chapterName || '-'}</td>
            ${hideType ? '' : `<td class="col-type">${ch.type || '-'}</td>`}
          `;
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        
        chaptersList.appendChild(table);
      }
    } catch (e) {
      console.error(e);
      chaptersList.innerHTML = '<p class="no-data-msg error-msg">Error loading chapters.</p>';
    }
  }


  // ── Video Mode ────────────────────────────
  async function showVideoMode(selectedLanguage = LANGUAGE, instantSwitch = false) {
    const titleEl = document.getElementById('video-title');
    const metaEl = document.getElementById('video-meta');
    const loader = document.getElementById('video-loader');
    
    // Handle YT Player Div
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
      loader.style.display = 'flex';
      placeholder.style.display = 'none';
      titleEl.textContent = window.t ? window.t('Loading video...') : 'Loading video...';
      titleEl.setAttribute('data-i18n', 'Loading video...');
      metaEl.innerHTML = '';

      // Reset components
      document.getElementById('quiz-section').style.display = 'none';
    }

    try {
      const params = new URLSearchParams({
        chapter: currentChapterData.chapterName, grade: GRADE, language: selectedLanguage, board: BOARD, subject: SUBJECT
      });
      const res = await fetch('/api/video?' + params.toString());
      const data = await res.json();

      if (!data.video) {
        titleEl.textContent = 'No video found';
        loader.innerHTML = '<p class="no-data-msg error-msg">No video found for this topic.</p>';
        return;
      }
      
      const langCodes = { 'English':'en', 'Hindi':'hi', 'Telugu':'te', 'Tamil':'ta', 'Kannada':'kn', 'Malayalam':'ml' };
      const code = langCodes[selectedLanguage] || 'en';

      if (ytPlayer) {
        ytPlayer.destroy();
        ytPlayer = null;
      }
      
      let placeholder = document.getElementById('video-iframe-container');
      if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.id = 'video-iframe-container';
        placeholder.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%;';
        wrapper.appendChild(placeholder);
      } else {
        placeholder.style.display = 'block';
      }

      ytPlayer = new YT.Player('video-iframe-container', {
        videoId: data.video.youtubeVideoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          cc_load_policy: 1,
          hl: code,
          cc_lang_pref: code
        },
        events: {
          'onReady': (event) => {
             try {
               event.target.loadModule('captions');
               event.target.setOption('captions', 'track', { languageCode: code });
             } catch(e) {}
          }
        }
      });
      
      loader.style.display = 'none';
      const defaultTitle = currentChapterData.chapterName + ' — ' + SUBJECT;
      titleEl.textContent = data.video.title || defaultTitle;
      titleEl.removeAttribute('data-i18n'); // Use actual video title or translated string

      let meta = '';
      if (data.video.viewCount) meta += '<span>👁️ ' + Number(data.video.viewCount).toLocaleString() + ' views</span>';
      if (data.video.likeCount) meta += '<span>👍 ' + Number(data.video.likeCount).toLocaleString() + ' likes</span>';
      if (data.cached) meta += '<span>⚡ Cached</span>';
      metaEl.innerHTML = meta;

      if (!instantSwitch) {
        showQuiz();
      }
    } catch (e) {
      titleEl.textContent = 'Error loading video';
      loader.innerHTML = '<p class="no-data-msg error-msg">Could not load video.</p>';
    }
  }

  // ── Quiz ───────────────────────────────────
  async function showQuiz() {
    const section = document.getElementById('quiz-section');
    const body = document.getElementById('quiz-body');
    const actions = document.getElementById('quiz-actions');
    const result = document.getElementById('quiz-result');
    const retake = document.getElementById('quiz-retake-btn');
    const submit = document.getElementById('quiz-submit-btn');

    let pool = currentChapterData.quizQuestions;
    if (!pool || pool.length === 0) {
      pool = (window.QUIZ_DATA && window.QUIZ_DATA[SUBJECT]) ? window.QUIZ_DATA[SUBJECT] : (window.QUIZ_DATA ? window.QUIZ_DATA['General'] : []);
    }
    if (!pool || pool.length === 0) return;

    section.style.display = '';
    result.style.display = 'none';
    retake.style.display = 'none';
    actions.style.display = 'none';

    // Pick random 10 questions (or less if pool is smaller)
    let shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);

    body.innerHTML = '<div class="loader-spinner" style="margin: 0 auto;"></div><p style="text-align:center; margin-top:1rem; color:var(--text-secondary);" data-i18n="Translating quiz...">Translating quiz...</p>';

    // Translate questions if language is not English
    if (LANGUAGE !== 'English' && LANGUAGE !== 'en') {
      const textsToTranslate = [];
      shuffled.forEach(q => {
        if (!textsToTranslate.includes(q.question)) textsToTranslate.push(q.question);
        q.options.forEach(opt => {
          if (!textsToTranslate.includes(opt)) textsToTranslate.push(opt);
        });
      });

      if (textsToTranslate.length > 0) {
        try {
          const res = await fetch('/translate-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: textsToTranslate, targetLang: LANGUAGE })
          });
          const translations = await res.json();
          
          shuffled = shuffled.map(q => ({
            ...q,
            question: translations[q.question] || q.question,
            options: q.options.map(opt => translations[opt] || opt)
          }));
        } catch (e) {
          console.error("Quiz translation failed", e);
        }
      }
    }

    actions.style.display = '';
    body.innerHTML = '';
    shuffled.forEach((q, qi) => {
      const div = document.createElement('div');
      div.className = 'quiz-question';
      div.dataset.answer = q.answer !== undefined ? q.answer : q.correctAnswer;
      let html = '<p>' + (qi+1) + '. <span>' + q.question + '</span></p>';
      q.options.forEach((opt, oi) => {
        html += '<label class="quiz-option"><input type="radio" name="q' + qi + '" value="' + oi + '"> <span>' + opt + '</span></label>';
      });
      div.innerHTML = html;
      body.appendChild(div);
    });

    submit.onclick = () => {
      let score = 0;
      const questions = body.querySelectorAll('.quiz-question');
      questions.forEach((qDiv) => {
        const correct = parseInt(qDiv.dataset.answer);
        const selected = qDiv.querySelector('input:checked');
        const opts = qDiv.querySelectorAll('.quiz-option');
        if (opts[correct]) opts[correct].classList.add('correct');
        if (selected) {
          const val = parseInt(selected.value);
          if (val === correct) { score++; }
          else { if (opts[val]) opts[val].classList.add('wrong'); }
        }
        qDiv.querySelectorAll('input').forEach(inp => inp.disabled = true);
      });
      actions.style.display = 'none';
      result.style.display = '';
      result.textContent = (window.t ? window.t('Score') : 'Score') + ': ' + score + ' / ' + questions.length;
      result.className = 'quiz-result ' + (score >= (questions.length * 0.8) ? 'good' : score >= (questions.length * 0.4) ? 'ok' : 'bad');
      retake.style.display = '';
    };

    retake.onclick = showQuiz;
  }


  // ── Helpers ───────────────────────────────
  function hideAllSections() {
    chaptersSection.style.display = 'none';
    videoSection.style.display = 'none';
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
      ytPlayer.stopVideo();
    }
  }

  document.addEventListener('languageChanged', (e) => {
    const newLang = e.detail;
    LANGUAGE = newLang;

    // Update YT Captions seamlessly without reload
    if (ytPlayer && typeof ytPlayer.setOption === 'function') {
      const langCodes = { 'English':'en', 'Hindi':'hi', 'Telugu':'te', 'Tamil':'ta', 'Kannada':'kn', 'Malayalam':'ml' };
      const code = langCodes[newLang] || 'en';
      try {
        ytPlayer.setOption('captions', 'track', { languageCode: code });
      } catch(err) {
        console.warn('Captions update failed', err);
      }
    }

    // Always re-render dynamically generated elements like chapters and quiz
    if (chaptersSection.style.display !== 'none' || !window.chaptersInitiallyLoaded) {
      window.chaptersInitiallyLoaded = true;
      showChapters();
    }
  });

  // ── Back Buttons ──────────────────────────
  document.getElementById('back-from-video').addEventListener('click', showChapters);

  // ── Init ───────────────────────────────────
  // showChapters() is intentionally not called here anymore.
  // It waits for 'languageChanged' event from i18n.js to ensure window.t is fully ready before caching translations!
})();
