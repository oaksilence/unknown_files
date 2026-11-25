import PixelArt from "./PixelArt.jsx";

export default function CaseSelect({ cases, states, onPick, onBack }) {
  return (
    <div className="cases-screen">
      <div className="cases-head">
        <div>
          <p className="menu-kicker">CASE SELECT</p>
          <h2>选择一个卷宗</h2>
        </div>
        <button className="btn" onClick={onBack}>返回</button>
      </div>

      <div className="case-grid">
        {cases.map((c) => {
          const cs = states[c.id];
          const state = !cs ? "未解密" : cs.ended ? "已归档" : "调查中";
          return (
            <article key={c.id} className="case-card" onClick={() => onPick(c.id)}>
              <div className="case-art"><PixelArt name={c.cover} /></div>
              <div className="case-body">
                <p className="case-state">{state}</p>
                <h3>{c.title}</h3>
                <p className="case-tag">{c.tagline}</p>
                <p className="case-intro">{c.intro.split("\n")[0]}</p>
                <div className="case-meta">
                  <span>危险等级 · {c.danger}</span>
                  <span className="case-go">进入 →</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
