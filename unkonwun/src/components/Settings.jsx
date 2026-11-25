export default function Settings({ settings, onChange, onBack, onClear }) {
  const set = (k, v) => onChange({ ...settings, [k]: v });

  return (
    <div className="settings-screen">
      <div className="settings-card">
        <p className="menu-kicker">SETTINGS</p>
        <h2>游戏设置</h2>

        <div className="setting-row">
          <span>字体大小</span>
          <div className="seg">
            {[0.95, 1, 1.1, 1.2].map((v) => (
              <button
                key={v}
                className={"seg-btn" + (settings.fontScale === v ? " on" : "")}
                onClick={() => set("fontScale", v)}
              >
                {Math.round(v * 100)}%
              </button>
            ))}
          </div>
        </div>

        <Toggle label="音效" value={settings.sfx} onChange={(v) => set("sfx", v)} />
        <Toggle label="背景音乐" value={settings.bgm} onChange={(v) => set("bgm", v)} />
        <Toggle label="文字动画" value={settings.anim} onChange={(v) => set("anim", v)} />

        <div className="setting-row">
          <span>清除当前存档</span>
          <button className="btn danger" onClick={onClear}>清除</button>
        </div>

        <div className="row-end">
          <button className="btn" onClick={onBack}>返回</button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <button className={"toggle" + (value ? " on" : "")} onClick={() => onChange(!value)}>
        <i />
      </button>
    </div>
  );
}
