# -*- coding: utf-8 -*-
"""THE UNKNOWN FILES · 单文件服务器（Render / 本地通用）

- 托管 dist/ 里的前端构建产物
- 提供 POST /api/chat：调用 DeepSeek 生成剧情（Key 只存在环境变量里）
- 只用 Python 标准库，Render 上 Runtime 选 Python 3 即可

环境变量（Render → Environment）：
    LLM_API_KEY   = sk-...            （或 DEEPSEEK_API_KEY）
    LLM_BASE      = https://api.deepseek.com/v1
    LLM_MODEL     = deepseek-chat
    LLM_MODE      = api
"""
import http.server
import json
import os
import socketserver
import sys
import urllib.error
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(BASE, "dist")
PORT = int(os.environ.get("PORT") or 8080)
HOST = "0.0.0.0" if os.environ.get("PORT") else "127.0.0.1"

LLM_MODE = os.environ.get("LLM_MODE", "api")
LLM_BASE = (os.environ.get("LLM_BASE") or "https://api.deepseek.com/v1").rstrip("/")
LLM_MODEL = os.environ.get("LLM_MODEL") or "deepseek-chat"
LLM_API_KEY = os.environ.get("LLM_API_KEY") or os.environ.get("DEEPSEEK_API_KEY") or ""

CASES = {
    "lighthouse": {
        "title": "灰烬灯塔",
        "premise": "七年前灯塔管理员失踪。玩家收到无寄件人邮件，附件照片里的监控屏幕映出拍摄者身后的人。"
                   "玩家来到废弃灯塔，监控仍在运行，手机不断收到未知号码短信。",
        "mechanics": "监控切换、数字密码盘、手机短信推理",
        "images": "lighthouse, camera, cup, tape, lamp",
    },
    "rabbit": {
        "title": "坠入兔子洞",
        "premise": "玩家进入没有出口的庄园，所有人遵守荒诞规则，柴郡猫通过手机给出真假难辨的谜语，扑克牌阵列藏着离开的方法。",
        "mechanics": "翻牌阵列、多轮规则博弈、真假规则判断",
        "images": "rabbit, cat, cards, mirror",
    },
    "island": {
        "title": "荒岛二十日",
        "premise": "航行事故后玩家漂到地图上不存在的岛，无线电时断时续，夜里海面和丛林有东西靠近，岛上藏着被掩盖的实验。",
        "mechanics": "雷达防守、资源管理、方位判断",
        "images": "island, radar, radio",
    },
    "nautilus": {
        "title": "鹦鹉螺号",
        "premise": "临时调查员登上深海潜艇调查异常声呐区域，船员陆续失联，船载 AI 异常，手机里的航海日志日期与潜艇时间矛盾。",
        "mechanics": "声呐定位、航海日志推理、日期密码",
        "images": "submarine, sonar, log",
    },
}

SCHEMA = (
    '{"narrative":"180-260字第二人称剧情，有环境与心理描写",'
    '"dialogue":{"speaker":"说话人","text":"台词，没有则空字符串"},'
    '"choices":[{"id":"c1","text":"选项文字","action":"英文动作标识"}],'
    '"newClues":[{"id":"clue_x","name":"线索名","description":"线索描述"}],'
    '"phoneMessage":{"sender":"未知号码","text":"短信内容，没有则空"},'
    '"scene":"场景标识","suggestedRisk":"low|medium|high"}'
)


def build_prompt(case_id, player, story_state, user_action):
    c = CASES.get(case_id, CASES["lighthouse"])
    clues = "；".join(str(x.get("name", "")) for x in (story_state.get("clues") or [])) or "无"
    recent = " → ".join(str(h.get("action", "")) for h in (story_state.get("history") or [])[-4:]) or "无"
    return "\n".join([
        "你是悬疑文字冒险游戏的叙事引擎，正在为课程项目《THE UNKNOWN FILES：未知档案》生成内容。",
        "卷宗：" + c["title"],
        "设定：" + c["premise"],
        "本卷玩法：" + c["mechanics"],
        "可用图片键：" + c["images"],
        "玩家：" + str(player.get("name") or "调查员") + "（" + str(player.get("gender") or "未透露") + "）",
        "当前进度：" + str(story_state.get("progress") or 0),
        "已获得线索：" + clues,
        "最近行动：" + recent,
        "玩家本次行动：" + str(user_action)[:200],
        "",
        "要求：",
        "1. 只输出 JSON，结构严格如下：" + SCHEMA,
        "2. choices 恰好三条，具体可执行，中文，不要出现英文命令。",
        "3. 不要生成密码、答案或让玩家直接通关；解谜由游戏引擎判定。",
        '4. 玩家行动若明显作死，narrative 写危险后果，suggestedRisk 设为 "high"，但不要自行判定死亡。',
        "5. 不要出现回合数、进度、理智值等元信息。",
    ])


def repair_json(text):
    t = (text or "").strip()
    if t.startswith("```"):
        t = t.split("\n", 1)[-1]
    if t.endswith("```"):
        t = t.rsplit("```", 1)[0]
    i, j = t.find("{"), t.rfind("}")
    if i >= 0 and j > i:
        t = t[i:j + 1]
    return json.loads(t)


def validate(obj):
    if not isinstance(obj, dict):
        raise ValueError("bad object")
    dialogue = obj.get("dialogue") or {}
    out = {
        "narrative": str(obj.get("narrative") or "")[:900],
        "dialogue": {
            "speaker": str(dialogue.get("speaker") or "")[:24],
            "text": str(dialogue.get("text") or "")[:300],
        },
        "choices": [
            {
                "id": str(c.get("id") or "c%d" % i),
                "text": str(c.get("text") or "")[:40],
                "action": str(c.get("action") or ""),
            }
            for i, c in enumerate((obj.get("choices") or [])[:3])
            if isinstance(c, dict) and str(c.get("text") or "").strip()
        ],
        "newClues": [
            {
                "id": str(c.get("id") or "clue_ai_%d" % i),
                "name": str(c.get("name") or "未知线索")[:24],
                "description": str(c.get("description") or "")[:120],
            }
            for i, c in enumerate((obj.get("newClues") or [])[:2])
            if isinstance(c, dict)
        ],
        "phoneMessage": {
            "sender": str((obj.get("phoneMessage") or {}).get("sender") or "")[:20],
            "text": str((obj.get("phoneMessage") or {}).get("text") or "")[:160],
        },
        "scene": str(obj.get("scene") or "")[:40],
        "suggestedRisk": obj.get("suggestedRisk") if obj.get("suggestedRisk") in ("low", "medium", "high") else "low",
    }
    if not out["narrative"] and not out["dialogue"]["text"]:
        raise ValueError("empty narrative")
    return out


def call_llm(prompt):
    if not LLM_API_KEY:
        return 503, {"error": "server key missing", "fallback": True}

    payload = {
        "model": LLM_MODEL,
        "temperature": 0.85,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": "你是 JSON 生成器，只输出合法 JSON，不要解释。"},
            {"role": "user", "content": prompt},
        ],
    }
    req = urllib.request.Request(
        LLM_BASE + "/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + LLM_API_KEY},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return 502, {"error": "upstream %d" % e.code, "fallback": True}
    except Exception:
        return 502, {"error": "upstream error", "fallback": True}

    try:
        raw = data["choices"][0]["message"]["content"]
        return 200, validate(repair_json(raw))
    except Exception:
        return 422, {"error": "invalid json", "fallback": True}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST if os.path.isdir(DIST) else BASE, **kwargs)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _json(self, status, obj):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path.split("?")[0] == "/healthz":
            self._json(200, {
                "ok": True,
                "hasKey": bool(LLM_API_KEY),
                "dist": os.path.isfile(os.path.join(DIST, "index.html")),
                "model": LLM_MODEL,
                "base": LLM_BASE,
            })
            return
        super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0] != "/api/chat":
            self._json(404, {"error": "not found"})
            return
        try:
            length = int(self.headers.get("Content-Length") or 0)
            body = json.loads(self.rfile.read(length).decode("utf-8")) if length else {}
        except Exception:
            self._json(400, {"error": "invalid body", "fallback": True})
            return

        prompt = build_prompt(
            str(body.get("caseId") or "lighthouse"),
            body.get("player") or {},
            body.get("storyState") or {},
            body.get("userAction") or "",
        )
        status, payload = call_llm(prompt)
        self._json(status, payload)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main():
    if not os.path.isfile(os.path.join(DIST, "index.html")):
        print("警告：dist/index.html 不存在，先运行 npm run build 再部署。")

    with Server((HOST, PORT), Handler) as httpd:
        print("THE UNKNOWN FILES  listening on http://%s:%d" % (HOST, PORT))
        print("model: %s @ %s" % (LLM_MODEL, LLM_BASE))
        print("key: %s" % ("已配置" if LLM_API_KEY else "未配置（走本地剧本）"))
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
