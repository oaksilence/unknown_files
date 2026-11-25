export default function ClueBoard({ clues, onPick }) {
  return (
    <aside className="clue-board">
      <div className="board-head">
        <h3>线索板</h3>
        <span>{clues.length}</span>
      </div>
      {clues.length === 0 && <p className="board-empty">还没有线索。仔细看，仔细听。</p>}
      <div className="clue-list">
        {clues.map((c) => (
          <button key={c.id} className="clue-card" onClick={() => onPick && onPick(c)}>
            <strong>{c.name}</strong>
            <span>{c.description}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
