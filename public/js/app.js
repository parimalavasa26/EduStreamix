/* ════════════════════════════════════════════════
   EduStreamix — Client-Side Study Page Logic
   ════════════════════════════════════════════════ */
(function () {
  'use strict';

  const GRADE = window.__GRADE__;
  const BOARD = window.__BOARD__;
  const SUBJECT = window.__SUBJECT__;
  const DISPLAY_SUBJECT = window.__DISPLAY_SUBJECT__ || SUBJECT;
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

  async function getFinalChapters(grade, board, subject, selectedLanguage) {
    const cacheKey = `chapters_v4_${selectedLanguage}_${grade}_${board}_${subject}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try { return JSON.parse(cached); } catch(e) {}
    }
    
    const params = new URLSearchParams({ grade, board, subject, lang: selectedLanguage });
    const res = await fetch('/api/chapters?' + params.toString());
    const data = await res.json();
    
    if (data.chapters) {
      sessionStorage.setItem(cacheKey, JSON.stringify(data.chapters));
      return data.chapters;
    }
    return [];
  }

  // ── Load Chapters on Init ─────────────────
  async function showChapters() {
    hideAllSections();
    chaptersSection.style.display = '';
    chaptersList.innerHTML = `
      <div class="loader-spinner" style="margin: 0 auto;"></div>
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
        const colspan = 2;

        thead.innerHTML = `
          <tr class="unit-title-row">
            <th colspan="${colspan}">${unitNameLabel}</th>
          </tr>
          <tr class="col-headers-row">
            <th>${lessonNoLabel}</th>
            <th>${chapterTitleLabel}</th>
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
      let videoData = null;
      let cachedFlag = false;

      // Use the direct link from the database if available
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
          // If it's not a YouTube video, just open it in a new tab and return
          window.open(currentChapterData.link, '_blank');
          hideAllSections();
          chaptersSection.style.display = '';
          return;
        }
      }

      // Fallback to /api/video if no direct link
      if (!videoData) {
        const params = new URLSearchParams({
          chapter: currentChapterData.originalChapterName || currentChapterData.chapterName, 
          grade: GRADE, 
          language: selectedLanguage, 
          board: BOARD, 
          subject: SUBJECT
        });
        const res = await fetch('/api/video?' + params.toString());
        const data = await res.json();

        if (!data.video) {
          titleEl.textContent = 'No video found';
          loader.innerHTML = '<p class="no-data-msg error-msg">No video found for this topic.</p>';
          return;
        }
        videoData = data.video;
        cachedFlag = data.cached;
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
        videoId: videoData.youtubeVideoId,
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
      const defaultTitle = currentChapterData.chapterName + ' — ' + DISPLAY_SUBJECT;
      titleEl.textContent = videoData.title || defaultTitle;
      titleEl.removeAttribute('data-i18n'); // Use actual video title or translated string

      let meta = '';
      if (videoData.viewCount) meta += '<span>👁️ ' + Number(videoData.viewCount).toLocaleString() + ' views</span>';
      if (videoData.likeCount) meta += '<span>👍 ' + Number(videoData.likeCount).toLocaleString() + ' likes</span>';
      if (cachedFlag) meta += '<span>⚡ Cached</span>';
      metaEl.innerHTML = meta;

      if (!instantSwitch) {
        showQuiz();
      }
    } catch (e) {
      titleEl.textContent = 'Error loading video';
      loader.innerHTML = '<p class="no-data-msg error-msg">Could not load video.</p>';
    }
  }

  // ── AI Quiz ───────────────────────────────
  let aiQuizQuestions = [];
  let quizElapsedTimer = null;
  let quizElapsedSec = 0;

  function showQuiz() {
    const section = document.getElementById('quiz-section');
    if (section) section.style.display = '';
    // Reset state
    resetQuizUI();
  }

  function resetQuizUI() {
    const body    = document.getElementById('quiz-body');
    const actions = document.getElementById('quiz-actions');
    const result  = document.getElementById('quiz-result');
    const retake  = document.getElementById('quiz-retake-btn');
    const timerBar = document.getElementById('quiz-timer-bar');
    const genBar  = document.getElementById('quiz-gen-bar');
    if (body)    body.innerHTML = '<p style="padding:1.5rem;color:var(--text-muted);font-size:.9rem;">Pick a question count and click <strong>Generate Quiz</strong> to get AI-made questions for this chapter.</p>';
    if (actions) actions.style.display = 'none';
    if (result)  { result.style.display = 'none'; result.textContent = ''; }
    if (retake)  retake.style.display = 'none';
    if (timerBar) timerBar.style.display = 'none';
    if (genBar)  genBar.style.display = '';
    aiQuizQuestions = [];
    stopElapsedTimer();
  }

  function stopElapsedTimer() {
    if (quizElapsedTimer) { clearInterval(quizElapsedTimer); quizElapsedTimer = null; }
    quizElapsedSec = 0;
  }

  function startElapsedTimer() {
    stopElapsedTimer();
    quizElapsedSec = 0;
    const el = document.getElementById('quiz-elapsed-val');
    quizElapsedTimer = setInterval(() => {
      quizElapsedSec++;
      const m = Math.floor(quizElapsedSec / 60);
      const s = quizElapsedSec % 60;
      if (el) el.textContent = m + ':' + String(s).padStart(2, '0');
    }, 1000);
  }

  function fmtSec(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  }

  async function generateAIQuiz() {
    if (!currentChapterData) return;
    const btn    = document.getElementById('quiz-generate-btn');
    const body   = document.getElementById('quiz-body');
    const genBar = document.getElementById('quiz-gen-bar');
    const numQ   = parseInt(document.getElementById('quiz-count-sel').value) || 10;
    const actions = document.getElementById('quiz-actions');
    const result  = document.getElementById('quiz-result');
    const retake  = document.getElementById('quiz-retake-btn');
    const timerBar = document.getElementById('quiz-timer-bar');
    const timerVal = document.getElementById('quiz-timer-val');

    // Reset
    if (actions) actions.style.display = 'none';
    if (result)  { result.style.display = 'none'; result.textContent = ''; }
    if (retake)  retake.style.display = 'none';
    if (timerBar) timerBar.style.display = 'none';

    btn.disabled = true;
    btn.textContent = '⏳ Generating...';

    body.innerHTML = `
      <div class="quiz-loading">
        <div class="quiz-loading-spinner"></div>
        <p>Generating ${numQ} AI questions for <strong>${currentChapterData.chapterName}</strong>...</p>
        <p style="font-size:.8rem;color:var(--text-muted);">Powered by Gemini AI ✨</p>
      </div>`;

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board:        BOARD,
          grade:        GRADE,
          subject:      SUBJECT,
          focusTopic:   currentChapterData.chapterName,
          difficulty:   'medium',
          numQuestions: numQ
        })
      });

      const data = await res.json();
      if (!res.ok || !data.questions || !data.questions.length) {
        body.innerHTML = `<p style="padding:1.5rem;color:#e53e3e;">⚠️ ${data.error || 'Could not generate quiz. Please try again.'}</p>`;
        btn.disabled = false;
        btn.textContent = '🤖 Generate Quiz';
        return;
      }

      aiQuizQuestions = data.questions;

      // Handle Fallback/Demo message
      if (data.isFallback) {
        const msg = document.createElement('div');
        msg.style.cssText = 'background:rgba(245,158,11,0.1); border:1px solid #f59e0b; border-radius:10px; padding:.8rem; margin:1rem; font-size:.85rem; color:#b45309; text-align:center;';
        msg.innerHTML = `✨ <strong>Demo Mode:</strong> Using sample questions because the AI service is ${data.errorInfo || 'offline'}.`;
        body.parentElement.insertBefore(msg, body);
        setTimeout(() => msg.remove(), 8000); // Auto-remove after 8s
      }

      // Show timer
      if (timerBar && timerVal) {
        timerBar.style.display = '';
        timerVal.textContent = fmtSec(data.avgTimeSeconds || numQ * 60);
      }

      // Render questions
      renderAIQuiz(aiQuizQuestions);

      startElapsedTimer();

      btn.textContent = '🔄 Regenerate';
      btn.disabled = false;

    } catch (err) {
      body.innerHTML = `<p style="padding:1.5rem;color:#e53e3e;">❌ Network error. Check your connection.</p>`;
      btn.disabled = false;
      btn.textContent = '🤖 Generate Quiz';
    }
  }

  function renderAIQuiz(questions) {
    const body    = document.getElementById('quiz-body');
    const actions = document.getElementById('quiz-actions');
    const submit  = document.getElementById('quiz-submit-btn');
    const result  = document.getElementById('quiz-result');
    const retake  = document.getElementById('quiz-retake-btn');
    const genBar  = document.getElementById('quiz-gen-bar');

    if (genBar) genBar.style.display = 'none';

    body.innerHTML = '';
    questions.forEach((q, qi) => {
      const div = document.createElement('div');
      div.className = 'quiz-question';
      div.dataset.correct = q.correctAnswerIndex;
      div.dataset.explanation = q.explanation || '';

      let html = `<p>${qi + 1}. <span>${q.question}</span></p>`;
      q.options.forEach((opt, oi) => {
        const letter = ['A','B','C','D'][oi];
        html += `<label class="quiz-option"><input type="radio" name="q${qi}" value="${oi}"> <span>${letter}. ${opt}</span></label>`;
      });
      html += `<div class="quiz-explanation" id="explanation-${qi}">💡 ${q.explanation || ''}</div>`;
      div.innerHTML = html;
      body.appendChild(div);
    });

    if (actions) actions.style.display = '';

    submit.onclick = () => {
      stopElapsedTimer();
      let score = 0;
      const qDivs = body.querySelectorAll('.quiz-question');
      qDivs.forEach((qDiv) => {
        const correct = parseInt(qDiv.dataset.correct);
        const selected = qDiv.querySelector('input:checked');
        const opts = qDiv.querySelectorAll('.quiz-option');
        if (opts[correct]) opts[correct].classList.add('correct');
        if (selected) {
          const val = parseInt(selected.value);
          if (val === correct) score++;
          else if (opts[val]) opts[val].classList.add('wrong');
        }
        qDiv.querySelectorAll('input').forEach(inp => inp.disabled = true);
        // Show explanation
        const expEl = qDiv.querySelector('.quiz-explanation');
        if (expEl) expEl.classList.add('show');
      });
      if (actions) actions.style.display = 'none';
      if (result) {
        const pct = score / qDivs.length;
        const emoji = pct >= 0.8 ? '🎉' : pct >= 0.5 ? '👍' : '📖';
        result.style.display = '';
        result.textContent = `${emoji} Score: ${score} / ${qDivs.length}`;
        result.className = 'quiz-result ' + (pct >= 0.8 ? 'good' : pct >= 0.5 ? 'ok' : 'bad');
      }
      if (retake) retake.style.display = '';
    };

    retake.onclick = () => {
      const genBar = document.getElementById('quiz-gen-bar');
      if (genBar) genBar.style.display = '';
      resetQuizUI();
    };
  }

  // Wire up generate button after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const genBtn = document.getElementById('quiz-generate-btn');
    if (genBtn) genBtn.addEventListener('click', generateAIQuiz);
  });


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

    if (ytPlayer && typeof ytPlayer.setOption === 'function') {
      const langCodes = { 'English':'en', 'Hindi':'hi', 'Telugu':'te', 'Tamil':'ta', 'Kannada':'kn', 'Malayalam':'ml' };
      const code = langCodes[newLang] || 'en';
      try {
        ytPlayer.setOption('captions', 'track', { languageCode: code });
      } catch(err) {
        console.warn('Captions update failed', err);
      }
    }

    if (chaptersSection.style.display !== 'none' || !window.chaptersInitiallyLoaded) {
      window.chaptersInitiallyLoaded = true;
      showChapters();
    }
  });

  // ── Back Buttons ──────────────────────────
  document.getElementById('back-from-video').addEventListener('click', showChapters);

  // ── Init ───────────────────────────────────
  // showChapters() is intentionally not called here anymore.
  // It waits for 'languageChanged' event from i18n.js to ensure window.t is fully ready!
})();
