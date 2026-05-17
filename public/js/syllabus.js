/* ──────────────────────────────────────────────
   Syllabus Browser — Client-side Logic (Unified Dashboard)
   ────────────────────────────────────────────── */
(function () {
  'use strict';

  // ── State ─────────────────────────────────
  let allClassData = null;
  let searchTimeout = null;
  let activeSubjectData = null;

  // ── DOM refs ──────────────────────────────
  const $hero       = document.getElementById('heroSection');
  const $class9Btn  = document.getElementById('class9Btn');
  const $dash       = document.getElementById('dashboardSection');
  const $dashBack   = document.getElementById('dashBackBtn');
  const $sidebar    = document.getElementById('dashSidebar');
  const $dashTitle  = document.getElementById('dashSubjectTitle');
  
  const $unitsList  = document.getElementById('unitsList');
  const $loader     = document.getElementById('loader');
  
  const $search     = document.getElementById('globalSearch');
  const $searchRes  = document.getElementById('searchResults');
  const $searchList = document.getElementById('searchList');
  const $clearSrch  = document.getElementById('clearSearch');
  
  const $modal      = document.getElementById('videoModal');
  const $modalClose = document.getElementById('modalClose');
  const $modalTitle = document.getElementById('modalTitle');
  const $modalPlayer= document.getElementById('modalPlayer');
  const $modalExt   = document.getElementById('modalExtLink');

  // ── Subject icon/color map ────────────────
  const SUBJECT_META = {
    'mathematics':      { icon: '📐', gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
    'physics':          { icon: '⚛️', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)' },
    'biology':          { icon: '🧬', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
    'biological science': { icon: '🧬', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
    'social studies':   { icon: '🌍', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
    'social science':   { icon: '🌍', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
    'english':          { icon: '📖', gradient: 'linear-gradient(135deg,#fa709a,#fee140)' },
    'hindi':            { icon: '📝', gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)' },
    'history and civics': { icon: '🏛️', gradient: 'linear-gradient(135deg,#a88beb,#f8ceec)' },
    'geography':        { icon: '🏔️', gradient: 'linear-gradient(135deg,#13f1fc,#0470dc)' },
    'telugu':           { icon: '📜', gradient: 'linear-gradient(135deg,#fccb90,#d57eeb)' },
    'science':          { icon: '🔬', gradient: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)' },
    'chemistry':        { icon: '🧪', gradient: 'linear-gradient(135deg,#ffecd2,#fcb69f)' },
    'default':          { icon: '📚', gradient: 'linear-gradient(135deg,#89f7fe,#66a6ff)' }
  };

  function getMeta(subject) {
    return SUBJECT_META[(subject||'').toLowerCase()] || SUBJECT_META['default'];
  }

  // ── YouTube URL helpers ───────────────────
  function toEmbedUrl(url) {
    if (!url) return null;
    url = url.trim();
    if (url.includes('/embed/')) return url;
    let m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (m) return 'https://www.youtube.com/embed/' + m[1];
    m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (m) return 'https://www.youtube.com/embed/' + m[1];
    m = url.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/);
    if (m) return 'https://www.youtube.com/embed/' + m[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return 'https://www.youtube.com/embed/' + url;
    return url;
  }

  function toWatchUrl(url) {
    if (!url) return '#';
    const embed = toEmbedUrl(url);
    const m = embed.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) return 'https://www.youtube.com/watch?v=' + m[1];
    return url;
  }

  function isYouTubeUrl(url) {
    if (!url) return false;
    return /youtube\.com|youtu\.be/.test(url) || /^[a-zA-Z0-9_-]{11}$/.test(url.trim());
  }

  // ── Normalize subject data ────────────────
  function normalizeUnits(units) {
    if (!units || !units.length) return [];
    if (units[0].chapters && Array.isArray(units[0].chapters)) {
      return units;
    }
    return [{
      unit: 'All Chapters',
      chapters: units.map(item => ({
        name: item.name || item.unit || 'Untitled',
        url: item.url || ''
      }))
    }];
  }

  // ── Load unified class 9 data ─────────────
  async function loadData() {
    showLoader();
    try {
      const res = await axios.get('/api/syllabus/9/all');
      allClassData = res.data.boards || { CBSE: [], SSC: [], ICSE: [] };
    } catch (err) {
      console.error(err);
      $hero.innerHTML += '<p class="sy-error">⚠️ Could not load syllabus data.</p>';
    }
    hideLoader();
  }

  // ── Navigation Logic ──────────────────────
  $class9Btn.addEventListener('click', () => {
    if (!allClassData) return;
    $hero.style.display = 'none';
    $dash.style.display = 'block';
    renderSidebar();
    
    // Auto-select first subject of first board if available
    const firstBoard = allClassData.CBSE && allClassData.CBSE.length > 0 ? 'CBSE' : 
                       (allClassData.SSC && allClassData.SSC.length > 0 ? 'SSC' : null);
    if (firstBoard) {
        showSubjectContent(allClassData[firstBoard][0], firstBoard);
    }
  });

  $dashBack.addEventListener('click', () => {
    $dash.style.display = 'none';
    $hero.style.display = 'block';
  });

  // ── Render Sidebar ────────────────────────
  function renderSidebar() {
    $sidebar.innerHTML = '';
    const boards = ['CBSE', 'SSC', 'ICSE'];
    
    boards.forEach(board => {
      const subjects = allClassData[board];
      if (!subjects || !subjects.length) return;

      const boardSection = document.createElement('div');
      boardSection.className = 'sidebar-board-group';
      boardSection.innerHTML = `<h3 class="sidebar-board-title">${board}</h3>`;
      
      const list = document.createElement('ul');
      list.className = 'sidebar-subject-list';

      subjects.forEach(doc => {
        const li = document.createElement('li');
        li.className = 'sidebar-subject-item';
        const meta = getMeta(doc.subject);
        li.innerHTML = `<span class="sb-icon">${meta.icon}</span> <span class="sb-name">${escHtml(doc.subject)}</span>`;
        
        li.addEventListener('click', () => {
          document.querySelectorAll('.sidebar-subject-item').forEach(el => el.classList.remove('active'));
          li.classList.add('active');
          showSubjectContent(doc, board);
        });

        list.appendChild(li);
      });

      boardSection.appendChild(list);
      $sidebar.appendChild(boardSection);
    });
  }

  // ── Show Subject Content ──────────────────
  function showSubjectContent(doc, board) {
    activeSubjectData = doc;
    const meta = getMeta(doc.subject);
    $dashTitle.innerHTML = `<span class="detail-icon">${meta.icon}</span> ${escHtml(doc.subject)} <span class="dash-board-badge">${board}</span>`;
    
    const nu = doc._normalizedUnits || normalizeUnits(doc.units);
    doc._normalizedUnits = nu; // cache it
    renderUnits(nu);
    $unitsList.scrollTop = 0;
  }

  // ── Render units accordion ────────────────
  function renderUnits(units) {
    $unitsList.innerHTML = '';
    if (!units.length) {
      $unitsList.innerHTML = '<p class="sy-empty">No units available.</p>';
      return;
    }
    units.forEach((unit, ui) => {
      const acc = document.createElement('div');
      acc.className = 'unit-accordion';

      const header = document.createElement('button');
      header.className = 'unit-header';
      header.innerHTML =
        '<span class="unit-label">📂 ' + escHtml(unit.unit) + '</span>' +
        '<span class="unit-count">' + (unit.chapters ? unit.chapters.length : 0) + ' chapters</span>' +
        '<svg class="unit-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';

      const body = document.createElement('div');
      body.className = 'unit-body';

      (unit.chapters || []).forEach((ch, ci) => {
        const item = document.createElement('div');
        item.className = 'chapter-item';
        const hasUrl = ch.url && ch.url.trim();
        item.innerHTML =
          '<span class="ch-num">' + (ci + 1) + '</span>' +
          '<span class="ch-name">' + escHtml(ch.name) + '</span>' +
          (hasUrl
            ? '<button class="ch-play" data-url="' + escAttr(ch.url) + '" data-name="' + escAttr(ch.name) + '" title="Play video">' +
              (isYouTubeUrl(ch.url) ? '▶' : '🔗') +
              '</button>'
            : '<span class="ch-no-link">—</span>');
        item.addEventListener('click', () => {
          if (hasUrl) openChapter(ch.name, ch.url);
        });
        body.appendChild(item);
      });

      header.addEventListener('click', () => {
        acc.classList.toggle('open');
      });

      if (ui === 0) acc.classList.add('open');

      acc.appendChild(header);
      acc.appendChild(body);
      $unitsList.appendChild(acc);
    });
  }

  // ── Open chapter link / video ─────────────
  function openChapter(name, url) {
    if (isYouTubeUrl(url)) {
      $modalTitle.textContent = name;
      $modalPlayer.innerHTML = '<iframe src="' + toEmbedUrl(url) + '?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      $modalExt.href = toWatchUrl(url);
      $modalExt.style.display = '';
      $modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      window.open(url, '_blank', 'noopener');
    }
  }

  // ── Close modal ───────────────────────────
  function closeModal() {
    $modal.classList.remove('open');
    $modalPlayer.innerHTML = '';
    document.body.style.overflow = '';
  }
  $modalClose.addEventListener('click', closeModal);
  $modal.addEventListener('click', (e) => {
    if (e.target === $modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ── Search ────────────────────────────────
  $search.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const q = $search.value.trim();
    if (!q) { hideSearch(); return; }
    searchTimeout = setTimeout(() => doSearch(q), 350);
  });

  async function doSearch(q) {
    // Currently search relies on board parameter, we will just search across both by doing 2 API calls, or just search the local data!
    // Since we have allClassData locally, let's just filter it locally! It's much faster.
    const results = [];
    const regex = new RegExp(q, 'i');
    
    ['CBSE', 'SSC', 'ICSE'].forEach(board => {
        const subjects = allClassData[board] || [];
        subjects.forEach(doc => {
            const nu = doc._normalizedUnits || normalizeUnits(doc.units);
            nu.forEach(unit => {
                (unit.chapters || []).forEach(ch => {
                    if (regex.test(ch.name) || regex.test(unit.unit) || regex.test(doc.subject)) {
                        results.push({
                            board: board,
                            subject: doc.subject,
                            unit: unit.unit,
                            chapter: ch.name,
                            url: ch.url
                        });
                    }
                });
            });
        });
    });
    
    renderSearchResults(results, q);
  }

  function renderSearchResults(results, q) {
    $searchList.innerHTML = '';
    if (!results.length) {
      $searchList.innerHTML = '<p class="sy-empty">No results for "' + escHtml(q) + '"</p>';
    } else {
      results.forEach(r => {
        const div = document.createElement('div');
        div.className = 'sr-item';
        const hasUrl = r.url && r.url.trim();
        div.innerHTML =
          '<div class="sr-meta">' +
            '<span class="dash-board-badge" style="font-size:0.7em; margin-right:5px">' + r.board + '</span>' +
            '<span class="sr-subject">' + escHtml(r.subject) + '</span>' +
            '<span class="sr-unit">' + escHtml(r.unit) + '</span>' +
          '</div>' +
          '<div class="sr-chapter">' + escHtml(r.chapter) + '</div>' +
          (hasUrl ? '<button class="ch-play" title="Play">' + (isYouTubeUrl(r.url) ? '▶' : '🔗') + '</button>' : '');
        if (hasUrl) {
          div.addEventListener('click', () => openChapter(r.chapter, r.url));
          div.style.cursor = 'pointer';
        }
        $searchList.appendChild(div);
      });
    }
    
    if ($hero.style.display !== 'none' || $dash.style.display !== 'none') {
        $hero.style.display = 'none';
        $dash.style.display = 'none';
    }
    $searchRes.style.display = '';
  }

  function hideSearch() {
    $searchRes.style.display = 'none';
    $search.value = '';
    
    // Return to previous state
    if (activeSubjectData) {
        $dash.style.display = 'block';
    } else {
        $hero.style.display = 'block';
    }
  }
  $clearSrch.addEventListener('click', hideSearch);

  // ── Helpers ───────────────────────────────
  function showLoader() { $loader.style.display = ''; }
  function hideLoader() { $loader.style.display = 'none'; }
  function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function escAttr(s) { return (s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

  // ── Scroll navbar effect ──────────────────
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('sy-nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── Init ──────────────────────────────────
  loadData();
})();
