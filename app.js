/* =============================================
   PADANG EXPRESS — JAVASCRIPT
   Interactions, Cart, Animations, Builder
   ============================================= */

'use strict';

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
const state = {
  cart: [],
  tip: 0,
  builderSelections: {},
  menuCategory: 'semua',
};

const BUILDER_PRICES = {
  karbo:  { 'Nasi Putih': 5000, 'Nasi Merah': 6000, 'Lontong': 4000 },
  lauk:   { 'Rendang': 28000, 'Ayam Pop': 22000, 'Ayam Bakar': 24000, 'Udang Balado': 32000 },
  kuah:   { 'Gulai Tunjang': 15000, 'Gulai Nangka': 12000, 'Tanpa Kuah': 0 },
  sambal: { 'Sambal Ijo': 5000, 'Sambal Merah': 5000, 'Sambal Balado': 6000 },
};

/* ─────────────────────────────────────────
   DOM REFERENCES
───────────────────────────────────────── */
const navbar       = document.getElementById('navbar');
const cartBtn      = document.getElementById('cart-btn');
const cartBadge    = document.getElementById('cart-badge');
const cartSidebar  = document.getElementById('cart-sidebar');
const cartOverlay  = document.getElementById('cart-overlay');
const cartClose    = document.getElementById('cart-close');
const cartEmpty    = document.getElementById('cart-empty');
const cartItems    = document.getElementById('cart-items-container');
const cartFooter   = document.getElementById('cart-footer');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal    = document.getElementById('cart-total');
const flyItem      = document.getElementById('fly-item');
const toast        = document.getElementById('toast');
const menuGrid     = document.getElementById('menu-grid');
const btnCheckout  = document.getElementById('btn-checkout');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose   = document.getElementById('modal-close');
const modalOk      = document.getElementById('modal-ok');
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('nav-links');
const searchToggle = document.getElementById('search-toggle');
const searchExpand = document.getElementById('search-expand');
const searchInput  = document.getElementById('search-input');
const previewItems = document.getElementById('preview-items');
const previewEmpty = document.getElementById('preview-empty');
const previewSummary = document.getElementById('preview-summary');
const summaryList  = document.getElementById('summary-list');
const previewPrice = document.getElementById('preview-price');
const addBuilderCart = document.getElementById('add-builder-cart');

/* ─────────────────────────────────────────
   NAVBAR — SCROLL EFFECT
───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ─────────────────────────────────────────
   HAMBURGER MOBILE MENU
───────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-open');
  hamburger.classList.toggle('active');
});
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    navLinks.classList.remove('mobile-open');
    hamburger.classList.remove('active');
  }
});

/* ─────────────────────────────────────────
   SEARCH TOGGLE
───────────────────────────────────────── */
searchToggle.addEventListener('click', () => {
  searchExpand.classList.toggle('open');
  if (searchExpand.classList.contains('open')) {
    setTimeout(() => searchInput.focus(), 150);
  }
});
searchInput.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const cards = menuGrid.querySelectorAll('.food-card');
  cards.forEach(card => {
    const name = card.querySelector('.card-name')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
    card.style.display = (name.includes(q) || desc.includes(q) || q === '') ? '' : 'none';
  });
});

/* ─────────────────────────────────────────
   CATEGORY FILTER
───────────────────────────────────────── */
const catBtns = document.querySelectorAll('.cat-btn');
catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    if (cat === state.menuCategory) return;
    state.menuCategory = cat;

    // Update active button
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Animate cards out/in
    const cards = menuGrid.querySelectorAll('.food-card');
    cards.forEach(card => {
      card.classList.add('fade-out');
    });
    setTimeout(() => {
      cards.forEach(card => {
        card.classList.remove('fade-out');
        const cardCat = card.dataset.cat;
        const visible = cat === 'semua' || cardCat === cat;
        card.classList.toggle('hidden', !visible);
        if (visible) card.classList.add('fade-in');
      });
      setTimeout(() => cards.forEach(c => c.classList.remove('fade-in')), 400);
    }, 250);
  });
});

/* ─────────────────────────────────────────
   CART OPEN / CLOSE
───────────────────────────────────────── */
function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}
cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

/* ─────────────────────────────────────────
   FLY-TO-CART ANIMATION
───────────────────────────────────────── */
function flyToCart(btn) {
  const btnRect   = btn.getBoundingClientRect();
  const cartRect  = cartBtn.getBoundingClientRect();

  const startX = btnRect.left + btnRect.width / 2 - 14;
  const startY = btnRect.top  + btnRect.height / 2 - 14;
  const endX   = cartRect.left + cartRect.width / 2 - 14;
  const endY   = cartRect.top  + cartRect.height / 2 - 14;

  flyItem.style.cssText = `
    left: ${startX}px;
    top: ${startY}px;
    opacity: 1;
    font-size: 28px;
    transition: none;
  `;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyItem.style.cssText = `
        left: ${endX}px;
        top: ${endY}px;
        opacity: 0;
        font-size: 12px;
        transition: all 0.65s cubic-bezier(0.3, 0, 0.8, 1);
      `;
    });
  });

  setTimeout(() => {
    flyItem.style.opacity = '0';
    cartBtn.classList.add('bounce');
    setTimeout(() => cartBtn.classList.remove('bounce'), 500);
  }, 650);
}

/* ─────────────────────────────────────────
   ADD TO CART
───────────────────────────────────────── */
function addToCart(id, name, price) {
  const existing = state.cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ id, name, price: parseInt(price), qty: 1, emoji: getEmoji(id) });
  }
  renderCart();
  updateBadge();
  showToast(`✅ ${name} ditambahkan ke keranjang!`);
}

function getEmoji(id) {
  const map = {
    'rendang': '🥩', 'gulai': '🍜', 'ayam-pop': '🍗',
    'ayam-goreng': '🍗', 'ayam-bakar': '🔥', 'dendeng': '🥩',
    'sambal': '🥬', 'udang': '🦐', 'paket-komplit': '📦',
    'custom-bungkus': '🍱',
  };
  return map[id] || '🍛';
}

document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const { id, name, price } = btn.dataset;
    flyToCart(btn);
    addToCart(id, name, price);
  });
});

/* ─────────────────────────────────────────
   RENDER CART
───────────────────────────────────────── */
function renderCart() {
  const isEmpty = state.cart.length === 0;
  cartEmpty.style.display = isEmpty ? 'flex' : 'none';
  cartFooter.style.display = isEmpty ? 'none' : 'block';

  // Remove existing cart items (not the empty state)
  const existingItems = cartItems.querySelectorAll('.cart-item');
  existingItems.forEach(el => el.remove());

  state.cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.id = `cart-item-${item.id}`;
    el.innerHTML = `
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatRupiah(item.price * item.qty)}</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control">
          <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Kurangi ${item.name}">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Tambah ${item.name}">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}" aria-label="Hapus ${item.name}">Hapus</button>
      </div>
    `;
    cartItems.insertBefore(el, cartEmpty);
  });

  // Quantity & remove listeners
  cartItems.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = state.cart.find(i => i.id === id);
      if (!item) return;
      if (action === 'inc') item.qty++;
      else if (action === 'dec') {
        item.qty--;
        if (item.qty <= 0) state.cart.splice(state.cart.indexOf(item), 1);
      }
      renderCart();
      updateBadge();
    });
  });
  cartItems.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      state.cart = state.cart.filter(i => i.id !== id);
      renderCart();
      updateBadge();
    });
  });

  updateCartTotals();
}

function updateCartTotals() {
  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total    = subtotal + state.tip;
  cartSubtotal.textContent = formatRupiah(subtotal);
  cartTotal.textContent    = formatRupiah(total);
}

function updateBadge() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  cartBadge.textContent = count;
  if (count === 0) {
    cartBadge.classList.add('hidden');
  } else {
    cartBadge.classList.remove('hidden');
  }
}

/* ─────────────────────────────────────────
   TIP BUTTONS
───────────────────────────────────────── */
document.querySelectorAll('.tip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.tip = parseInt(btn.dataset.tip) || 0;
    updateCartTotals();
  });
});

/* ─────────────────────────────────────────
   PAYMENT MODAL — MULTI STEP
───────────────────────────────────────── */
let qrisTimerInterval = null;
let currentPayMethod  = 'qris';

// Helper: update step indicator
function setPayStep(stepNum) {
  const dots  = [document.getElementById('pstep-1'), document.getElementById('pstep-2'), document.getElementById('pstep-3')];
  const lines = document.querySelectorAll('.pstep-line');
  dots.forEach((d, i) => {
    d.classList.remove('active', 'done');
    if (i + 1 < stepNum)  d.classList.add('done');
    if (i + 1 === stepNum) d.classList.add('active');
  });
  lines.forEach((l, i) => {
    l.classList.toggle('done', i + 1 < stepNum);
  });
}

// Helper: show step, hide others
function showPayStep(id) {
  const allSteps = document.querySelectorAll('.modal-step');
  allSteps.forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('hidden');
    // re-trigger animation
    target.style.animation = 'none';
    requestAnimationFrame(() => { target.style.animation = ''; });
  }
}

// Open payment modal — go to step 1
function openPaymentModal() {
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0) + state.tip;
  // Set total display
  document.getElementById('modal-ptotal').textContent   = formatRupiah(total);
  document.getElementById('qris-amount').textContent    = formatRupiah(total);
  document.getElementById('transfer-amount').textContent = formatRupiah(total);
  document.getElementById('cod-amount').textContent     = formatRupiah(total);
  document.getElementById('success-total').textContent  = formatRupiah(total);

  showPayStep('modal-step-1');
  setPayStep(1);
  modalOverlay.classList.add('active');
}

btnCheckout.addEventListener('click', () => {
  closeCart();
  setTimeout(openPaymentModal, 300);
});

// Method selection buttons
document.getElementById('pay-qris').addEventListener('click', () => {
  currentPayMethod = 'QRIS';
  showPayStep('modal-step-qris');
  setPayStep(2);
  startQrisTimer();
});
document.getElementById('pay-transfer').addEventListener('click', () => {
  currentPayMethod = 'Transfer Bank';
  showPayStep('modal-step-transfer');
  setPayStep(2);
  stopQrisTimer();
});
document.getElementById('pay-cod').addEventListener('click', () => {
  currentPayMethod = 'Bayar di Tempat (COD)';
  showPayStep('modal-step-cod');
  setPayStep(2);
  stopQrisTimer();
});

// Back buttons
document.getElementById('back-from-qris').addEventListener('click', () => {
  stopQrisTimer();
  showPayStep('modal-step-1');
  setPayStep(1);
});
document.getElementById('back-from-transfer').addEventListener('click', () => {
  showPayStep('modal-step-1');
  setPayStep(1);
});
document.getElementById('back-from-cod').addEventListener('click', () => {
  showPayStep('modal-step-1');
  setPayStep(1);
});

// Confirm buttons → go to success
function goToSuccess() {
  stopQrisTimer();
  document.getElementById('success-method').textContent = currentPayMethod;
  document.getElementById('order-number').textContent   = '#PX-' + Math.floor(100000 + Math.random() * 900000);
  showPayStep('modal-step-success');
  setPayStep(3);
}
document.getElementById('btn-confirm-qris').addEventListener('click', goToSuccess);
document.getElementById('btn-confirm-transfer').addEventListener('click', goToSuccess);
document.getElementById('btn-confirm-cod').addEventListener('click', goToSuccess);

// QRIS countdown timer
function startQrisTimer() {
  stopQrisTimer();
  let seconds = 300; // 5 minutes
  const timerEl = document.getElementById('qris-timer');
  function tick() {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
    if (seconds === 0) { stopQrisTimer(); timerEl.textContent = 'Kedaluwarsa'; }
    else seconds--;
  }
  tick();
  qrisTimerInterval = setInterval(tick, 1000);
}
function stopQrisTimer() {
  if (qrisTimerInterval) { clearInterval(qrisTimerInterval); qrisTimerInterval = null; }
}

// Copy bank number buttons
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Tersalin ✓';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Salin'; btn.classList.remove('copied'); }, 2000);
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = 'Tersalin ✓';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Salin'; btn.classList.remove('copied'); }, 2000);
    });
  });
});

// Close modal
function closeModal() {
  modalOverlay.classList.remove('active');
  stopQrisTimer();
  state.cart = [];
  state.tip  = 0;
  renderCart();
  updateBadge();
  document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tip-0').classList.add('active');
}
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-ok').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});


/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ─────────────────────────────────────────
   CUSTOM BUILDER
───────────────────────────────────────── */
document.querySelectorAll('.step-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    const step = opt.dataset.step;
    const val  = opt.dataset.val;
    const emoji = opt.dataset.emoji;

    // Toggle selection
    if (state.builderSelections[step] === val) {
      delete state.builderSelections[step];
      opt.classList.remove('selected');
    } else {
      // Deselect siblings
      document.querySelectorAll(`.step-opt[data-step="${step}"]`).forEach(o => o.classList.remove('selected'));
      state.builderSelections[step] = val;
      state.builderSelections[`${step}_emoji`] = emoji;
      opt.classList.add('selected');
    }

    updateBuilderPreview();
  });
});

function updateBuilderPreview() {
  const sel = state.builderSelections;
  const keys = ['karbo', 'lauk', 'kuah', 'sambal'];
  const hasAny = keys.some(k => sel[k]);

  if (!hasAny) {
    previewEmpty.style.display = 'flex';
    previewItems.innerHTML = '';
    previewSummary.style.display = 'none';
    return;
  }

  previewEmpty.style.display = 'none';
  previewSummary.style.display = 'block';

  // Render chips
  previewItems.innerHTML = '';
  keys.forEach(k => {
    if (sel[k]) {
      const chip = document.createElement('div');
      chip.className = 'preview-chip';
      chip.innerHTML = `<span>${sel[`${k}_emoji`] || '🍽️'}</span> ${sel[k]}`;
      previewItems.appendChild(chip);
    }
  });

  // Summary & price
  let total = 0;
  summaryList.innerHTML = '';
  keys.forEach(k => {
    if (sel[k]) {
      const price = BUILDER_PRICES[k]?.[sel[k]] ?? 0;
      total += price;
      const div = document.createElement('div');
      div.className = 'summary-item';
      div.innerHTML = `<span>${sel[`${k}_emoji`] || '•'}</span> ${sel[k]} <span style="margin-left:auto;color:var(--orange);font-weight:700;">+${formatRupiah(price)}</span>`;
      summaryList.appendChild(div);
    }
  });
  previewPrice.textContent = formatRupiah(total);
}

addBuilderCart.addEventListener('click', () => {
  const sel = state.builderSelections;
  const keys = ['karbo', 'lauk', 'kuah', 'sambal'];
  const hasAll = keys.filter(k => sel[k]).length >= 2;

  if (!hasAll) {
    showToast('⚠️ Pilih minimal 2 item untuk membuat bungkus!');
    return;
  }

  const name = 'Nasi Bungkus Custom';
  const total = keys.reduce((s, k) => s + (BUILDER_PRICES[k]?.[sel[k]] ?? 0), 0);

  flyToCart(addBuilderCart);
  addToCart('custom-bungkus', name, total);

  // Reset
  state.builderSelections = {};
  document.querySelectorAll('.step-opt').forEach(o => o.classList.remove('selected'));
  updateBuilderPreview();
});

/* ─────────────────────────────────────────
   PAKET BUTTONS
───────────────────────────────────────── */
document.getElementById('order-paket-duo').addEventListener('click', () => {
  addToCart('paket-duo', 'Paket Berdua', 95000);
  showToast('✅ Paket Berdua ditambahkan!');
  openCart();
});
document.getElementById('order-paket-keluarga').addEventListener('click', () => {
  addToCart('paket-keluarga', 'Paket Keluarga', 269000);
  showToast('✅ Paket Keluarga ditambahkan!');
  openCart();
});
document.getElementById('order-paket-kantor').addEventListener('click', () => {
  addToCart('paket-kantor', 'Paket Kantor', 499000);
  showToast('✅ Paket Kantor ditambahkan!');
  openCart();
});

/* ─────────────────────────────────────────
   SCROLL ANIMATIONS (Intersection Observer)
───────────────────────────────────────── */
function initScrollAnimations() {
  // Mark elements to animate
  const targets = [
    ...document.querySelectorAll('.food-card'),
    ...document.querySelectorAll('.testi-card'),
    ...document.querySelectorAll('.paket-card'),
    ...document.querySelectorAll('.builder-step'),
    ...document.querySelectorAll('.feature-item'),
    document.querySelector('.features-strip'),
    document.querySelector('.section-header'),
  ].filter(Boolean);

  targets.forEach(el => el.classList.add('animate-on-scroll'));

  // Stagger the menu grid and paket grid
  document.querySelector('.menu-grid')?.classList.add('stagger-children');
  document.querySelector('.testimoni-grid')?.classList.add('stagger-children');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));

  // Section headers
  document.querySelectorAll('.section-header').forEach(h => observer.observe(h));
  // Grid containers (for stagger)
  document.querySelectorAll('.stagger-children').forEach(g => observer.observe(g));
}

/* ─────────────────────────────────────────
   HERO PLATE PARALLAX (subtle)
───────────────────────────────────────── */
const heroPlate = document.getElementById('hero-plate');
window.addEventListener('mousemove', (e) => {
  if (!heroPlate) return;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx * 6;
  const dy = (e.clientY - cy) / cy * 6;
  // Keep rotation but add subtle offset
  heroPlate.style.transform = `translateX(${dx}px) translateY(${dy}px)`;
});

/* ─────────────────────────────────────────
   SMOOTH ANCHOR LINKS
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─────────────────────────────────────────
   UTILITIES
───────────────────────────────────────── */
function formatRupiah(num) {
  return 'Rp ' + parseInt(num).toLocaleString('id-ID');
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  renderCart();
  initScrollAnimations();

  // Animate section headers separately with stagger
  const sectionHeaderObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const label = entry.target.querySelector('.section-label');
        const title = entry.target.querySelector('.section-title');
        const desc  = entry.target.querySelector('.section-desc');
        [label, title, desc].filter(Boolean).forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 120);
        });
        sectionHeaderObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section-header').forEach(h => {
    const els = h.querySelectorAll('.section-label, .section-title, .section-desc');
    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    sectionHeaderObserver.observe(h);
  });
});

// Remove hero plate CSS animation when mouse moves
heroPlate?.addEventListener('mouseenter', () => {
  heroPlate.style.animation = 'none';
});
heroPlate?.addEventListener('mouseleave', () => {
  heroPlate.style.animation = 'slowRotate 20s linear infinite';
  heroPlate.style.transform = '';
});
