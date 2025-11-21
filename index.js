// index.js — Simulasi + buka WhatsApp (aman)
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const bar = document.getElementById('bar');
const progressWrap = document.getElementById('progressWrap');
const message = document.getElementById('message');
const sub = document.getElementById('sub');
const stat = document.getElementById('stat');
const tick = document.getElementById('tick');
const phoneInput = document.getElementById('phone');
const textInput = document.getElementById('messageText');

let running = false;

function normalizeNumber(raw) {
  // Hapus spasi, tanda plus, dan non-digit
  let s = String(raw).trim().replace(/\s+/g,'').replace(/^\+/, '').replace(/[^\d]/g,'');
  if (!s) return '';
  // Jika mulai 0 -> ganti ke 62 (Indonesia)
  if (s.startsWith('0')) s = '62' + s.slice(1);
  return s;
}

function openWhatsApp(phone, text) {
  const encoded = encodeURIComponent(text || '');
  // Preferensi: gunakan wa.me (works baik di mobile). Untuk desktop: buka web.whatsapp.com/send
  const mobileUrl = `https://wa.me/${phone}?text=${encoded}`;
  const webUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  // Buka di tab baru; browser/OS akan handle yang cocok (mobile app / web)
  // Jika user agent terlihat desktop, buka web.whatsapp
  const isDesktop = /Windows|Macintosh|Linux/.test(navigator.userAgent) && !/Android|iPhone|iPad/.test(navigator.userAgent);
  try {
    window.open(isDesktop ? webUrl : mobileUrl, '_blank');
  } catch (e) {
    // fallback
    window.location.href = mobileUrl;
  }
}

function startSimulation() {
  if (running) return;
  const rawNum = phoneInput.value || '';
  const phone = normalizeNumber(rawNum);
  if (!phone) {
    message.textContent = 'Masukkan nomor valid dulu bro!';
    return;
  }
  running = true;
  stat.textContent = 'running';
  progressWrap.style.display = 'block';
  bar.style.width = '0%';
  tick.classList.remove('ok');
  message.textContent = 'Memproses...';
  sub.textContent = 'Nomor: ' + rawNum;

  // Fake progress
  let p = 0;
  function step() {
    if (!running) return;
    p += Math.floor(Math.random()*18) + 6; // increment acak
    if (p >= 100) {
      p = 100;
      bar.style.width = p + '%';
      setTimeout(() => finishSimulation(phone), 400);
    } else {
      bar.style.width = p + '%';
      setTimeout(step, 250 + Math.random()*220);
    }
  }
  setTimeout(step, 200);
}

function finishSimulation(phone) {
  running = false;
  stat.textContent = 'done';
  progressWrap.style.display = 'none';
  bar.style.width = '0%';
  tick.classList.add('ok');
  message.textContent = 'Proses selesai';
  sub.textContent = 'Membuka WhatsApp... (kamu perlu menekan kirim di WhatsApp jika perlu)';
  // Buka WhatsApp dengan pesan
  const text = textInput.value || 'Assalamualaikum';
  openWhatsApp(phone, text);
}

function resetSimulation() {
  running = false;
  stat.textContent = 'idle';
  progressWrap.style.display = 'none';
  bar.style.width = '0%';
  tick.classList.remove('ok');
  message.textContent = 'READY';
  sub.textContent = 'Tekan KIRIM untuk memulai simulasi';
}

sendBtn.addEventListener('click', startSimulation);
resetBtn.addEventListener('click', resetSimulation);

// Enter to send when focus on input
phoneInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') startSimulation(); });
textInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' && (e.ctrlKey||e.metaKey)) startSimulation(); });
