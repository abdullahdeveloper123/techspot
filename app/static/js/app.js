// Theme toggle with localStorage
(function() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') root.classList.add('theme-light');
  updateToggleLabel();

  toggleBtn?.addEventListener('click', () => {
    root.classList.toggle('theme-light');
    const isLight = root.classList.contains('theme-light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateToggleLabel();
  });

  function updateToggleLabel() {
    const isLight = root.classList.contains('theme-light');
    const iconEl = document.querySelector('#themeToggle .theme-icon');
    const textEl = document.querySelector('#themeToggle span.d-none.d-sm-inline');
    if (iconEl) {
      iconEl.classList.remove('fa-moon', 'fa-sun');
      iconEl.classList.add(isLight ? 'fa-sun' : 'fa-moon');
    }
    if (textEl) textEl.textContent = isLight ? 'Light' : 'Dark';
  }
})();

// Reveal-on-scroll animations using IntersectionObserver
(function() {
  const items = document.querySelectorAll('.reveal-up');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  items.forEach(el => observer.observe(el));
})();

// Sticky navbar subtle shadow on scroll
(function() {
  const header = document.querySelector('header');
  const onScroll = () => {
    if (!header) return;
    const elevated = window.scrollY > 8;
    header.style.boxShadow = elevated ? '0 8px 30px rgba(0,0,0,.25)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Footer year
document.getElementById('year')?.appendChild(document.createTextNode(String(new Date().getFullYear())));

// Product details modal
(function() {
  const overlay = document.getElementById('detailsOverlay');
  const image = document.getElementById('detailsImage');
  const title = document.getElementById('detailsTitle');
  const price = document.getElementById('detailsPrice');
  const desc = document.getElementById('detailsDesc');
  const closeBtn = overlay?.querySelector('.details-close');
  let returning = false;

  function open(details) {
    if (!overlay) return;
    image.src = details.image || '';
    image.alt = details.title || 'Product image';
    title.textContent = details.title || '';
    price.textContent = details.price || '';
    desc.textContent = details.desc || '';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!overlay) return;
    if (returning) return; returning = true;
    overlay.classList.remove('is-open');
    setTimeout(() => { document.body.style.overflow = ''; returning = false; }, 220);
  }

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const btn = target.closest('.show-details');
    if (btn) {
      open({
        title: btn?.getAttribute('data-title') || '',
        price: btn?.getAttribute('data-price') || '',
        desc: btn?.getAttribute('data-desc') || '',
        image: btn?.getAttribute('data-image') || ''
      });
    }
  });

  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Removed shared-element animations for simplicity
})();

// Review carousel (Owl-like)
(function() {
  const root = document.getElementById('reviewCarousel');
  if (!root) return;
  const track = root.querySelector('.rc-track');
  const slides = Array.from(root.querySelectorAll('.rc-slide'));
  const prev = root.querySelector('.rc-prev');
  const next = root.querySelector('.rc-next');
  const dotsWrap = root.querySelector('.rc-dots');
  let index = 0;
  let perView = 1;
  let autoTimer = null;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let baseOffset = 0;

  function computePerView() {
    const w = window.innerWidth;
    if (w >= 992) return 3; // lg
    if (w >= 576) return 2; // sm+
    return 1;
  }

  function update() {
    perView = computePerView();
    const maxIndex = Math.max(0, slides.length - perView);
    if (index > maxIndex) index = 0; if (index < 0) index = maxIndex;
    const slide = slides[0];
    const slideWidth = slide.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 16);
    const offset = -(index * slideWidth);
    baseOffset = offset; // store for dragging baseline
    track.style.transition = 'transform .5s cubic-bezier(.22,.61,.36,1)';
    track.style.transform = `translateX(${offset}px)`;
    updateDots(maxIndex);
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const maxIndex = Math.max(0, slides.length - computePerView());
    for (let i = 0; i <= maxIndex; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to slide ${i+1}`);
      b.addEventListener('click', () => { index = i; update(); restartAuto(); });
      dotsWrap.appendChild(b);
    }
  }

  function updateDots(maxIndex) {
    const buttons = dotsWrap.querySelectorAll('button');
    buttons.forEach((b, i) => b.setAttribute('aria-current', String(i === index)));
    if (buttons.length - 1 !== maxIndex) buildDots();
  }

  function prevSlide() { index--; update(); restartAuto(); }
  function nextSlide() { index++; update(); restartAuto(); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => { index++; update(); }, 4000);
  }
  function stopAuto() { if (autoTimer) clearInterval(autoTimer); }
  function restartAuto() { startAuto(); }

  prev?.addEventListener('click', prevSlide);
  next?.addEventListener('click', nextSlide);
  root.addEventListener('mouseenter', stopAuto);
  root.addEventListener('mouseleave', startAuto);
  window.addEventListener('resize', () => { buildDots(); update(); });

  buildDots();
  update();
  startAuto();

  // Dragging
  const viewport = root.querySelector('.rc-viewport');
  function onPointerDown(e) {
    stopAuto();
    isDragging = true;
    viewport.classList.add('dragging');
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    currentX = startX;
    track.style.transition = 'none';
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
  }
  function onPointerMove(e) {
    if (!isDragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const dx = x - startX;
    currentX = x;
    track.style.transform = `translateX(${baseOffset + dx}px)`;
    if (e.cancelable) e.preventDefault();
  }
  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('dragging');
    const dx = currentX - startX;
    const slide = slides[0];
    const slideWidth = slide.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 16);
    const threshold = slideWidth * 0.2;
    if (dx < -threshold) index++;
    else if (dx > threshold) index--;
    update();
    startAuto();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('touchend', onPointerUp);
  }
  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('touchstart', onPointerDown, { passive: true });
})();

// Catalog filters/search/sort (shop.html)
(function() {
  const catalog = document.getElementById('catalog');
  if (!catalog) return;
  const items = Array.from(catalog.querySelectorAll('[data-category]'));
  const searchInput = document.getElementById('catalogSearch');
  const sortSelect = document.getElementById('catalogSort');
  const filtersWrap = document.getElementById('catalogFilters');

  function apply() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const active = filtersWrap?.querySelector('.btn.active')?.getAttribute('data-filter') || 'all';
    // Filter
    for (const el of items) {
      const title = el.querySelector('h3')?.textContent?.toLowerCase() || '';
      const cat = el.getAttribute('data-category') || '';
      const matchText = !q || title.includes(q);
      const matchCat = active === 'all' || cat === active;
      el.style.display = (matchText && matchCat) ? '' : 'none';
    }
    // Sort
    const mode = sortSelect?.value || 'Sort: Featured';
    const visible = items.filter(el => el.style.display !== 'none');
    if (mode.includes('Low to High')) visible.sort((a,b) => (+a.getAttribute('data-price')) - (+b.getAttribute('data-price')));
    else if (mode.includes('High to Low')) visible.sort((a,b) => (+b.getAttribute('data-price')) - (+a.getAttribute('data-price')));
    else if (mode.includes('Newest')) visible.sort((a,b) => ((b.hasAttribute('data-new')?1:0) - (a.hasAttribute('data-new')?1:0)));
    // Re-append in order
    for (const el of visible) catalog.appendChild(el);
  }

  searchInput?.addEventListener('input', () => apply());
  sortSelect?.addEventListener('change', () => apply());
  filtersWrap?.addEventListener('click', (e) => {
    const t = e.target.closest('button[data-filter]');
    if (!t) return;
    filtersWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    t.classList.add('active');
    apply();
  });

  apply();
})();

// Cart interactions (cart.html)
(function() {
  const itemsWrap = document.getElementById('cartItems');
  if (!itemsWrap) return;
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');
  const discountEl = document.getElementById('cartDiscount');
  const promoInput = document.getElementById('promoCode');
  const promoMsg = document.getElementById('promoMsg');
  const applyBtn = document.getElementById('applyPromo');
  let promo = 0; // in dollars for simplicity; could be percent

  function recalc() {
    let subtotal = 0; let count = 0;
    itemsWrap.querySelectorAll('.cart-item').forEach(item => {
      const price = Number(item.getAttribute('data-price')) || 0;
      const qtyInput = item.querySelector('input[type="number"]');
      const qty = Math.max(1, Number(qtyInput.value) || 1);
      const line = price * qty;
      item.querySelector('.cart-line').textContent = line.toFixed(0);
      subtotal += line; count += qty;
    });
    const discount = Math.min(promo, subtotal);
    subtotalEl.textContent = subtotal.toFixed(0);
    discountEl.textContent = discount.toFixed(0);
    totalEl.textContent = (subtotal - discount).toFixed(0);
    countEl.textContent = count.toFixed(0);
  }

  itemsWrap.addEventListener('click', (e) => {
    const dec = e.target.closest('.cart-qty-dec');
    const inc = e.target.closest('.cart-qty-inc');
    const rm = e.target.closest('.cart-remove');
    if (dec || inc) {
      const item = e.target.closest('.cart-item');
      const input = item.querySelector('input[type="number"]');
      let v = Number(input.value) || 1;
      if (dec) v = Math.max(1, v - 1); else v = v + 1;
      input.value = v;
      recalc();
    }
    if (rm) {
      e.target.closest('.cart-item').remove();
      recalc();
    }
  });
  itemsWrap.addEventListener('input', (e) => {
    if (e.target.matches('input[type="number"]')) recalc();
  });

  applyBtn?.addEventListener('click', () => {
    const code = (promoInput?.value || '').trim().toUpperCase();
    if (!code) { promo = 0; promoMsg.textContent = ''; recalc(); return; }
    if (code === 'SAVE10') { promo = 10; promoMsg.textContent = 'Applied $10 discount.'; }
    else if (code === 'SAVE50') { promo = 50; promoMsg.textContent = 'Applied $50 discount.'; }
    else { promo = 0; promoMsg.textContent = 'Invalid code.'; }
    recalc();
  });

  recalc();
})();

// Chicku chatbot UI (site-wide)
(function() {
  const launcher = document.getElementById('chickuLauncher');
  const panel = document.getElementById('chickuPanel');
  const closeBtn = document.getElementById('chickuClose');
  const form = document.getElementById('chickuForm');
  const input = document.getElementById('chickuInput');
  const body = document.getElementById('chickuBody');
  if (!launcher || !panel) return;

  function open() { panel.classList.add('is-open'); input?.focus(); }
  function close() { panel.classList.remove('is-open'); }

  launcher.addEventListener('click', () => {
    if (panel.classList.contains('is-open')) close(); else open();
  });
  closeBtn?.addEventListener('click', close);

  form?.addEventListener('submit', () => {
    const text = (input?.value || '').trim();
    if (!text) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'chicku-msg user';
    userMsg.textContent = text;
    body?.appendChild(userMsg);
    input.value = '';
    body?.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
    setTimeout(() => {
      const bot = document.createElement('div');
      bot.className = 'chicku-msg bot';
      bot.textContent = 'Chicku here! I will answer once the LLM is connected.';
      body?.appendChild(bot);
      body?.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
    }, 500);
  });
})();


