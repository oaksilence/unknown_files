import ClueBoard from "./ClueBoard.jsx";
import StoryPanel from "./StoryPanel.jsx";
import ChoicePanel from "./ChoicePanel.jsx";
import DynamicInput from "./DynamicInput.jsx";
import InteractivePanel from "./InteractivePanel.jsx";
import Phone from "./Phone.jsx";

export default function GameLayout({
  caseDef,
  node,
  cs,
  image,
  dialogue,
  extra,
  loading,
  feedback,
  targetAngle,
  anim = true,
  onChoose,
  onFree,
  onReveal,
  onPuzzle,
  onCard,
  onRadar,
  onSonar,
  onBack,
  onRestart,
  onArchive,
  onPickClue
}) {
  if (!node) return null;

  return (
    <div className="game-screen">
      <header className="game-top">
        <button className="ghost-btn" onClick={onBack}>← 档案馆</button>
        <div className="game-title">
          <h1>{caseDef.title}</h1>
          <p>{caseDef.subtitle}</p>
        </div>
        <div className="game-top-right">
          <button className="ghost-btn" onClick={onArchive}>结局图鉴</button>
          <button className="ghost-btn" onClick={onRestart}>重新调查</button>
        </div>
      </header>

      <div className="game-grid">
        <ClueBoard clues={cs.clues} onPick={onPickClue} />

        <main className="story-column">
          <StoryPanel node={{ ...node, text: node.text }} image={image} dialogue={dialogue} animate={anim} />

          {extra && (
            <div className="extra-narrative">
              <p>{extra.text}</p>
              {extra.dialogue && extra.dialogue.text && (
                <div className="dialogue">
                  <div className="dialogue-speaker">{extra.dialogue.speaker}</div>
                  <div className="dialogue-text">{extra.dialogue.text}</div>
                </div>
              )}
            </div>
          )}

          <InteractivePanel
            ui={node.ui}
            onReveal={onReveal}
            onPuzzle={onPuzzle}
            onCard={onCard}
            onRadar={onRadar}
            onSonar={onSonar}
            feedback={feedback}
            round={cs.flags["_round_" + node.id] || 0}
            resources={cs.resources}
            targetAngle={targetAngle}
          />

          <ChoicePanel
            choices={(node.choices || []).filter((c) => {
              if (c.requireFlag && !cs.flags[c.requireFlag]) return false;
              if (c.requireClue && !cs.clues.some((x) => x.id === c.requireClue)) return false;
              return true;
            })}
            onPick={onChoose}
          />

          <DynamicInput onSend={onFree} disabled={loading} loading={loading} />
        </main>

        <aside className="side-rail">
          <div className="rail-card">
            <h4>卷宗状态</h4>
            <p>危险等级 · {caseDef.danger}</p>
            <p>已发现线索 · {cs.clues.length}</p>
            <p>调查进度 · {cs.progress}</p>
            {cs.resources && (
              <p>食物 {cs.resources.food} · 水 {cs.resources.water} · 电 {cs.resources.power} · 材料 {cs.resources.material}</p>
            )}
          </div>
          <div className="rail-card">
            <h4>调查提示</h4>
            <p>切换监控视角，检查每一处细节。</p>
            <p>未知号码的短信，往往比画面更早一步。</p>
          </div>
          <div className="rail-card muted">
            <h4>AI 叙事</h4>
            <p>断网时会自动切换本地剧情，不影响通关。</p>
          </div>
        </aside>
      </div>

      <Phone messages={cs.phone || []} logs={caseDef.logs} title="未知号码" />
    </div>
  );
}
