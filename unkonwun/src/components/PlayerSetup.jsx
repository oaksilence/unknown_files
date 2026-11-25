import { useState } from "react";

const GENDERS = ["男性", "女性", "不透露"];

export default function PlayerSetup({ player, onDone, onBack }) {
  const [name, setName] = useState(player?.name || "");
  const [gender, setGender] = useState(player?.gender || "不透露");
  const [error, setError] = useState("");

  const submit = () => {
    const n = name.trim();
    if (!n) { setError("请先写下你的名字。"); return; }
    onDone({ name: n.slice(0, 12), gender });
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <p className="menu-kicker">SUBJECT PROFILE</p>
        <h2>调查员档案</h2>
        <p className="setup-desc">
          档案会决定卷宗里别人怎么称呼你。之后可以随时回来修改。
        </p>

        <label className="field">
          <span>姓名</span>
          <input
            value={name}
            maxLength={12}
            placeholder="例如：林"
            onChange={(e) => { setName(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </label>

        <div className="field">
          <span>性别</span>
          <div className="seg">
            {GENDERS.map((g) => (
              <button
                key={g}
                className={"seg-btn" + (gender === g ? " on" : "")}
                onClick={() => setGender(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="err">{error}</p>}

        <div className="row-end">
          <button className="btn" onClick={onBack}>返回</button>
          <button className="btn primary" onClick={submit}>建立档案</button>
        </div>
      </div>
    </div>
  );
}
