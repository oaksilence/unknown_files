import { useEffect, useState } from "react";
import { Phone as PhoneIcon } from "lucide-react";

export default function Phone({ messages, title, logs }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("sms");
  const [seen, setSeen] = useState(messages.length);

  useEffect(() => {
    if (open) setSeen(messages.length);
  }, [open, messages.length]);

  const unread = Math.max(0, messages.length - seen);
  const hasLogs = Array.isArray(logs) && logs.length > 0;

  return (
    <>
      <button className="phone-fab" onClick={() => setOpen((v) => !v)}>
        <PhoneIcon size={22} />
        {unread > 0 && <span className="phone-dot">{unread}</span>}
      </button>

      {open && (
        <aside className="phone-panel">
          <div className="phone-status">
            <span>03:17</span>
            <span>信号 ▂▄▆</span>
          </div>

          <div className="phone-head">
            <strong>{title || "未知号码"}</strong>
            <button onClick={() => setOpen(false)}>收起</button>
          </div>

          {hasLogs && (
            <div className="phone-tabs">
              <button className={tab === "sms" ? "on" : ""} onClick={() => setTab("sms")}>短信</button>
              <button className={tab === "log" ? "on" : ""} onClick={() => setTab("log")}>航海日志</button>
            </div>
          )}

          {tab === "log" && hasLogs ? (
            <div className="phone-body log-body">
              {logs.map((l, i) => (
                <article key={i} className="log-entry">
                  <header>
                    <span className="log-date">{l.date}</span>
                    <span className="log-time">{l.time}</span>
                  </header>
                  <p>{l.text}</p>
                  {l.redacted && <span className="log-redacted">（此段记录被撕去）</span>}
                </article>
              ))}
            </div>
          ) : (
            <div className="phone-body">
              {messages.length === 0 && <p className="phone-empty">没有新短信。</p>}
              {messages.map((m) => (
                <div key={m.id} className="sms">
                  <span className="sms-from">{m.from}</span>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      )}
    </>
  );
}
