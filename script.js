/* ==========================================================================
   AI MIND — Mental Health Score Predictor
   Vanilla JS: UI animation, form handling, API integration, charts
   ========================================================================== */

(() => {
  'use strict';

  /* ---------------------------------------------------------------------
     Config
  --------------------------------------------------------------------- */
  const API_URL = 'https://mental-health-score-predictor-pgkg.onrender.com';

  /* ---------------------------------------------------------------------
     Custom cursor
  --------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, input, select, .slider').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
  }

  /* ---------------------------------------------------------------------
     Floating particles
  --------------------------------------------------------------------- */
  const particlesContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 26;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = Math.random() * 2.5 + 1.5;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `-10px`;
    p.style.animationDuration = `${Math.random() * 14 + 12}s`;
    p.style.animationDelay = `${Math.random() * 12}s`;
    particlesContainer.appendChild(p);
  }

  /* ---------------------------------------------------------------------
     Navbar: scroll shadow + mobile menu + active link
  --------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  navBurger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navBurger.classList.toggle('open', isOpen);
    navBurger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navBurger.classList.remove('open');
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-link'));
      link.classList.add('active-link');
    });
  });

  /* ---------------------------------------------------------------------
     Reveal-on-scroll (fade-in / slide-up sections)
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     Typing text effect (hero subtitle)
  --------------------------------------------------------------------- */
  const typedEl = document.getElementById('typedSubtitle');
  const FULL_TEXT = 'Predict your mental wellness score using Machine Learning by analyzing your digital lifestyle, study habits, sleep patterns, stress level, and social media usage.';
  let typeIndex = 0;

  function typeWriter() {
    if (typeIndex <= FULL_TEXT.length) {
      typedEl.innerHTML = FULL_TEXT.slice(0, typeIndex) + '<span class="typed-cursor">&nbsp;</span>';
      typeIndex++;
      setTimeout(typeWriter, 14);
    } else {
      typedEl.innerHTML = FULL_TEXT;
    }
  }
  typeWriter();

  /* ---------------------------------------------------------------------
     Hero stat counters
  --------------------------------------------------------------------- */
  function animateCounter(el, target, duration = 1400) {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statEls = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, Number(el.dataset.count));
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObserver.observe(el));

  // Fake but plausible response-time stat, purely cosmetic
  document.querySelector('.hero-stat:last-child .stat-num').dataset.count = String(120 + Math.floor(Math.random() * 60));

  /* ---------------------------------------------------------------------
     Ripple effect on buttons
  --------------------------------------------------------------------- */
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ---------------------------------------------------------------------
     Toast notifications
  --------------------------------------------------------------------- */
  const toastStack = document.getElementById('toastStack');
  function showToast(message, type = 'info', timeout = 4200) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastStack.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, timeout);
  }

  /* ---------------------------------------------------------------------
     Sliders: live value display + fill track
  --------------------------------------------------------------------- */
  function wireSlider(sliderId, outputId) {
    const slider = document.getElementById(sliderId);
    const output = document.getElementById(outputId);
    const update = () => {
      const min = Number(slider.min), max = Number(slider.max), val = Number(slider.value);
      const pct = ((val - min) / (max - min)) * 100;
      slider.style.backgroundSize = `${pct}% 100%`;
      output.textContent = val;
    };
    slider.addEventListener('input', update);
    update();
  }
  wireSlider('usage', 'usageVal');
  wireSlider('study', 'studyVal');
  wireSlider('activity', 'activityVal');
  wireSlider('sleep', 'sleepVal');

  /* ---------------------------------------------------------------------
     Form validation
  --------------------------------------------------------------------- */
  const form = document.getElementById('predictForm');
  const predictBtn = document.getElementById('predictBtn');

  function setFieldError(fieldId, errId, message) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(errId);
    field.closest('.field').classList.toggle('has-error', Boolean(message));
    errEl.textContent = message || '';
  }

  function validateForm(payload) {
    let valid = true;

    if (!payload.Age || payload.Age < 10 || payload.Age > 100) {
      setFieldError('age', 'err-age', 'Enter an age between 10 and 100'); valid = false;
    } else setFieldError('age', 'err-age', '');

    if (!payload.Gender) { setFieldError('gender', 'err-gender', 'Select a gender'); valid = false; }
    else setFieldError('gender', 'err-gender', '');

    if (!payload.Country) { setFieldError('country', 'err-country', 'Select a country'); valid = false; }
    else setFieldError('country', 'err-country', '');

    if (!payload.Academic_Level) { setFieldError('academic', 'err-academic', 'Select academic level'); valid = false; }
    else setFieldError('academic', 'err-academic', '');

    if (!payload.Most_Used_Platform) { setFieldError('platform', 'err-platform', 'Select a platform'); valid = false; }
    else setFieldError('platform', 'err-platform', '');

    if (!payload.Purpose_Of_Use) { setFieldError('purpose', 'err-purpose', 'Select a purpose'); valid = false; }
    else setFieldError('purpose', 'err-purpose', '');

    if (payload.Daily_Unlocks === '' || payload.Daily_Unlocks < 0) {
      setFieldError('unlocks', 'err-unlocks', 'Enter daily unlocks (0 or more)'); valid = false;
    } else setFieldError('unlocks', 'err-unlocks', '');

    if (!payload.Stress_Level) { setFieldError('stress', 'err-stress', 'Select stress level'); valid = false; }
    else setFieldError('stress', 'err-stress', '');

    return valid;
  }

  /* ---------------------------------------------------------------------
     Result rendering
  --------------------------------------------------------------------- */
  const resultSection = document.getElementById('result-section');
  const ringFill = document.getElementById('ringFill');
  const ringScore = document.getElementById('ringScore');
  const resultEmoji = document.getElementById('resultEmoji');
  const resultLabel = document.getElementById('resultLabel');
  const resultDesc = document.getElementById('resultDesc');
  const resultBadge = document.getElementById('resultBadge');

  const RING_CIRCUMFERENCE = 2 * Math.PI * 86; // r=86

  function scoreProfile(score) {
    if (score >= 90) return { color: 'var(--accent-green)',  hex:'#22C55E', emoji: '🌿', label: 'Excellent Mental Health', desc: 'Your habits are strongly supporting your mental wellbeing. Keep it up!' };
    if (score >= 75) return { color: 'var(--accent-green)',  hex:'#22C55E', emoji: '😊', label: 'Good Mental Health', desc: 'You\u2019re in a healthy range overall, with room for small improvements.' };
    if (score >= 60) return { color: 'var(--accent-yellow)', hex:'#EAB308', emoji: '🙂', label: 'Moderate Mental Health', desc: 'A mixed picture — a few lifestyle tweaks could meaningfully help.' };
    if (score >= 40) return { color: 'var(--accent-orange)', hex:'#F97316', emoji: '⚠️', label: 'Needs Attention', desc: 'Several factors may be weighing on your wellbeing. Consider adjusting routines.' };
    return { color: 'var(--accent-red)', hex:'#EF4444', emoji: '🚨', label: 'High Risk', desc: 'Your inputs suggest significant strain. Please consider speaking with someone you trust or a professional.' };
  }

  function renderResult(score, formValues) {
    resultSection.style.display = 'block';
    resultSection.querySelectorAll('.reveal').forEach(el => el.classList.remove('in-view'));
    requestAnimationFrame(() => {
      resultSection.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    });

    const profile = scoreProfile(score);

    // Circular progress ring
    const offset = RING_CIRCUMFERENCE - (Math.min(Math.max(score, 0), 100) / 100) * RING_CIRCUMFERENCE;
    ringFill.style.stroke = profile.hex;
    ringFill.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
    // Force reflow so the transition replays every time
    ringFill.style.transition = 'none';
    ringFill.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;
    void ringFill.offsetWidth;
    ringFill.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.16,.84,.44,1), stroke 0.6s';
    ringFill.style.strokeDashoffset = `${offset}`;

    // Animated score counter
    animateCounter(ringScore, Math.round(score), 1400);

    resultEmoji.textContent = profile.emoji;
    resultEmoji.style.animation = 'none';
    void resultEmoji.offsetWidth;
    resultEmoji.style.animation = 'emojiPop .6s cubic-bezier(.16,.84,.44,1)';

    resultLabel.textContent = profile.label;
    resultDesc.textContent = profile.desc;
    resultBadge.textContent = profile.label;
    resultBadge.style.color = profile.hex;
    resultBadge.style.background = `${profile.hex}1F`;
    resultBadge.style.borderColor = `${profile.hex}4D`;

    renderCharts(formValues, score);
    updateDashboard(formValues);

    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------------------------------------------------------------
     Charts (Chart.js): radar + doughnut
  --------------------------------------------------------------------- */
  let radarChartInstance = null;
  let doughnutChartInstance = null;

  const CHART_TEXT_COLOR = '#94A3B8';
  const CHART_GRID_COLOR = 'rgba(148,163,184,0.15)';

  function renderCharts(formValues, score) {
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');

    const radarData = {
      labels: ['Sleep', 'Stress (inv.)', 'Study', 'Activity', 'Social Usage (inv.)', 'Unlocks (inv.)'],
      datasets: [{
        label: 'Your lifestyle profile',
        data: [
          Number(formValues.Sleep_Hours_Per_Night),
          24 - stressToScale(formValues.Stress_Level), // invert so "healthier" = higher
          Number(formValues.Study_Hours),
          Number(formValues.Physical_Activity_Hours),
          24 - Number(formValues.Avg_Daily_Usage_Hours),
          Math.max(0, 24 - (Number(formValues.Daily_Unlocks) / 10)),
        ],
        backgroundColor: 'rgba(99,102,241,0.22)',
        borderColor: '#8B5CF6',
        borderWidth: 2,
        pointBackgroundColor: '#06B6D4',
        pointBorderColor: '#0F172A',
        pointRadius: 4,
      }]
    };

    if (radarChartInstance) radarChartInstance.destroy();
    radarChartInstance = new Chart(radarCtx, {
      type: 'radar',
      data: radarData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 1200, easing: 'easeOutQuart' },
        scales: {
          r: {
            angleLines: { color: CHART_GRID_COLOR },
            grid: { color: CHART_GRID_COLOR },
            pointLabels: { color: CHART_TEXT_COLOR, font: { size: 11 } },
            ticks: { display: false, backdropColor: 'transparent' },
            suggestedMin: 0,
            suggestedMax: 24,
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111827',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
          }
        }
      }
    });

    const profile = scoreProfile(score);
    if (doughnutChartInstance) doughnutChartInstance.destroy();
    doughnutChartInstance = new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Score', 'Remaining'],
        datasets: [{
          data: [score, Math.max(0, 100 - score)],
          backgroundColor: [profile.hex, 'rgba(255,255,255,0.06)'],
          borderWidth: 0,
          hoverOffset: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '72%',
        animation: { duration: 1200, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111827',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => ctx.label === 'Score' ? `Score: ${score.toFixed(1)}` : null
            }
          }
        }
      }
    });
  }

  function stressToScale(level) {
    const map = { 'Low': 4, 'Medium': 10, 'High': 17, 'Very High': 22 };
    return map[level] ?? 10;
  }

  /* ---------------------------------------------------------------------
     Dashboard cards
  --------------------------------------------------------------------- */
  function updateDashboard(formValues) {
    document.getElementById('dashUsage').textContent = `${formValues.Avg_Daily_Usage_Hours} h/day`;
    document.getElementById('dashStress').textContent = formValues.Stress_Level;
    document.getElementById('dashSleep').textContent = `${formValues.Sleep_Hours_Per_Night} h/night`;
    document.getElementById('dashStudy').textContent = `${formValues.Study_Hours} h/day`;
    document.getElementById('dashActivity').textContent = `${formValues.Physical_Activity_Hours} h/day`;
  }

  /* ---------------------------------------------------------------------
     Form submit → API call
  --------------------------------------------------------------------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const payload = {
      Age: fd.get('Age') ? Number(fd.get('Age')) : '',
      Gender: fd.get('Gender') || '',
      Country: fd.get('Country') || '',
      Academic_Level: fd.get('Academic_Level') || '',
      Most_Used_Platform: fd.get('Most_Used_Platform') || '',
      Purpose_Of_Use: fd.get('Purpose_Of_Use') || '',
      Avg_Daily_Usage_Hours: Number(fd.get('Avg_Daily_Usage_Hours')),
      Daily_Unlocks: fd.get('Daily_Unlocks') !== '' ? Number(fd.get('Daily_Unlocks')) : '',
      Study_Hours: Number(fd.get('Study_Hours')),
      Physical_Activity_Hours: Number(fd.get('Physical_Activity_Hours')),
      Sleep_Hours_Per_Night: Number(fd.get('Sleep_Hours_Per_Night')),
      Stress_Level: fd.get('Stress_Level') || '',
    };

    if (!validateForm(payload)) {
      showToast('Please fix the highlighted fields before continuing.', 'error');
      const firstError = form.querySelector('.has-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    predictBtn.classList.add('is-loading');
    predictBtn.disabled = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let detail = `Server responded with status ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody?.detail) {
            detail = typeof errBody.detail === 'string'
              ? errBody.detail
              : 'The server rejected one or more fields. Please review your inputs.';
          }
        } catch (_) { /* body wasn't JSON, keep default message */ }
        throw new Error(detail);
      }

      const data = await response.json();
      const score = Number(data.prediction_mental_health);

      if (Number.isNaN(score)) {
        throw new Error('Received an unexpected response from the server.');
      }

      showToast('Prediction complete — scroll down to see your results.', 'success');
      renderResult(score, payload);

    } catch (err) {
      if (err.name === 'AbortError') {
        showToast('The request took too long. Please try again.', 'error');
      } else if (err instanceof TypeError) {
        showToast('Could not reach the prediction server. Is it running on port 2200?', 'error');
      } else {
        showToast(err.message || 'Something went wrong while predicting.', 'error');
      }
    } finally {
      predictBtn.classList.remove('is-loading');
      predictBtn.disabled = false;
    }
  });

})();
