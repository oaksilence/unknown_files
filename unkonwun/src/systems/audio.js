let ctx = null;
let sfxOn = false;
let bgmOn = false;
let ambient = null;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, dur, type, vol) {
  if (!sfxOn) return;
  const c = ac();
  if (!c) return;
  try {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.value = vol || 0.05;
    o.connect(g);
    g.connect(c.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.stop(c.currentTime + dur);
  } catch (e) {}
}

export function applyAudioSettings(settings) {
  sfxOn = !!settings.sfx;
  bgmOn = !!settings.bgm;
  if (!bgmOn) stopAmbient();
  else startAmbient();
}

export function play(name) {
  switch (name) {
    case "click": tone(420, 0.05, "triangle", 0.03); break;
    case "flip": tone(620, 0.08, "triangle", 0.04); break;
    case "clue": tone(880, 0.08, "sine", 0.05); setTimeout(() => tone(1320, 0.12, "sine", 0.045), 90); break;
    case "sms": tone(880, 0.07, "sine", 0.06); setTimeout(() => tone(1240, 0.09, "sine", 0.05), 100); break;
    case "hit": tone(300, 0.12, "square", 0.05); setTimeout(() => tone(450, 0.16, "square", 0.04), 80); break;
    case "miss": tone(140, 0.28, "sawtooth", 0.06); break;
    case "alarm": tone(120, 0.4, "sawtooth", 0.08); setTimeout(() => tone(92, 0.5, "sawtooth", 0.07), 280); break;
    case "death": tone(70, 1.2, "sawtooth", 0.11); setTimeout(() => tone(46, 1.4, "sine", 0.08), 240); break;
    case "good": [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.35, "sine", 0.05), i * 150)); break;
    default: break;
  }
}

function startAmbient() {
  if (!bgmOn || ambient) return;
  const c = ac();
  if (!c) return;
  try {
    const len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.32;
    ambient = c.createBufferSource();
    ambient.buffer = buf;
    ambient.loop = true;
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 720;
    const g = c.createGain();
    g.gain.value = 0.04;
    ambient.connect(lp);
    lp.connect(g);
    g.connect(c.destination);
    ambient.start();
  } catch (e) {
    ambient = null;
  }
}

function stopAmbient() {
  if (ambient) {
    try { ambient.stop(); } catch (e) {}
    ambient = null;
  }
}
