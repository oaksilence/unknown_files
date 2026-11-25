export default function ChoicePanel({ choices, onPick }) {
  if (!choices || choices.length === 0) return null;
  return (
    <div className="choice-panel">
      {choices.map((c) => (
        <button key={c.id || c.text} className="choice-btn" onClick={() => onPick(c)}>
          <span className="choice-dot" />
          {c.text}
        </button>
      ))}
    </div>
  );
}
