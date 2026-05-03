/* ════════════════════════════════════════════════
   EduStreamix — Client-Side Study Page Logic
   ════════════════════════════════════════════════ */
(function () {
  'use strict';

  const GRADE = window.__GRADE__;
  const BOARD = window.__BOARD__;
  const SUBJECT = window.__SUBJECT__;
  let currentChapterData = null;

  // DOM
  const chaptersSection = document.getElementById('chapters-section');
  const chaptersList = document.getElementById('chapters-list');
  
  const modeSection = document.getElementById('mode-section');
  const modeTitle = document.getElementById('mode-chapter-title');
  const btnTextbookMode = document.getElementById('btn-textbook-mode');
  const btnVideoMode = document.getElementById('btn-video-mode');
  
  const textbookSection = document.getElementById('textbook-section');
  const textbookTitle = document.getElementById('textbook-title');
  const textbookContent = document.getElementById('textbook-content');

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
            <th colspan="3">${unitName}</th>
          </tr>
          <tr class="col-headers-row">
            <th>Lesson No.</th>
            <th>Chapter Title</th>
            <th>Type</th>
          </tr>
        `;
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        chaps.forEach(ch => {
          const tr = document.createElement('tr');
          tr.className = 'chapter-row';
          tr.addEventListener('click', () => {
            currentChapterData = ch;
            showModeSelection();
          });
          
          tr.innerHTML = `
            <td class="col-lesson">${ch.lessonNo || '-'}</td>
            <td class="col-title">${ch.chapterName || '-'}</td>
            <td class="col-type">${ch.type || '-'}</td>
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

  // ── Mode Selection ────────────────────────
  function showModeSelection() {
    hideAllSections();
    modeSection.style.display = '';
    modeTitle.textContent = currentChapterData.chapterName;
  }

  btnTextbookMode.addEventListener('click', showTextbookMode);
  btnVideoMode.addEventListener('click', showVideoMode);

  // ── Textbook Mode ─────────────────────────
  function showTextbookMode() {
    hideAllSections();
    textbookSection.style.display = '';
    textbookTitle.textContent = currentChapterData.chapterName;
    textbookContent.innerHTML = '';

    const parts = currentChapterData.textbookContent || [];
    if (parts.length === 0) {
      textbookContent.innerHTML = '<p class="no-data-msg">No textbook content available.</p>';
      return;
    }

    parts.forEach(part => {
      const partDiv = document.createElement('div');
      partDiv.className = 'textbook-part';
      partDiv.innerHTML = `
        <h3>${part.title}</h3>
        <p>${part.content}</p>
      `;
      textbookContent.appendChild(partDiv);
    });
  }

  // ── Video Mode ────────────────────────────
  async function showVideoMode() {
    hideAllSections();
    videoSection.style.display = '';

    const titleEl = document.getElementById('video-title');
    const metaEl = document.getElementById('video-meta');
    const loader = document.getElementById('video-loader');
    const iframe = document.getElementById('video-iframe');

    loader.style.display = 'flex';
    iframe.style.display = 'none';
    iframe.src = '';
    titleEl.textContent = 'Loading video...';
    metaEl.innerHTML = '';

    // Reset components
    document.getElementById('key-moments').style.display = 'none';
    document.getElementById('ai-summary').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('chatbot-section').style.display = 'none';

    try {
      const params = new URLSearchParams({
        chapter: currentChapterData.chapterName, grade: GRADE, language: 'English', board: BOARD, subject: SUBJECT
      });
      const res = await fetch('/api/video?' + params.toString());
      const data = await res.json();

      if (!data.video) {
        titleEl.textContent = 'No video found';
        loader.innerHTML = '<p class="no-data-msg error-msg">No video found for this topic.</p>';
        return;
      }
      
      const baseUrl = new URL(data.video.embedUrl);
      baseUrl.searchParams.set('enablejsapi', '1');
      baseUrl.searchParams.set('rel', '0');
      
      iframe.src = baseUrl.toString();
      iframe.dataset.baseUrl = baseUrl.toString();
      iframe.style.display = 'block';
      loader.style.display = 'none';
      titleEl.textContent = data.video.title || (currentChapterData.chapterName + ' — ' + SUBJECT);

      let meta = '';
      if (data.video.viewCount) meta += '<span>👁️ ' + Number(data.video.viewCount).toLocaleString() + ' views</span>';
      if (data.video.likeCount) meta += '<span>👍 ' + Number(data.video.likeCount).toLocaleString() + ' likes</span>';
      if (data.cached) meta += '<span>⚡ Cached</span>';
      metaEl.innerHTML = meta;

      showKeyMoments();
      showAISummary();
      showQuiz();
      showChatbot();
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
        
        const iframe = document.getElementById('video-iframe');
        const url = new URL(iframe.dataset.baseUrl);
        url.searchParams.set('start', seconds);
        url.searchParams.set('autoplay', '1');
        iframe.src = url.toString();
      };
      momentsList.appendChild(btn);
    });
  }

  // ── AI Summary ────────────────────────────
  function showAISummary() {
    const box = document.getElementById('ai-summary');
    const content = document.getElementById('ai-summary-content');
    box.style.display = '';

    const fullText = currentChapterData.summary || 'Summary for ' + currentChapterData.chapterName + ' is not available.';

    content.innerHTML = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'ai-typing-cursor';

    function type() {
      if (i < fullText.length) {
        let char = fullText.charAt(i);
        if (char === '\\n') {
          content.appendChild(document.createElement('br'));
        } else {
          content.appendChild(document.createTextNode(char));
        }
        content.appendChild(cursor);
        i++;
        setTimeout(type, 10);
      } else {
        cursor.remove();
        // Convert plain newlines to breaks
        content.innerHTML = fullText.replace(/\\n/g, '<br>');
      }
    }
    type();
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
      let html = '<p>' + (qi+1) + '. ' + q.question + '</p>';
      q.options.forEach((opt, oi) => {
        html += '<label class="quiz-option"><input type="radio" name="q' + qi + '" value="' + oi + '"> ' + opt + '</label>';
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

  // ── AI Chatbot ────────────────────────────
  function showChatbot() {
    const section = document.getElementById('chatbot-section');
    const messages = document.getElementById('chatbot-messages');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send-btn');
    
    section.style.display = '';
    messages.innerHTML = '<div class="chat-msg bot-msg">Hello! I am your AI Teacher. Ask me any doubts about "' + currentChapterData.chapterName + '"!</div>';
    
    sendBtn.onclick = () => {
      const text = input.value.trim();
      if (!text) return;
      
      messages.innerHTML += '<div class="chat-msg user-msg">' + text + '</div>';
      input.value = '';
      messages.scrollTop = messages.scrollHeight;
      
      setTimeout(() => {
        messages.innerHTML += '<div class="chat-msg bot-msg">That is a great question about ' + currentChapterData.chapterName + '! The concepts in this chapter show that understanding the fundamentals is key. Let me give you an example...</div>';
        messages.scrollTop = messages.scrollHeight;
      }, 1000);
    };

    input.onkeypress = (e) => {
      if (e.key === 'Enter') sendBtn.click();
    };
  }

  // ── Helpers ───────────────────────────────
  function hideAllSections() {
    chaptersSection.style.display = 'none';
    modeSection.style.display = 'none';
    textbookSection.style.display = 'none';
    videoSection.style.display = 'none';
    const iframe = document.getElementById('video-iframe');
    if (iframe) iframe.src = '';
  }

  // ── Back Buttons ──────────────────────────
  document.getElementById('back-from-mode').addEventListener('click', showChapters);
  document.getElementById('back-from-textbook').addEventListener('click', showModeSelection);
  document.getElementById('back-from-video').addEventListener('click', showModeSelection);

  // ── Init ───────────────────────────────────
  showChapters();
})();
