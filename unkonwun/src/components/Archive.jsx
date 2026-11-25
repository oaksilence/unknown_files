import { caseStats } from "../games/index.js";

export default function Archive({ cases, state, onBack }) {
  const stats = cases.map((c) => ({ def: c, s: caseStats(c) }));

  const totalEndings = stats.reduce((n, x) => n + x.s.endings, 0);
  const totalClues = stats.reduce((n, x) => n + x.s.clues, 0);
  const totalDeaths = stats.reduce((n, x) => n + x.s.deaths, 0);
  const totalSurvives = stats.reduce((n, x) => n + x.s.survives, 0);

  const unlocked = state.archive.endings || [];
  const collected = state.archive.clues || [];
  const unlockedDeaths = cases.reduce(
    (n, c) =>
      n +
      Object.values(c.endings || {}).filter(
        (e) => e.type === "death" && unlocked.includes(c.id + ":" + e.id)
      ).length,
    0
  );

  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  return (
    <div className="archive-screen">
      <div className="cases-head">
        <div>
          <p className="menu-kicker">ARCHIVE</p>
          <h2>档案收藏</h2>
        </div>
        <button className="btn" onClick={onBack}>返回</button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <strong>{unlocked.length}<span>/{totalEndings}</span></strong>
          <p>已解锁结局</p>
          <div className="bar"><i style={{ width: pct(unlocked.length, totalEndings) + "%" }} /></div>
        </div>
        <div className="stat-card">
          <strong>{unlockedDeaths}<span>/{totalDeaths}</span></strong>
          <p>死亡结局</p>
          <div className="bar death"><i style={{ width: pct(unlockedDeaths, totalDeaths) + "%" }} /></div>
        </div>
        <div className="stat-card">
          <strong>{unlocked.length - unlockedDeaths}<span>/{totalSurvives}</span></strong>
          <p>生存结局</p>
          <div className="bar survive"><i style={{ width: pct(unlocked.length - unlockedDeaths, totalSurvives) + "%" }} /></div>
        </div>
        <div className="stat-card">
          <strong>{collected.length}<span>/{totalClues}</span></strong>
          <p>已收集线索</p>
          <div className="bar"><i style={{ width: pct(collected.length, totalClues) + "%" }} /></div>
        </div>
      </div>

      <div className="archive-grid">
        {stats.map(({ def, s }) => {
          const mine = unlocked.filter((x) => x.startsWith(def.id + ":"));
          const myClues = collected.filter((x) => x.startsWith(def.id + ":"));
          return (
            <section key={def.id} className="archive-card">
              <h3>{def.title}</h3>
              <p className="archive-meta">
                {state.cases[def.id]
                  ? state.cases[def.id].ended
                    ? "已归档"
                    : "调查中"
                  : "未解密"}
              </p>

              <div className="mini-stat">
                <span>结局 {mine.length}/{s.endings}</span>
                <div className="bar"><i style={{ width: pct(mine.length, s.endings) + "%" }} /></div>
              </div>
              <div className="mini-stat">
                <span>线索 {myClues.length}/{s.clues}</span>
                <div className="bar"><i style={{ width: pct(myClues.length, s.clues) + "%" }} /></div>
              </div>

              <div className="ending-list">
                {Object.values(def.endings || {}).map((e) => {
                  const has = unlocked.includes(def.id + ":" + e.id);
                  return (
                    <div key={e.id} className={"ending-item" + (has ? "" : " locked")}>
                      <span className={"tag " + e.type}>{e.type === "death" ? "死亡" : "生存"}</span>
                      <strong>{has ? e.title : "？？？？？"}</strong>
                      <p>{has ? e.hint || "" : "尚未解锁"}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
