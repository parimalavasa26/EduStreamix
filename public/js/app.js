/* ════════════════════════════════════════════════
   EduStreamix — Client-Side Study Page Logic
   ════════════════════════════════════════════════ */
(function () {
  'use strict';

  const GRADE = window.__GRADE__;
  const BOARD = window.__BOARD__;
  const SUBJECT = window.__SUBJECT__;
  let currentChapter = null;

  // DOM
  const chaptersSection = document.getElementById('chapters-section');
  const chaptersList = document.getElementById('chapters-list');
  const videoSection = document.getElementById('video-section');

  // ── Load Chapters on Init ─────────────────
  async function showChapters() {
    chaptersSection.style.display = '';
    videoSection.style.display = 'none';
    chaptersList.innerHTML = Array(6).fill('<div class="skeleton-item"></div>').join('');
    try {
      const res = await fetch('/api/chapters?grade=' + GRADE + '&board=' + BOARD + '&subject=' + encodeURIComponent(SUBJECT));
      const data = await res.json();
      if (!data.chapters || !data.chapters.length) {
        chaptersList.innerHTML = '<p class="no-data-msg">No chapters found.</p>';
        return;
      }
      chaptersList.innerHTML = '';
      data.chapters.forEach((ch, i) => {
        const btn = document.createElement('button');
        btn.className = 'chapter-btn';
        btn.innerHTML = '<span class="ch-num">' + (i+1) + '</span><span class="ch-name">' + ch.chapterName + '</span><span class="ch-unit">' + (ch.unitName||'') + '</span>';
        btn.addEventListener('click', () => {
          currentChapter = ch.chapterName;
          showVideo();
        });
        chaptersList.appendChild(btn);
      });
    } catch (e) {
      chaptersList.innerHTML = '<p class="no-data-msg error-msg">Error loading chapters.</p>';
    }
  }

  // ── Show Video ─────────────────────────────
  async function showVideo() {
    chaptersSection.style.display = 'none';
    videoSection.style.display = '';

    const titleEl = document.getElementById('video-title');
    const metaEl = document.getElementById('video-meta');
    const loader = document.getElementById('video-loader');
    const iframe = document.getElementById('video-iframe');
    const aiBox = document.getElementById('ai-summary');
    const quizBox = document.getElementById('quiz-section');

    loader.style.display = 'flex';
    iframe.style.display = 'none';
    iframe.src = '';
    titleEl.textContent = 'Finding the best video...';
    metaEl.innerHTML = '';
    aiBox.style.display = 'none';
    quizBox.style.display = 'none';

    try {
      const params = new URLSearchParams({
        chapter: currentChapter, grade: GRADE, language: 'English', board: BOARD, subject: SUBJECT
      });
      const res = await fetch('/api/video?' + params.toString());
      const data = await res.json();

      if (!data.video) {
        titleEl.textContent = 'No video found';
        loader.innerHTML = '<p class="no-data-msg error-msg">No video found for this topic.</p>';
        return;
      }
      iframe.src = data.video.embedUrl;
      iframe.style.display = 'block';
      loader.style.display = 'none';
      titleEl.textContent = data.video.title || (currentChapter + ' — ' + SUBJECT);

      let meta = '';
      if (data.video.viewCount) meta += '<span>👁️ ' + Number(data.video.viewCount).toLocaleString() + ' views</span>';
      if (data.video.likeCount) meta += '<span>👍 ' + Number(data.video.likeCount).toLocaleString() + ' likes</span>';
      if (data.cached) meta += '<span>⚡ Cached</span>';
      metaEl.innerHTML = meta;

      showAISummary();
      showQuiz();
    } catch (e) {
      titleEl.textContent = 'Error loading video';
      loader.innerHTML = '<p class="no-data-msg error-msg">Could not load video.</p>';
    }
  }

  // ── AI Summary (mock) ──────────────────────
  function showAISummary() {
    const box = document.getElementById('ai-summary');
    const content = document.getElementById('ai-summary-content');
    box.style.display = '';

    const summaries = {
      'Mathematics': 'This chapter covers fundamental mathematical concepts including problem-solving techniques, formulas, and their real-world applications. Focus on understanding the underlying logic rather than memorizing steps.',
      'Science': 'This topic explores key scientific principles through observation and experimentation. Understanding cause-and-effect relationships is essential for mastering this chapter.',
      'Social Science': 'This chapter examines important historical, geographical, or civic concepts that shape our understanding of society and governance.',
      'Physics': 'This chapter deals with fundamental physical laws governing motion, energy, and forces. Pay attention to the mathematical relationships between quantities.',
      'Chemistry': 'This topic covers chemical properties, reactions, and molecular structures. Understanding atomic behavior is key to this chapter.',
      'Biology': 'This chapter explores living systems, their structures, and functions. Focus on understanding how different biological processes are interconnected.'
    };

    const summary = summaries[SUBJECT] || 'This chapter covers important concepts in ' + SUBJECT + '. Pay close attention to key definitions, formulas, and real-world applications discussed in the video.';
    const fullText = '📌 Topic: ' + currentChapter + '\n\n' + summary + '\n\n💡 Tip: Take notes while watching and try to solve practice problems immediately after.';

    content.innerHTML = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'ai-typing-cursor';

    function type() {
      if (i < fullText.length) {
        content.textContent = fullText.substring(0, i + 1);
        content.appendChild(cursor);
        i++;
        setTimeout(type, 12);
      } else {
        cursor.remove();
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

    if (typeof window.QUIZ_DATA === 'undefined') { section.style.display = 'none'; return; }

    const pool = window.QUIZ_DATA[SUBJECT] || window.QUIZ_DATA['General'] || [];
    if (pool.length === 0) { section.style.display = 'none'; return; }

    section.style.display = '';
    result.style.display = 'none';
    retake.style.display = 'none';
    actions.style.display = '';

    // Pick 5 random questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);

    body.innerHTML = '';
    shuffled.forEach((q, qi) => {
      const div = document.createElement('div');
      div.className = 'quiz-question';
      div.dataset.answer = q.answer;
      let html = '<p>' + (qi+1) + '. ' + q.question + '</p>';
      q.options.forEach((opt, oi) => {
        html += '<label class="quiz-option"><input type="radio" name="q' + qi + '" value="' + oi + '"> ' + opt + '</label>';
      });
      div.innerHTML = html;
      body.appendChild(div);
    });

    // Submit handler
    const submitHandler = () => {
      let score = 0;
      const questions = body.querySelectorAll('.quiz-question');
      questions.forEach((qDiv, qi) => {
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
      result.className = 'quiz-result ' + (score >= 4 ? 'good' : score >= 2 ? 'ok' : 'bad');
      retake.style.display = '';
    };

    submit.onclick = submitHandler;
    retake.onclick = () => showQuiz();
  }

  // ── Back Button ───────────────────────────
  document.getElementById('back-to-chapters').addEventListener('click', () => {
    videoSection.style.display = 'none';
    document.getElementById('video-iframe').src = '';
    showChapters();
  });

  // ── Init ───────────────────────────────────
  showChapters();
})();
