export default function EndingScreen({ ending, onRestart, onArchive }) {
  if (!ending) return null;
  const death = ending.type === "death";

  return (
    <div className="ending-screen">
      <div className={"ending-card " + (death ? "death" : "survive")}>
        <p className="menu-kicker">{death ? "SIGNAL LOST" : "CASE CLOSED"}</p>
        <h2>{ending.title}</h2>
        <p className="ending-text">{ending.text}</p>

        {ending.error && (
          <div className="ending-error">
            <strong>本次调查的关键错误</strong>
            <p>{ending.error}</p>
          </div>
        )}

        <div className="row-end">
          <button className="btn primary" onClick={onRestart}>重新调查</button>
          <button className="btn" onClick={onArchive}>返回档案馆</button>
        </div>
      </div>
    </div>
  );
}
