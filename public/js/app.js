/* ════════════════════════════════════════════════
   EduStreamix — Client-Side Study Page Logic
   ════════════════════════════════════════════════ */
(function () {
  'use strict';

  const GRADE = window.__GRADE__;
  let BOARD = window.__BOARD__;
  let currentSubject = null;
  let currentChapter = null;

  // DOM
  const subjectsSection = document.getElementById('subjects-section');
  const subjectsGrid = document.getElementById('subjects-grid');
  const chaptersSection = document.getElementById('chapters-section');
  const chaptersList = document.getElementById('chapters-list');
  const chaptersTitle = document.getElementById('chapters-title');
  const videoSection = document.getElementById('video-section');

  const SUBJECT_ICONS = {
    'Mathematics':'📐','Science':'🔬','Social Science':'🌍','English':'📖',
    'Hindi':'📝','Physics':'⚡','Chemistry':'🧪','Biology':'🧬',
    'General Science':'🔬','Social Studies':'🌍','Telugu':'📜',
    'Physical Science':'⚡','Biological Science':'🧬'
  };

  // ── Board Tabs ─────────────────────────────
  document.querySelectorAll('.board-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.board-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      BOARD = tab.dataset.board;
      showSubjects();
      chaptersSection.style.display = 'none';
      videoSection.style.display = 'none';
    });
  });

  // ── Show Subjects ──────────────────────────
  async function showSubjects() {
    subjectsSection.style.display = '';
    subjectsGrid.innerHTML = Array(5).fill('<div class="skeleton-card"></div>').join('');
    try {
      const res = await fetch('/api/subjects?grade=' + GRADE + '&board=' + BOARD);
      const data = await res.json();
      if (!data.subjects || !data.subjects.length) {
        subjectsGrid.innerHTML = '<p style="color:var(--accent-3)">No subjects found.</p>';
        return;
      }
      subjectsGrid.innerHTML = '';
      data.subjects.forEach(subj => {
        const card = document.createElement('button');
        card.className = 'subject-card';
        card.innerHTML = '<span class="subject-icon">' + (SUBJECT_ICONS[subj] || '📖') + '</span><span class="subject-name">' + subj + '</span>';
        card.addEventListener('click', () => {
          currentSubject = subj;
          showChapters();
        });
        subjectsGrid.appendChild(card);
      });
    } catch (e) {
      subjectsGrid.innerHTML = '<p style="color:var(--accent-3)">Error loading subjects.</p>';
    }
  }

  // ── Show Chapters ──────────────────────────
  async function showChapters() {
    subjectsSection.style.display = 'none';
    videoSection.style.display = 'none';
    chaptersSection.style.display = '';
    chaptersTitle.textContent = currentSubject + ' — Chapters';
    chaptersList.innerHTML = Array(6).fill('<div class="skeleton-item"></div>').join('');
    try {
      const res = await fetch('/api/chapters?grade=' + GRADE + '&board=' + BOARD + '&subject=' + encodeURIComponent(currentSubject));
      const data = await res.json();
      if (!data.chapters || !data.chapters.length) {
        chaptersList.innerHTML = '<p style="color:var(--accent-3)">No chapters found.</p>';
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
      chaptersList.innerHTML = '<p style="color:var(--accent-3)">Error loading chapters.</p>';
    }
  }

  // ── Show Video ─────────────────────────────
  async function showVideo() {
    chaptersSection.style.display = 'none';
    subjectsSection.style.display = 'none';
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
        chapter: currentChapter, grade: GRADE, language: 'English', board: BOARD, subject: currentSubject
      });
      const res = await fetch('/api/video?' + params.toString());
      const data = await res.json();

      if (!data.video) {
        titleEl.textContent = 'No video found';
        loader.innerHTML = '<p style="color:var(--accent-3)">No video found for this topic.</p>';
        return;
      }
      iframe.src = data.video.embedUrl;
      iframe.style.display = 'block';
      loader.style.display = 'none';
      titleEl.textContent = data.video.title || (currentChapter + ' — ' + currentSubject);

      let meta = '';
      if (data.video.viewCount) meta += '<span>👁️ ' + Number(data.video.viewCount).toLocaleString() + ' views</span>';
      if (data.video.likeCount) meta += '<span>👍 ' + Number(data.video.likeCount).toLocaleString() + ' likes</span>';
      if (data.cached) meta += '<span>⚡ Cached</span>';
      metaEl.innerHTML = meta;

      showAISummary();
      showQuiz();
    } catch (e) {
      titleEl.textContent = 'Error loading video';
      loader.innerHTML = '<p style="color:var(--accent-3)">Could not load video.</p>';
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

    const summary = summaries[currentSubject] || 'This chapter covers important concepts in ' + currentSubject + '. Pay close attention to key definitions, formulas, and real-world applications discussed in the video.';
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

    const pool = window.QUIZ_DATA[currentSubject] || window.QUIZ_DATA['General'] || [];
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

  // ── Back Buttons ───────────────────────────
  document.getElementById('back-to-subjects').addEventListener('click', () => {
    chaptersSection.style.display = 'none';
    videoSection.style.display = 'none';
    subjectsSection.style.display = '';
  });

  document.getElementById('back-to-chapters').addEventListener('click', () => {
    videoSection.style.display = 'none';
    document.getElementById('video-iframe').src = '';
    showChapters();
  });

  // ── Init ───────────────────────────────────
  showSubjects();
})();
