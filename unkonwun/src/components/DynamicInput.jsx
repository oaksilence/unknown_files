import { useState } from "react";

export default function DynamicInput({ onSend, disabled, loading }) {
  const [text, setText] = useState("");

  const send = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText("");
  };

  return (
    <div className="dynamic-input">
      <input
        value={text}
        placeholder={loading ? "正在记录你的行动……" : "自由行动，例如：检查桌上的咖啡杯"}
        maxLength={100}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        disabled={disabled}
      />
      <button className="btn primary" onClick={send} disabled={disabled || loading}>
        {loading ? "……" : "执行"}
      </button>
    </div>
  );
}
