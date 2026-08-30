/* ============================================================
   Devesh Digital Studio — AI Review Generator
   Edit these 3 lines for a different business
   ============================================================ */
const BUSINESS_NAME   = "Devesh Digital Studio";
const BUSINESS_LOCATION = "Paota Pragpura, Rajasthan";
const GOOGLE_REVIEW_URL = "https://g.page/r/CdtoJ_IWkk5IEBM/review";

/* ============================================================
   Review content pools (Hinglish — human, warm, varied)
   ============================================================ */
const OPENERS = [
  `${BUSINESS_NAME} ke saath experience kaafi zabardast raha.`,
  `Bahut hi professional service mili ${BUSINESS_NAME} se.`,
  `Recently ${BUSINESS_NAME} se kaam karwaya aur bilkul satisfied hoon.`,
  `${BUSINESS_NAME} ki team ka kaam dekh kar dil khush ho gaya.`,
  `Agar aap ${BUSINESS_LOCATION} mein digital services dhoondh rahe hain, toh ${BUSINESS_NAME} best hai.`,
  `Ek dum shaandar service — ${BUSINESS_NAME} se better koi nahi.`,
  `${BUSINESS_NAME} ne mera kaam time se pehle complete kar diya.`,
  `Genuinely impressed hoon ${BUSINESS_NAME} ke professionalism se.`,
  `Maine kai jagah try kiya, lekin ${BUSINESS_NAME} jaisi service kahin nahi mili.`,
  `${BUSINESS_NAME} se pehli baar kaam karwaya aur ab yeh mera go-to studio ban gaya hai.`
];

const MIDDLES = [
  `Team ne har detail ka dhyan rakha aur result expectations se zyada accha nikla.`,
  `Unka communication clear tha aur pura process bahut smooth raha.`,
  `Quality of work truly premium hai, bilkul professional touch ke saath.`,
  `Staff bahut friendly hai aur patiently sab kuch samjhaya.`,
  `Turnaround time ekdum fast tha, phir bhi quality compromise nahi hui.`,
  `Pricing bhi reasonable hai aur value for money service milti hai.`,
  `Creative ideas aur modern approach unhe baaki se alag banate hain.`,
  `Har query ka jawab time pe milta hai, follow-up ki zaroorat nahi padti.`,
  `Design se leke delivery tak, sab kuch systematic aur transparent tha.`,
  `Ek baar brief diya aur baaki sab unhone khud handle kar liya, tension free experience.`
];

const CLOSERS = [
  `Highly recommend karta hoon sabko!`,
  `5 stars fully deserved hain.`,
  `Zaroor try karein, niraash nahi honge.`,
  `Dobara kaam ho toh inhi se karwaunga.`,
  `Best decision tha inke saath kaam karna.`,
  `Thank you ${BUSINESS_NAME} team!`,
  `Bahut bahut dhanyavaad puri team ko.`,
  `Ek number service, keep it up!`,
  `Aap bhi try karo, pakka pasand aayega.`,
  `Puri team ko dil se shukriya. 🙏`
];

/* Track which combinations were already used this session to avoid repeats */
let usedCombos = new Set();

function pickUnique(pool, avoidIndex){
  let idx = Math.floor(Math.random() * pool.length);
  if (pool.length > 1){
    let guard = 0;
    while(idx === avoidIndex && guard < 10){
      idx = Math.floor(Math.random() * pool.length);
      guard++;
    }
  }
  return idx;
}

function generateOneReview(){
  let combo, tries = 0;
  do{
    const oIdx = Math.floor(Math.random() * OPENERS.length);
    const mIdx = Math.floor(Math.random() * MIDDLES.length);
    const cIdx = Math.floor(Math.random() * CLOSERS.length);
    combo = `${oIdx}-${mIdx}-${cIdx}`;
    tries++;
  } while(usedCombos.has(combo) && tries < 40);

  usedCombos.add(combo);
  if (usedCombos.size > 80) usedCombos.clear(); // reset so it never runs dry

  const [oIdx, mIdx, cIdx] = combo.split('-').map(Number);
  return `${OPENERS[oIdx]} ${MIDDLES[mIdx]} ${CLOSERS[cIdx]}`;
}

function generateFiveReviews(){
  const seen = new Set();
  const out = [];
  let guard = 0;
  while(out.length < 5 && guard < 60){
    const text = generateOneReview();
    if(!seen.has(text)){
      seen.add(text);
      out.push(text);
    }
    guard++;
  }
  return out;
}

/* ============================================================
   DOM refs
   ============================================================ */
const generateBtn   = document.getElementById('generateBtn');
const resultsSection = document.getElementById('resultsSection');
const cardsGrid      = document.getElementById('cardsGrid');
const regenerateBtn  = document.getElementById('regenerateBtn');
const cardTemplate   = document.getElementById('cardTemplate');
const toast          = document.getElementById('toast');
const toastMsg       = document.getElementById('toastMsg');
const themeToggle     = document.getElementById('themeToggle');
const themeIcon       = document.getElementById('themeIcon');

/* ============================================================
   Render cards
   ============================================================ */
function renderCards(){
  const reviews = generateFiveReviews();
  cardsGrid.innerHTML = '';

  reviews.forEach((text) => {
    const node = cardTemplate.content.cloneNode(true);
    const card = node.querySelector('.review-card');
    card.querySelector('.review-text').textContent = text;

    card.querySelector('.btn-use').addEventListener('click', (e) => {
      useReview(text, e.currentTarget);
    });

    card.querySelector('.btn-card-refresh').addEventListener('click', (e) => {
      const newText = generateOneReview();
      const p = card.querySelector('.review-text');
      p.style.opacity = 0;
      setTimeout(() => {
        p.textContent = newText;
        p.style.opacity = 1;
        // rebind the use button to fresh text
        const useBtn = card.querySelector('.btn-use');
        const freshBtn = useBtn.cloneNode(true);
        useBtn.replaceWith(freshBtn);
        freshBtn.addEventListener('click', (ev) => useReview(newText, ev.currentTarget));
      }, 180);
      e.currentTarget.blur();
    });

    cardsGrid.appendChild(node);
  });
}

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
    resultsSection.classList.remove('d-none');
    loading.classList.add('d-none');
    content.classList.remove('d-none');
    generateBtn.classList.remove('is-loading');

    resultsSection.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 900);
});

regenerateBtn.addEventListener('click', () => {
  regenerateBtn.querySelector('i').style.transform = 'rotate(360deg)';
  renderCards();
  resultsSection.scrollIntoView({ behavior:'smooth', block:'start' });
});

/* ============================================================
   Copy + Open Google Review flow
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
  // Fallback for older / non-secure contexts
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
   Theme toggle (dark / light) — persisted in-session only
   ============================================================ */
function setTheme(mode){
  if(mode === 'light'){
    document.body.classList.add('light-mode');
    themeIcon.className = 'fa-solid fa-sun';
  }else{
    document.body.classList.remove('light-mode');
    themeIcon.className = 'fa-solid fa-moon';
  }
}

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light-mode');
  setTheme(isLight ? 'dark' : 'light');
});

// Respect system preference on first load
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
  setTheme('light');
}

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

const CONFETTI_COLORS = ['#E8B54D', '#F5D68A', '#C4497A', '#3ECF8E', '#F5EFE6'];

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
