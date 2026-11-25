import { useRef, useState } from "react";

export default function InteractivePanel({ ui, onReveal, onPuzzle, onCard, onRadar, onSonar, feedback, round, resources, targetAngle }) {
  if (!ui) return null;
  if (ui.type === "camera") return <Camera ui={ui} onReveal={onReveal} />;
  if (ui.type === "keypad") return <Keypad ui={ui} onPuzzle={onPuzzle} feedback={feedback} />;
  if (ui.type === "cards") return <Cards ui={ui} onCard={onCard} round={round} feedback={feedback} />;
  if (ui.type === "radar") return <Radar ui={ui} onRadar={onRadar} feedback={feedback} resources={resources} targetAngle={targetAngle} />;
  if (ui.type === "sonar") return <Sonar ui={ui} onSonar={onSonar} feedback={feedback} />;
  return null;
}

function Camera({ ui, onReveal }) {
  const [view, setView] = useState(ui.views[0].id);
  const current = ui.views.find((v) => v.id === view) || ui.views[0];
  return (
    <div className="camera-ui">
      <div className="camera-tabs">
        {ui.views.map((v) => (
          <button key={v.id} className={"cam-tab" + (v.id === view ? " on" : "")} onClick={() => setView(v.id)}>
            {v.name}
          </button>
        ))}
      </div>
      <div className="camera-screen">
        <div className="camera-grid" />
        <div className="camera-scan" />
        <span className="cam-tag">REC ● CAM-0{ui.views.findIndex((v) => v.id === view) + 1}</span>
        <span className="cam-time">03:17:0{ui.views.findIndex((v) => v.id === view) + 2}</span>
        {current.hotspots.map((h) => (
          <button
            key={h.id}
            className="hotspot"
            style={{ left: h.x + "%", top: h.y + "%", width: h.w + "%", height: h.h + "%" }}
            title={h.label}
            onClick={() => onReveal(h)}
          />
        ))}
      </div>
      <p className="cam-hint">点击画面里的可疑位置。切换视角，必要时多看几路。</p>
    </div>
  );
}

function Keypad({ ui, onPuzzle, feedback }) {
  const [code, setCode] = useState("");
  const press = (n) => setCode((c) => (c.length < 8 ? c + n : c));
  return (
    <div className="keypad-ui">
      <div className="keypad-top">
        <span>{ui.name}</span>
        <span className="keypad-dots">{"●".repeat(code.length).padEnd(8, "○")}</span>
      </div>
      <div className="keypad-display">{code || "____"}</div>
      <div className="keypad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} onClick={() => press(String(n))}>{n}</button>
        ))}
        <button className="soft" onClick={() => setCode("")}>清除</button>
        <button onClick={() => press("0")}>0</button>
        <button className="ok" onClick={() => { onPuzzle(code); setCode(""); }}>确认</button>
      </div>
      {feedback && <p className={"keypad-feedback " + (feedback.ok ? "ok" : "bad")}>{feedback.text}</p>}
      {ui.hint && <p className="keypad-hint">提示：{ui.hint}</p>}
    </div>
  );
}

const SUITS = { heart: "♥", spade: "♠", diamond: "♦", club: "♣", joker: "★" };

function Cards({ ui, onCard, round, feedback }) {
  const [flipped, setFlipped] = useState({});
  const r = ui.rounds[Math.min(round || 0, ui.rounds.length - 1)];

  const pick = (card) => {
    if (flipped[card.id]) return;
    setFlipped((f) => ({ ...f, [card.id]: true }));
    setTimeout(() => onCard(card.id), 520);
  };

  return (
    <div className="cards-ui">
      <div className="cards-head">
        <span>第 {Math.min((round || 0) + 1, ui.rounds.length)} / {ui.rounds.length} 局</span>
        <span className="cards-hint">{r ? r.hint : ""}</span>
      </div>

      <div className="deck">
        {ui.deck.map((card) => (
          <button
            key={card.id}
            className={"pcard" + (flipped[card.id] ? " flipped" : "")}
            onClick={() => pick(card)}
          >
            <span className="pcard-inner">
              <span className="pface back">?</span>
              <span className={"pface front " + card.color}>
                {SUITS[card.suit]} {card.rank}
              </span>
            </span>
          </button>
        ))}
      </div>

      {feedback && <p className={"keypad-feedback " + (feedback.ok ? "ok" : "bad")}>{feedback.text}</p>}
      <p className="cam-hint">手机里的提示会告诉你该翻哪一张。翻错不是没有代价的。</p>
    </div>
  );
}

function Radar({ ui, onRadar, feedback, targetAngle }) {
  const [angle, setAngle] = useState("");
  const dial = useRef(null);

  const clickDial = (e) => {
    const rect = dial.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    setAngle(String(Math.round(deg)));
  };

  return (
    <div className="radar-ui">
      <div className="radar" ref={dial} onClick={clickDial}>
        <div className="radar-sweep" />
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="ring r3" />
        <span className="radar-n">N</span>
        <span className="radar-e">E</span>
        <span className="radar-s">S</span>
        <span className="radar-w">W</span>
        {ui.visible !== false && <span className="radar-blip" style={{ transform: "rotate(" + (targetAngle || ui.showAngle || 0) + "deg) translateY(-86px)" }} />}
      </div>

      <div className="radar-controls">
        <input
          value={angle}
          placeholder="输入方位角度"
          onChange={(e) => setAngle(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
          onKeyDown={(e) => e.key === "Enter" && onRadar(Number(angle))}
        />
        <button className="btn primary" onClick={() => onRadar(Number(angle))}>防空炮击</button>
      </div>

      {feedback && <p className={"keypad-feedback " + (feedback.ok ? "ok" : "bad")}>{feedback.text}</p>}
      <p className="cam-hint">点击圆盘选择方位，或直接输入角度。无线电里的方位是唯一的线索。</p>
    </div>
  );
}

function Sonar({ ui, onSonar, feedback }) {
  return (
    <div className="sonar-ui">
      <div className="sonar">
        <div className="sonar-sweep" />
        <div className="sonar-ring r1" />
        <div className="sonar-ring r2" />
        {ui.points.map((p, i) => (
          <button
            key={i}
            className="sonar-blip"
            style={{ left: p.x + "%", top: p.y + "%" }}
            title={p.label}
            onClick={() => onSonar(i)}
          />
        ))}
      </div>
      {feedback && <p className={"keypad-feedback " + (feedback.ok ? "ok" : "bad")}>{feedback.text}</p>}
      <p className="cam-hint">四个光点里只有一个通向海面。点错，就不会有第二次。</p>
    </div>
  );
}
