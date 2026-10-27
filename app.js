/**
 * SOLUTION Clan - Minimalist Interactive Script
 * Clean tab switching, live form sync, clipboard export, and subtle ambient canvas.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initFormSync();
  initFaqAccordion();
  initSubtleCanvas();
  initMobileNav();
});

/* ================= TAB SYSTEM ================= */
function initTabs() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`tab-${hash}`)) {
    switchTab(hash);
  }
}

function switchTab(tabId) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  const panes = document.querySelectorAll('.tab-pane');
  panes.forEach(pane => pane.classList.remove('active'));

  const targetPane = document.getElementById(`tab-${tabId}`);
  if (targetPane) {
    targetPane.classList.add('active');
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const nav = document.getElementById('main-nav');
  if (nav && nav.classList.contains('open')) {
    nav.classList.remove('open');
  }
}

/* ================= MOBILE NAV ================= */
function initMobileNav() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
}

/* ================= FORM SYNC & LIVE PREVIEW ================= */
function initFormSync() {
  const nameInput = document.getElementById('field-name');
  const ageInput = document.getElementById('field-age');
  const expInput = document.getElementById('field-exp');
  const contactInput = document.getElementById('field-contact');
  const radioInputs = document.querySelectorAll('input[name="anydesk"]');
  const previewOutput = document.getElementById('markdown-output');

  const copyBtn = document.getElementById('btn-copy-anketa');
  const quickCopyBtn = document.getElementById('btn-quick-copy');
  const resetBtn = document.getElementById('btn-reset');

  // Load from LocalStorage
  try {
    const saved = JSON.parse(localStorage.getItem('solution_clan_draft') || '{}');
    if (saved.name) nameInput.value = saved.name;
    if (saved.age) ageInput.value = saved.age;
    if (saved.exp) expInput.value = saved.exp;
    if (saved.contact && contactInput) contactInput.value = saved.contact;
    if (saved.anydesk) {
      const radio = document.querySelector(`input[name="anydesk"][value="${saved.anydesk}"]`);
      if (radio) radio.checked = true;
    }
  } catch (e) {}

  function getMarkdown() {
    const nameVal = nameInput.value.trim() || '[Имя / Ник]';
    const ageVal = ageInput.value.trim() || '[Возраст]';
    const expVal = expInput.value.trim() || '[Стаж]';

    let anydeskVal = 'Да, готов пройти проверку в любой момент';
    const checkedRadio = document.querySelector('input[name="anydesk"]:checked');
    if (checkedRadio) {
      anydeskVal = checkedRadio.value;
    }

    const contactVal = contactInput ? contactInput.value.trim() : '';

    let text = `# Набор в клан Solution\n` +
      `*1. Как тебя зовут: ${nameVal}\n` +
      `2. Сколько тебе лет?: ${ageVal}\n` +
      `3. Как давно ты играешь в майнкрафт?: ${expVal}\n` +
      `4. Ты готов пройти проверку на читы через AnyDesk?: ${anydeskVal}*`;

    if (contactVal) {
      text += `\n*Контакт: ${contactVal}*`;
    }

    return text;
  }

  function update() {
    const md = getMarkdown();
    if (previewOutput) {
      previewOutput.textContent = md;
    }

    try {
      localStorage.setItem('solution_clan_draft', JSON.stringify({
        name: nameInput.value,
        age: ageInput.value,
        exp: expInput.value,
        contact: contactInput ? contactInput.value : '',
        anydesk: document.querySelector('input[name="anydesk"]:checked')?.value
      }));
    } catch (e) {}
  }

  [nameInput, ageInput, expInput, contactInput].forEach(elem => {
    if (elem) elem.addEventListener('input', update);
  });

  radioInputs.forEach(r => r.addEventListener('change', update));

  if (copyBtn) {
    copyBtn.addEventListener('click', () => copyToClipboard(getMarkdown()));
  }

  if (quickCopyBtn) {
    quickCopyBtn.addEventListener('click', () => copyToClipboard(getMarkdown()));
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      setTimeout(() => {
        update();
        try { localStorage.removeItem('solution_clan_draft'); } catch (e) {}
      }, 50);
    });
  }

  update();
}

/* ================= CLIPBOARD & TOAST ================= */
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Анкета скопирована в буфер обмена'))
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast('Анкета скопирована в буфер обмена');
  } catch (e) {
    showToast('Не удалось скопировать, скопируйте вручную');
  }
  document.body.removeChild(ta);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast) return;

  if (toastMsg) toastMsg.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* ================= FAQ ACCORDION ================= */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

/* ================= SUBTLE AMBIENT CANVAS ================= */
function initSubtleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const count = 25;
  const dots = [];

  for (let i = 0; i < count; i++) {
    dots.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15 - 0.1,
      alpha: Math.random() * 0.25 + 0.1
    });
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.x += d.vx;
      d.y += d.vy;

      if (d.x < 0) d.x = w;
      if (d.x > w) d.x = 0;
      if (d.y < 0) d.y = h;
      if (d.y > h) d.y = 0;

      ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
      ctx.fillRect(d.x, d.y, d.size, d.size);
    }

    requestAnimationFrame(tick);
  }

  tick();
}
