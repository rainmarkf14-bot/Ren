document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Sticky nav: scroll progress + active link ---------------- */
  var progressBar = document.getElementById('scroll-progress');
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  var backToTop = document.getElementById('back-to-top');

  function onScroll() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';

    if (backToTop) backToTop.classList.toggle('show', scrollTop > 600);

    var scrollPos = scrollTop + 140;
    var currentId = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Mobile hamburger menu ---------------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- About tabs ---------------- */
  var tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      var target = document.getElementById('tab-' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* ---------------- Core value cards ---------------- */
  document.querySelectorAll('.value-card').forEach(function (card) {
    function toggle() {
      var open = card.classList.toggle('open');
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ---------------- Pathway (Values -> Learning -> Skills -> Purpose -> Future) ---------------- */
  var pathwaySteps = document.querySelectorAll('.pathway-step');
  var pathwayText = document.getElementById('pathway-text');
  var pathwayCopy = {
    values: "Learners begin by rooting their character in integrity, respect, and responsibility — the foundation for everything that follows.",
    learning: "Classroom and hands-on lessons build academic knowledge through a learner-centered, competency-based curriculum.",
    skills: "Practical, technical, and digital skills are developed through TLE/TVL, technology integration, and applied projects.",
    purpose: "Learners connect what they know and can do to a clear sense of direction and personal purpose.",
    future: "Graduates move forward into higher education, employment, entrepreneurship, technical training, or community life."
  };
  pathwaySteps.forEach(function (step) {
    step.addEventListener('click', function () {
      pathwaySteps.forEach(function (s) { s.classList.remove('active'); });
      step.classList.add('active');
      if (pathwayText) pathwayText.textContent = pathwayCopy[step.dataset.step] || '';
    });
  });

  /* ---------------- Academics expandable cards ---------------- */
  document.querySelectorAll('.acad-card').forEach(function (card) {
    function toggle() { card.classList.toggle('expanded'); }
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ---------------- Learning strategy modal ---------------- */
  var strategyOverlay = document.getElementById('strategy-modal-overlay');
  var strategyTitle = document.getElementById('strategy-modal-title');
  var strategyText = document.getElementById('strategy-modal-text');
  document.querySelectorAll('.strategy-card').forEach(function (card) {
    card.addEventListener('click', function () {
      strategyTitle.textContent = card.dataset.strategy;
      strategyText.textContent = card.dataset.desc;
      strategyOverlay.classList.add('show');
    });
  });
  document.getElementById('strategy-modal-close').addEventListener('click', function () {
    strategyOverlay.classList.remove('show');
  });
  strategyOverlay.addEventListener('click', function (e) {
    if (e.target === strategyOverlay) strategyOverlay.classList.remove('show');
  });

  /* ---------------- Gallery filter (Student Life) ---------------- */
  var filterBtns = document.querySelectorAll('#sl-filters .filter-btn');
  var slItems = document.querySelectorAll('#sl-grid .photo-item');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      slItems.forEach(function (item) {
        item.style.display = (filter === 'all' || item.dataset.cat === filter) ? '' : 'none';
      });
    });
  });

  /* ---------------- Lightbox (shared across all .photo-item galleries) ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var currentGalleryItems = [];
  var currentIndex = 0;

  function openLightbox(items, index) {
    currentGalleryItems = items;
    currentIndex = index;
    showLightboxItem();
    lightbox.classList.add('show');
  }
  function showLightboxItem() {
    var item = currentGalleryItems[currentIndex];
    if (!item) return;
    var img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = item.dataset.caption || img.alt || '';
  }
  function closeLightbox() { lightbox.classList.remove('show'); }

  document.querySelectorAll('.photo-grid').forEach(function (grid) {
    var items = Array.prototype.slice.call(grid.querySelectorAll('.photo-item'));
    items.forEach(function (item, idx) {
      item.addEventListener('click', function () {
        var visibleItems = items.filter(function (i) { return i.style.display !== 'none'; });
        var visIdx = visibleItems.indexOf(item);
        openLightbox(visibleItems, visIdx === -1 ? 0 : visIdx);
      });
    });
  });

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    showLightboxItem();
  });
  document.getElementById('lightbox-next').addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % currentGalleryItems.length;
    showLightboxItem();
  });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightbox-next').click();
  });

  /* ---------------- Campus hotspots ---------------- */
  var hotspotCard = document.getElementById('hotspot-card');
  var campusWrap = document.getElementById('campus-wrap');
  document.querySelectorAll('.hotspot').forEach(function (spot) {
    function reveal() {
      hotspotCard.innerHTML = '<h4 style="margin:0 0 4px;font-family:var(--font-display);color:var(--forest-dark);">' + spot.dataset.name + '</h4><p style="margin:0;font-size:.85rem;color:var(--ink-soft);">Details to be provided.</p>';
      var top = spot.style.top;
      var left = spot.style.left;
      hotspotCard.style.top = top;
      hotspotCard.style.left = left;
      hotspotCard.classList.add('show');
    }
    spot.addEventListener('click', reveal);
    spot.addEventListener('keydown', function (e) { if (e.key === 'Enter') reveal(); });
  });
  document.addEventListener('click', function (e) {
    if (campusWrap && !campusWrap.contains(e.target)) hotspotCard.classList.remove('show');
  });

  /* ---------------- Graduate attributes ---------------- */
  var attrChips = document.querySelectorAll('.attr-chip');
  var attrDetailTitle = document.querySelector('#attr-detail h4');
  var attrDetailText = document.getElementById('attr-detail-text');
  var attrCopy = {
    'Competent': 'Equipped with strong academic and practical knowledge suited to their chosen path.',
    'Responsible': 'Takes ownership of decisions, work, and commitments.',
    'Purpose-Driven': 'Acts with clear direction and meaningful personal goals.',
    'Critical Thinker': 'Analyzes information carefully and reasons through problems.',
    'Creative and Innovative': 'Approaches challenges with imagination and original ideas.',
    'Technologically Literate': 'Uses digital tools confidently and responsibly.',
    'Effective Communicator': 'Expresses ideas clearly across different settings and audiences.',
    'Adaptable': 'Adjusts well to new situations, tools, and challenges.',
    'Community-Oriented': 'Contributes positively to the wellbeing of others and the community.',
    'Lifelong Learner': 'Stays curious and continues learning beyond the classroom.'
  };
  attrChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      attrChips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      var key = chip.dataset.attr;
      attrDetailTitle.textContent = key;
      attrDetailText.textContent = attrCopy[key] || '';
    });
  });

  /* ---------------- Assessment accordion ---------------- */
  document.querySelectorAll('#assessment-accordion .accordion-item').forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', function () {
      item.classList.toggle('open');
    });
  });

  /* ---------------- Goals timeline ---------------- */
  document.querySelectorAll('#goals-list .goal-item').forEach(function (item) {
    var trigger = item.querySelector('.goal-trigger');
    trigger.addEventListener('click', function () {
      item.classList.toggle('open');
    });
  });

  /* ---------------- Admissions modal ---------------- */
  var modalOverlay = document.getElementById('modal-overlay');
  function openAdmitModal() { modalOverlay.classList.add('show'); }
  document.getElementById('apply-now-btn').addEventListener('click', openAdmitModal);
  document.getElementById('request-info-btn').addEventListener('click', openAdmitModal);
  document.getElementById('view-all-announcements').addEventListener('click', function () {
    document.getElementById('modal-title').textContent = 'More announcements coming soon.';
    document.getElementById('modal-text').textContent = 'Additional school announcements will be posted here once available.';
    openAdmitModal();
  });
  document.getElementById('modal-close').addEventListener('click', function () {
    modalOverlay.classList.remove('show');
  });
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) modalOverlay.classList.remove('show');
  });

  /* ---------------- Contact form validation ---------------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    var fields = [
      { id: 'field-name', input: 'cf-name', check: function (v) { return v.trim().length > 1; }, msg: 'Please enter your full name.' },
      { id: 'field-email', input: 'cf-email', check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, msg: 'Please enter a valid email address.' },
      { id: 'field-subject', input: 'cf-subject', check: function (v) { return v.trim().length > 2; }, msg: 'Please enter a subject.' },
      { id: 'field-message', input: 'cf-message', check: function (v) { return v.trim().length > 5; }, msg: 'Please enter a message (at least a few words).' }
    ];
    fields.forEach(function (f) {
      var wrap = document.getElementById(f.id);
      var input = document.getElementById(f.input);
      var errorEl = wrap.querySelector('.field-error');
      if (!f.check(input.value)) {
        wrap.classList.add('invalid');
        errorEl.textContent = f.msg;
        valid = false;
      } else {
        wrap.classList.remove('invalid');
        errorEl.textContent = '';
      }
    });
    if (valid) {
      status.textContent = 'Thank you — your message has been prepared. Note: this form is not yet connected to an email service, so it has not been sent anywhere.';
      status.classList.add('success');
      form.reset();
    } else {
      status.textContent = '';
      status.classList.remove('success');
    }
  });

});
