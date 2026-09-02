/* ============================================================
   Devesh Studio — AI Review Generator
   Edit these 3 lines for a different business
   ============================================================ */
const BUSINESS_NAME   = "Devesh Studio";
const BUSINESS_LOCATION = "Paota Pragpura, Rajasthan";
const GOOGLE_REVIEW_URL = "https://g.page/r/CdtoJ_IWkk5IEBM/review";

/* ============================================================
   Review content pools (English — warm, human, varied)
   ============================================================ */
const OPENERS = [
  `My experience with ${BUSINESS_NAME} was genuinely excellent.`,
  `I recently got some work done at ${BUSINESS_NAME} and I'm really happy with it.`,
  `${BUSINESS_NAME} delivered a truly professional service from start to finish.`,
  `If you're looking for reliable photography services in ${BUSINESS_LOCATION}, ${BUSINESS_NAME} is the place to go.`,
  `I've worked with a few studios before, but ${BUSINESS_NAME} is on another level.`,
  `${BUSINESS_NAME} exceeded my expectations in every way.`,
  `Choosing ${BUSINESS_NAME} for my shoot turned out to be a great decision.`,
  `From the very first conversation, ${BUSINESS_NAME} felt like the right choice.`,
  `I can't say enough good things about my experience with ${BUSINESS_NAME}.`,
  `${BUSINESS_NAME} handled everything smoothly and professionally.`,
  `What a great experience working with ${BUSINESS_NAME}.`,
  `${BUSINESS_NAME} really impressed me with their attention to detail.`,
  `I had a fantastic experience getting my shoot done here at ${BUSINESS_NAME}.`,
  `Honestly, ${BUSINESS_NAME} is one of the best studios I've come across.`,
  `Walking into ${BUSINESS_NAME}, I immediately felt I was in good hands.`,
  `${BUSINESS_NAME} made the whole process so much easier than I expected.`
];

const MIDDLES = [
  `The team paid attention to every little detail, and the final result went beyond what I expected.`,
  `Communication was clear throughout, and the whole process felt smooth and hassle-free.`,
  `The quality of the photos and videos is genuinely premium, with a real professional touch.`,
  `The staff were friendly and patiently explained everything along the way.`,
  `The turnaround time was quick without compromising on quality at all.`,
  `Pricing was fair and honestly great value for the quality delivered.`,
  `Their creative ideas and storytelling really set them apart from other studios.`,
  `Every question I had was answered promptly, no constant follow-ups needed.`,
  `From the shoot to editing, everything was organized and transparent.`,
  `I gave them a simple brief and they took care of the rest without any stress on my end.`,
  `They listened carefully to what I wanted and translated it perfectly into the final work.`,
  `Everything was handled in a timely, organized manner from beginning to end.`,
  `The whole team was courteous, skilled, and clearly knew what they were doing.`,
  `They went out of their way to make sure I was completely satisfied with the outcome.`,
  `The equipment and setup felt modern, and it showed in the final quality.`,
  `Even with a tight deadline, they still managed to deliver top-notch work.`
];

const CLOSERS = [
  `Highly recommend them to everyone!`,
  `Fully deserving of 5 stars.`,
  `Definitely give them a try, you won't be disappointed.`,
  `I'll be coming back for sure next time.`,
  `Working with them was one of my best decisions.`,
  `Thank you to the whole team at ${BUSINESS_NAME}!`,
  `Many thanks to the entire team for their hard work.`,
  `Top-notch service, keep up the great work!`,
  `Go ahead and try them, you'll love the results.`,
  `Grateful to the whole team for such great support.`,
  `Would happily recommend this place to friends and family.`,
  `Five stars well earned.`,
  `This is exactly the kind of studio everyone should try.`,
  `Couldn't have asked for a better outcome.`,
  `Will definitely be a returning customer.`,
  `Truly a great find in ${BUSINESS_LOCATION}.`
];

const EXTRAS = [
  `The location in ${BUSINESS_LOCATION} was also easy to find and park near.`,
  `Booking an appointment was quick and straightforward too.`,
  `They were also very accommodating with last-minute changes.`,
  `The whole studio felt clean, organized, and welcoming.`,
  `Even follow-up support after delivery was excellent.`,
  `They clearly take real pride in their craft.`,
  `It's rare to find this level of consistency in service quality.`,
  `They made a slightly stressful day feel completely effortless.`
];

/* ============================================================
   Generation logic
   ============================================================ */
let usedCombos = new Set();

function randInt(max){ return Math.floor(Math.random() * max); }

function generateOneReview(){
  let combo, tries = 0;
  let oIdx, mIdx, cIdx, useExtra, eIdx, extraFirst;

  do{
    oIdx = randInt(OPENERS.length);
    mIdx = randInt(MIDDLES.length);
    cIdx = randInt(CLOSERS.length);
    useExtra = Math.random() < 0.55;
    eIdx = useExtra ? randInt(EXTRAS.length) : -1;
    extraFirst = Math.random() < 0.5;
    combo = `${oIdx}-${mIdx}-${cIdx}-${eIdx}-${extraFirst}`;
    tries++;
  } while(usedCombos.has(combo) && tries < 50);

  usedCombos.add(combo);
  if (usedCombos.size > 300) usedCombos.clear();

  const parts = [OPENERS[oIdx]];
  if (useExtra && extraFirst){
    parts.push(EXTRAS[eIdx]);
    parts.push(MIDDLES[mIdx]);
  } else if (useExtra){
    parts.push(MIDDLES[mIdx]);
    parts.push(EXTRAS[eIdx]);
  } else {
    parts.push(MIDDLES[mIdx]);
  }
  parts.push(CLOSERS[cIdx]);

  return parts.join(' ');
}

function generateFiveReviews(){
  const seen = new Set();
  const out = [];
  let guard = 0;
  while(out.length < 5 && guard < 80){
    const text = generateOneReview();
    if(!seen.has(text)){
      seen.add(text);
      out.push(text);
    }
    guard++;
  }
  return out;
}

function randomRating(){
  // Mostly 5 stars, occasionally 4 — feels authentic
  return Math.random() < 0.78 ? 5 : 4;
}

function starsHTML(rating){
  let html = '';
  for(let i = 0; i < 5; i++){
    html += `<i class="fa-solid fa-star" style="opacity:${i < rating ? 1 : .25}"></i>`;
  }
  return html;
}

/* ============================================================
   DOM refs
   ============================================================ */
const generateBtn        = document.getElementById('generateBtn');
const reviewsSection      = document.getElementById('reviewsSection');
const reviewsPlaceholder  = document.getElementById('reviewsPlaceholder');
const cardsGrid           = document.getElementById('cardsGrid');
const carouselDots        = document.getElementById('carouselDots');
const regenerateBtn       = document.getElementById('regenerateBtn');
const cardTemplate        = document.getElementById('cardTemplate');
const toast               = document.getElementById('toast');
const toastMsg            = document.getElementById('toastMsg');

/* ============================================================
   Render cards
   ============================================================ */
function renderCards(){
  const reviews = generateFiveReviews();
  cardsGrid.innerHTML = '';
  carouselDots.innerHTML = '';

  reviews.forEach((text, i) => {
    const node = cardTemplate.content.cloneNode(true);
    const card = node.querySelector('.review-card');
    const rating = randomRating();

    card.querySelector('.review-text').textContent = text;
    card.querySelector('.card-stars').innerHTML = starsHTML(rating);

    if (i === 0){
      card.querySelector('.most-popular').classList.remove('d-none');
    }

    card.querySelector('.btn-use').addEventListener('click', (e) => {
      useReview(text, e.currentTarget);
    });

    card.querySelector('.btn-card-refresh').addEventListener('click', (e) => {
      const newText = generateOneReview();
      const newRating = randomRating();
      const p = card.querySelector('.review-text');
      p.style.opacity = 0;
      setTimeout(() => {
        p.textContent = newText;
        card.querySelector('.card-stars').innerHTML = starsHTML(newRating);
        p.style.opacity = 1;
        const useBtn = card.querySelector('.btn-use');
        const freshBtn = useBtn.cloneNode(true);
        useBtn.replaceWith(freshBtn);
        freshBtn.addEventListener('click', (ev) => useReview(newText, ev.currentTarget));
      }, 180);
      e.currentTarget.blur();
    });

    cardsGrid.appendChild(node);

    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => {
      const cardEl = cardsGrid.children[i];
      cardsGrid.scrollTo({ left: cardEl.offsetLeft - 24, behavior:'smooth' });
    });
    carouselDots.appendChild(dot);
  });
}

/* Sync carousel dots with scroll position on mobile */
let scrollRAF = null;
cardsGrid.addEventListener('scroll', () => {
  if (scrollRAF) return;
  scrollRAF = requestAnimationFrame(() => {
    scrollRAF = null;
    const cards = Array.from(cardsGrid.children);
    if (!cards.length) return;
    const center = cardsGrid.scrollLeft + cardsGrid.clientWidth / 2;
    let closest = 0, closestDist = Infinity;
    cards.forEach((c, i) => {
      const dist = Math.abs((c.offsetLeft + c.offsetWidth / 2) - center);
      if (dist < closestDist){ closestDist = dist; closest = i; }
    });
    const dots = carouselDots.querySelectorAll('.dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === closest));
  });
});

/* ============================================================
   Generate button flow
   ============================================================ */
generateBtn.addEventListener('click', () => {
  const content = generateBtn.querySelector('.btn-content');
  const loading = generateBtn.querySelector('.btn-loading');

  generateBtn.classList.add('is-loading');
  content.classList.add('d-none');
  loading.classList.remove('d-none');

  setTimeout(() => {
    renderCards();
    reviewsPlaceholder.classList.add('d-none');
    reviewsSection.classList.remove('d-none');
    loading.classList.add('d-none');
    content.classList.remove('d-none');
    generateBtn.classList.remove('is-loading');

    reviewsSection.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 900);
});

regenerateBtn.addEventListener('click', () => {
  regenerateBtn.querySelector('i').style.transform = 'rotate(360deg)';
  renderCards();
  reviewsSection.scrollIntoView({ behavior:'smooth', block:'start' });
});

/* ============================================================
   Copy + Open Google Review flow (Use This Review button)
   ============================================================ */
async function useReview(text, buttonEl){
  const originalHTML = buttonEl.innerHTML;

  try{
    await copyToClipboard(text);
  }catch(err){
    showToast('Could not copy — please copy manually', false);
    return;
  }

  buttonEl.classList.add('is-copied');
  buttonEl.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';

  showToast('Review Copied Successfully', true);
  fireConfetti();

  setTimeout(() => {
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener');
    setTimeout(() => {
      buttonEl.classList.remove('is-copied');
      buttonEl.innerHTML = originalHTML;
    }, 1600);
  }, 500);
}

function copyToClipboard(text){
  if (navigator.clipboard && window.isSecureContext){
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try{
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('execCommand failed'));
    }catch(err){
      reject(err);
    }
  });
}

/* ============================================================
   Toast notification
   ============================================================ */
let toastTimer = null;
function showToast(msg, success = true){
  toastMsg.textContent = msg;
  toast.querySelector('i').className = success ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
  toast.style.background = success
    ? 'linear-gradient(120deg,#1FA06A,#2FBF80)'
    : 'linear-gradient(120deg,#B23A4E,#D9536A)';

  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ============================================================
   Mobile nav
   ============================================================ */
const navBurger = document.getElementById('navBurger');
const navMobilePanel = document.getElementById('navMobilePanel');

navBurger.addEventListener('click', () => {
  const isOpen = navMobilePanel.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  navBurger.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

navMobilePanel.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobilePanel.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    navBurger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

/* ============================================================
   Confetti burst (lightweight, dependency-free)
   ============================================================ */
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiRAF = null;

function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const CONFETTI_COLORS = ['#FF8A3D', '#FFC285', '#E8592B', '#33C98A', '#FFF3E6'];

function fireConfetti(){
  const count = 70;
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.35;

  for(let i = 0; i < count; i++){
    confettiParticles.push({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 1.4) * 12,
      size: 5 + Math.random() * 5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 14,
      gravity: 0.32 + Math.random() * 0.12,
      life: 0,
      maxLife: 70 + Math.random() * 30
    });
  }

  if(!confettiRAF){ animateConfetti(); }
}

function animateConfetti(){
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles.forEach(p => {
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spin;
    p.life++;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  });

  confettiParticles = confettiParticles.filter(p => p.life < p.maxLife);

  if(confettiParticles.length > 0){
    confettiRAF = requestAnimationFrame(animateConfetti);
  }else{
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiRAF = null;
  }
}
