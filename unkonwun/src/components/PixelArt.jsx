const art = {
  lighthouse: (
    <svg viewBox="0 0 160 120" className="pixel">
      <rect width="160" height="120" fill="#1A1B26" />
      <rect y="92" width="160" height="28" fill="#24283B" />
      <rect x="70" y="24" width="20" height="68" fill="#2B3045" />
      <rect x="64" y="18" width="32" height="8" fill="#414868" />
      <rect x="72" y="8" width="16" height="10" fill="#E0AF68" />
      <rect x="88" y="10" width="52" height="4" fill="#7A5F33" />
      <rect x="96" y="16" width="44" height="3" fill="#5A4626" />
      <rect x="58" y="94" width="44" height="3" fill="#414868" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 160 120" className="pixel">
      <rect width="160" height="120" fill="#1A1B26" />
      <rect x="10" y="14" width="140" height="92" fill="#24283B" />
      <rect x="18" y="22" width="58" height="36" fill="#0F2A3A" />
      <rect x="84" y="22" width="58" height="36" fill="#0F2A3A" />
      <rect x="18" y="64" width="58" height="34" fill="#0F2A3A" />
      <rect x="84" y="64" width="58" height="34" fill="#0F2A3A" />
      <rect x="26" y="30" width="18" height="10" fill="#7DCFFF" />
      <rect x="92" y="30" width="24" height="3" fill="#7DCFFF" />
      <rect x="92" y="36" width="16" height="3" fill="#7DCFFF" />
      <circle cx="132" cy="76" r="5" fill="#F7768E" />
    </svg>
  ),
  console: (
    <svg viewBox="0 0 160 120" className="pixel">
      <rect width="160" height="120" fill="#1A1B26" />
      <rect x="20" y="20" width="120" height="70" fill="#24283B" />
      <rect x="30" y="30" width="100" height="40" fill="#0F2A3A" />
      <rect x="38" y="40" width="60" height="4" fill="#7DCFFF" />
      <rect x="38" y="50" width="40" height="4" fill="#7DCFFF" />
      <rect x="46" y="78" width="68" height="8" fill="#2B3045" />
      <rect x="60" y="92" width="40" height="4" fill="#414868" />
    </svg>
  ),
  cup: (
    <svg viewBox="0 0 160 120" className="pixel">
      <rect width="160" height="120" fill="#1A1B26" />
      <rect x="60" y="42" width="44" height="38" fill="#2B3045" />
      <rect x="104" y="52" width="9" height="16" fill="#2B3045" />
      <rect x="62" y="80" width="40" height="5" fill="#24283B" />
      <rect x="70" y="88" width="5" height="8" fill="#E0AF68" />
      <rect x="86" y="88" width="5" height="8" fill="#E0AF68" />
    </svg>
  ),
  storage: (
    <svg viewBox="0 0 160 120" className="pixel">
      <rect width="160" height="120" fill="#1A1B26" />
      <rect x="36" y="44" width="88" height="58" fill="#2B3045" />
      <rect x="36" y="34" width="88" height="12" fill="#414868" />
      <rect x="74" y="60" width="12" height="12" fill="#E0AF68" />
      <rect x="44" y="84" width="72" height="3" fill="#24283B" />
    </svg>
  ),
  tape: (
    <svg viewBox="0 0 160 120" className="pixel">
      <rect width="160" height="120" fill="#1A1B26" />
      <rect x="34" y="40" width="92" height="48" fill="#2B3045" />
      <circle cx="64" cy="64" r="12" fill="#1A1B26" />
      <circle cx="96" cy="64" r="12" fill="#1A1B26" />
      <rect x="52" y="86" width="56" height="6" fill="#E0AF68" />
    </svg>
  ),
  mirror: (
    <svg viewBox="0 0 160 120" className="pixel">
      <rect width="160" height="120" fill="#1A1B26" />
      <rect x="28" y="10" width="104" height="100" fill="#2B3045" />
      <rect x="34" y="16" width="92" height="88" fill="#20263A" />
      <rect x="46" y="30" width="10" height="60" fill="#414868" opacity="0.6" />
      <rect x="102" y="30" width="10" height="60" fill="#414868" opacity="0.6" />
      <rect x="70" y="46" width="20" height="26" fill="#7DCFFF" opacity="0.25" />
    </svg>
  ),
  lamp: (
    <svg viewBox="0 0 160 120" className="pixel">
      <rect width="160" height="120" fill="#1A1B26" />
      <circle cx="80" cy="58" r="34" fill="#3A2F1E" />
      <circle cx="80" cy="58" r="18" fill="#E0AF68" />
      <rect x="78" y="0" width="4" height="120" fill="#414868" opacity="0.35" />
      <rect x="0" y="56" width="160" height="4" fill="#414868" opacity="0.35" />
    </svg>
  )
};

export default function PixelArt({ name }) {
  if (!art[name]) return null;
  return <div className="pixel-wrap">{art[name]}</div>;
}
