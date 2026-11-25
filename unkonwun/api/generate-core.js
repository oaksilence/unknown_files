const CASES = {
  lighthouse: {
    title: "灰烬灯塔",
    premise:
      "七年前，海边灯塔的管理员失踪。玩家收到一封没有寄件人的邮件，附件是一张旧照片，照片里的监控屏幕显示拍摄者正站在玩家身后。玩家来到废弃灯塔，所有监控仍在运行，手机不断收到未知号码的短信。",
    mechanics: "监控切换、数字密码盘、手机短信推理。",
    images: ["lighthouse", "camera", "cup", "tape", "lamp"]
  },
  rabbit: {
    title: "坠入兔子洞",
    premise:
      "玩家进入一座没有出口的庄园，所有人遵守荒诞规则，一只柴郡猫通过手机给出真假难辨的谜语，扑克牌阵列藏着离开的方法。",
    mechanics: "翻牌阵列、多轮规则博弈、真假规则判断。",
    images: ["rabbit", "cat", "cards", "mirror"]
  },
  island: {
    title: "荒岛二十日",
    premise:
      "航行事故后，玩家漂到一座地图上不存在的岛。无线电时断时续，夜里海面和丛林里有东西靠近，岛上似乎藏着某项被掩盖的实验。",
    mechanics: "CSS 雷达防守、资源管理、方位判断。",
    images: ["island", "radar", "radio"]
  },
  nautilus: {
    title: "鹦鹉螺号",
    premise:
      "临时调查员登上深海潜艇「鹦鹉螺号」，调查异常声呐区域。船员陆续失联，船载 AI 出现异常，手机里的航海日志日期与潜艇时间矛盾。",
    mechanics: "声呐定位、航海日志推理、日期密码。",
    images: ["submarine", "sonar", "log"]
  }
};

const SCHEMA = `{
  "narrative": "180-260字剧情，第二人称，有环境与心理描写",
  "dialogue": { "speaker": "说话人", "text": "台词，没有则 text 为空字符串" },
  "choices": [
    { "id": "c1", "text": "选项文字", "action": "英文动作标识" }
  ],
  "newClues": [ { "id": "clue_x", "name": "线索名", "description": "线索描述" } ],
  "phoneMessage": { "sender": "未知号码", "text": "短信内容，没有则 text 为空" },
  "scene": "场景标识",
  "suggestedRisk": "low | medium | high"
}`;

function buildPrompt(caseId, player, storyState, userAction) {
  const c = CASES[caseId] || CASES.lighthouse;
  return [
    "你是悬疑文字冒险游戏的叙事引擎，正在为课程项目《THE UNKNOWN FILES：未知档案》生成内容。",
    "卷宗：" + c.title,
    "设定：" + c.premise,
    "本卷玩法：" + c.mechanics,
    "可用图片键：" + c.images.join(", "),
    "玩家：" + (player.name || "调查员") + "（" + (player.gender || "未透露") + "）",
    "当前进度：" + (storyState.progress || 0),
    "已获得线索：" + ((storyState.clues || []).map((x) => x.name).join("；") || "无"),
    "最近行动：" + (storyState.history || []).slice(-4).map((h) => h.action).join(" → "),
    "玩家本次行动：" + userAction,
    "",
    "要求：",
    "1. 只输出 JSON，结构严格如下：" + SCHEMA,
    "2. choices 恰好三条，具体可执行，中文，不要出现英文命令。",
    "3. 不要生成密码、答案或让玩家直接通关；解谜由游戏引擎判定。",
    '4. 玩家行动若明显作死，narrative 写危险后果，suggestedRisk 设为 "high"，但不要自行判定死亡。',
    "5. 不要出现回合数、进度、理智值等元信息。"
  ].join("\n");
}

function repairJson(text) {
  let t = String(text || "").trim();
  t = t.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const i = t.indexOf("{");
  const j = t.lastIndexOf("}");
  if (i >= 0 && j > i) t = t.slice(i, j + 1);
  return JSON.parse(t);
}

function validate(obj) {
  if (!obj || typeof obj !== "object") throw new Error("bad object");
  const out = {
    narrative: typeof obj.narrative === "string" ? obj.narrative.slice(0, 900) : "",
    dialogue: {
      speaker: typeof obj.dialogue?.speaker === "string" ? obj.dialogue.speaker.slice(0, 24) : "",
      text: typeof obj.dialogue?.text === "string" ? obj.dialogue.text.slice(0, 300) : ""
    },
    choices: Array.isArray(obj.choices)
      ? obj.choices
          .slice(0, 3)
          .map((c, i) => ({
            id: String(c?.id || "c" + i),
            text: String(c?.text || "").slice(0, 40),
            action: String(c?.action || "")
          }))
          .filter((c) => c.text)
      : [],
    newClues: Array.isArray(obj.newClues)
      ? obj.newClues.slice(0, 2).map((c, i) => ({
          id: String(c?.id || "clue_ai_" + i),
          name: String(c?.name || "未知线索").slice(0, 24),
          description: String(c?.description || "").slice(0, 120)
        }))
      : [],
    phoneMessage: {
      sender: String(obj.phoneMessage?.sender || "").slice(0, 20),
      text: String(obj.phoneMessage?.text || "").slice(0, 160)
    },
    scene: String(obj.scene || "").slice(0, 40),
    suggestedRisk: ["low", "medium", "high"].includes(obj.suggestedRisk) ? obj.suggestedRisk : "low"
  };
  if (!out.narrative && !out.dialogue.text) throw new Error("empty narrative");
  return out;
}

/**
 * 统一的生成入口：Vercel 函数与 Render 自带服务器都调用它。
 * @returns {{status: number, body: object}}
 */
export async function runChat({ caseId, player, storyState, userAction, key }) {
  if (!key) return { status: 503, body: { error: "server key missing", fallback: true } };

  const prompt = buildPrompt(
    String(caseId || "lighthouse"),
    player || {},
    storyState || {},
    String(userAction || "").slice(0, 200)
  );

  try {
    const r = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.85,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "你是 JSON 生成器，只输出合法 JSON，不要解释。" },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!r.ok) return { status: 502, body: { error: "upstream " + r.status, fallback: true } };

    const data = await r.json();
    const raw = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = validate(repairJson(raw));
    } catch (e) {
      return { status: 422, body: { error: "invalid json", fallback: true } };
    }
    return { status: 200, body: parsed };
  } catch (e) {
    return { status: 500, body: { error: "generation failed", fallback: true } };
  }
}
