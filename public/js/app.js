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

  // ── Load Chapters on Init ─────────────────
  async function showChapters() {
    hideAllSections();
    chaptersSection.style.display = '';
    chaptersList.innerHTML = Array(6).fill('<div class="skeleton-item"></div>').join('');
    try {
      const res = await fetch('/api/chapters?grade=' + GRADE + '&board=' + BOARD + '&subject=' + encodeURIComponent(SUBJECT));
      const data = await res.json();
      if (!data.chapters || !data.chapters.length) {
        chaptersList.innerHTML = '<p class="no-data-msg">No chapters found.</p>';
        return;
      }
      chaptersList.innerHTML = '';
      
      const units = {};
      data.chapters.forEach(ch => {
        const u = ch.unitName || 'General';
        if (!units[u]) units[u] = [];
        units[u].push(ch);
      });

      for (const [unitName, chaps] of Object.entries(units)) {
        const table = document.createElement('table');
        table.className = 'chapters-table';
        
        const thead = document.createElement('thead');
        thead.innerHTML = `
          <tr class="unit-title-row">
            <th colspan="3" data-i18n="${unitName}">${window.t ? window.t(unitName) : unitName}</th>
          </tr>
          <tr class="col-headers-row">
            <th data-i18n="Lesson No.">${window.t ? window.t('Lesson No.') : 'Lesson No.'}</th>
            <th data-i18n="Chapter Title">${window.t ? window.t('Chapter Title') : 'Chapter Title'}</th>
            <th data-i18n="Type">${window.t ? window.t('Type') : 'Type'}</th>
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
            <td class="col-lesson" data-i18n="${ch.lessonNo || '-'}">${window.t ? window.t(ch.lessonNo || '-') : (ch.lessonNo || '-')}</td>
            <td class="col-title" data-i18n="${ch.chapterName || '-'}">${window.t ? window.t(ch.chapterName || '-') : (ch.chapterName || '-')}</td>
            <td class="col-type" data-i18n="${ch.type || '-'}">${window.t ? window.t(ch.type || '-') : (ch.type || '-')}</td>
          `;
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        
        chaptersList.appendChild(table);
      }
    } catch (e) {
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
      document.getElementById('key-moments').style.display = 'none';
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
        showKeyMoments();
        showQuiz();
      }
    } catch (e) {
      titleEl.textContent = 'Error loading video';
      loader.innerHTML = '<p class="no-data-msg error-msg">Could not load video.</p>';
    }
  }

  // ── Key Moments ───────────────────────────
  function showKeyMoments() {
    const momentsSection = document.getElementById('key-moments');
    const momentsList = document.getElementById('key-moments-list');
    
    const moments = currentChapterData.keyMoments || [];
    if (moments.length === 0) return;

    momentsSection.style.display = '';
    momentsList.innerHTML = '';

    moments.forEach(m => {
      const btn = document.createElement('button');
      btn.className = 'key-moment-btn';
      btn.innerHTML = `<span class="moment-time">${m.timestamp}</span> <span class="moment-title">${m.title}</span>`;
      
      btn.onclick = () => {
        const parts = m.timestamp.split(':');
        let seconds = 0;
        if (parts.length === 2) seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        else if (parts.length === 3) seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        
        if (ytPlayer && typeof ytPlayer.seekTo === 'function') {
          ytPlayer.seekTo(seconds, true);
          ytPlayer.playVideo();
        }
      };
      momentsList.appendChild(btn);
    });
  }


  // ── Quiz ───────────────────────────────────
  function showQuiz() {
    const section = document.getElementById('quiz-section');
    const body = document.getElementById('quiz-body');
    const actions = document.getElementById('quiz-actions');
    const result = document.getElementById('quiz-result');
    const retake = document.getElementById('quiz-retake-btn');
    const submit = document.getElementById('quiz-submit-btn');

    const pool = currentChapterData.quizQuestions || [];
    if (pool.length === 0) return;

    section.style.display = '';
    result.style.display = 'none';
    retake.style.display = 'none';
    actions.style.display = '';

    // Pick random 10 questions (or less if pool is smaller)
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);

    body.innerHTML = '';
    shuffled.forEach((q, qi) => {
      const div = document.createElement('div');
      div.className = 'quiz-question';
      div.dataset.answer = q.correctAnswer;
      let html = '<p>' + (qi+1) + '. <span data-i18n="' + q.question + '">' + (window.t ? window.t(q.question) : q.question) + '</span></p>';
      q.options.forEach((opt, oi) => {
        html += '<label class="quiz-option"><input type="radio" name="q' + qi + '" value="' + oi + '"> <span data-i18n="' + opt + '">' + (window.t ? window.t(opt) : opt) + '</span></label>';
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
        opts[correct].classList.add('correct');
        if (selected) {
          const val = parseInt(selected.value);
          if (val === correct) { score++; }
          else { opts[val].classList.add('wrong'); }
        }
        qDiv.querySelectorAll('input').forEach(inp => inp.disabled = true);
      });
      actions.style.display = 'none';
      result.style.display = '';
      result.textContent = 'Score: ' + score + ' / ' + questions.length;
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

    // Also re-render dynamically generated elements like chapters and quiz
    if (chaptersSection.style.display !== 'none') {
      showChapters();
    }
    
    // The rest of the UI (quiz questions, static buttons) will automatically be translated 
    // by i18n.js iterating over [data-i18n] on document scope, triggered right before this event.
  });

  // ── Back Buttons ──────────────────────────
  document.getElementById('back-from-video').addEventListener('click', showChapters);

  // ── Init ───────────────────────────────────
  showChapters();
})();
