import { useEffect, useRef, useState } from "react";
import PixelArt from "./PixelArt.jsx";

function Rich({ text }) {
  if (!text) return null;
  const parts = String(text).split(/(『[^』]*』|「[^」]*」|\d{3,8})/g);
  return (
    <>
      {parts.map((p, i) =>
        /^(『|「|\d{3,8})/.test(p) ? (
          <span key={i} className="hl">{p}</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function StoryPanel({ node, image, dialogue, animate, onSkip }) {
  const [shown, setShown] = useState(0);
  const timer = useRef(null);
  const box = useRef(null);

  useEffect(() => {
    setShown(0);
    if (box.current) box.current.scrollTop = 0;
    if (!animate || !node?.text) { setShown((node?.text || "").length); return; }
    timer.current = setInterval(() => {
      setShown((n) => {
        if (n >= node.text.length) { clearInterval(timer.current); return n; }
        return n + 3;
      });
    }, 16);
    return () => clearInterval(timer.current);
  }, [node?.id, animate]);

  if (!node) return null;
  const text = node.text || "";
  const done = shown >= text.length;

  return (
    <section className="story-panel" ref={box}>
      {image && <PixelArt name={image} />}

      <div className="scene-line">
        <span className="scene-name">{node.scene}</span>
        {!done && <button className="skip-btn" onClick={() => { setShown(text.length); onSkip && onSkip(); }}>跳过</button>}
      </div>

      <div className="story-text">
        <Rich text={text.slice(0, shown)} />
        {!done && <span className="caret" />}
      </div>

      {dialogue && dialogue.text && (
        <div className="dialogue">
          <div className="dialogue-speaker">{dialogue.speaker}</div>
          <div className="dialogue-text">{dialogue.text}</div>
        </div>
      )}
    </section>
  );
}
