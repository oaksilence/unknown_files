export default function MainMenu({ onStart, onContinue, onArchive, onSettings, hasSave }) {
  return (
    <div className="menu-screen">
      <div className="menu-glow" />
      <div className="menu-inner">
        <p className="menu-kicker">CASE FILE ARCHIVE</p>
        <h1 className="menu-title">THE UNKNOWN FILES</h1>
        <p className="menu-sub">Some truths are better left undiscovered.</p>

        <div className="menu-actions">
          <button className="btn primary" onClick={onStart}>开始调查</button>
          <button className="btn" disabled={!hasSave} onClick={onContinue}>继续游戏</button>
          <button className="btn" onClick={onArchive}>档案收藏</button>
          <button className="btn" onClick={onSettings}>游戏设置</button>
        </div>

        <p className="menu-foot">四个卷宗 · 四种调查方式 · 十六种结局</p>
      </div>
    </div>
  );
}
