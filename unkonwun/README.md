# THE UNKNOWN FILES · 未知档案

一款由 AI 参与叙事的悬疑文字冒险游戏（AVG）。四个卷宗，四种调查方式，多结局，本地存档，断网可玩。

> 状态：**四个卷宗全部可玩**，四种专属交互、音效系统、手机航海日志、多结局与存档均已实现。

---

## 一、技术栈

| 层 | 选型 |
|---|---|
| 前端 | React 18 + Vite |
| 样式 | 原生 CSS（无 UI 框架） |
| 图标 | lucide-react |
| 后端 | Vercel Serverless Functions |
| AI | DeepSeek（仅服务端调用） |
| 存档 | LocalStorage |

API Key 只存在于服务端环境变量 `DEEPSEEK_API_KEY`，前端代码与仓库中不出现任何密钥。

---

## 二、目录结构

```
unknown-files/
├── api/
│   └── chat.js                 # AI 安全代理，强制 JSON 输出、参数校验、失败降级
├── src/
│   ├── components/
│   │   ├── MainMenu.jsx        # 主菜单
│   │   ├── PlayerSetup.jsx     # 调查员档案
│   │   ├── CaseSelect.jsx      # 卷宗选择
│   │   ├── GameLayout.jsx      # 三栏调查工作台
│   │   ├── StoryPanel.jsx      # 剧情 / 对话 / 逐字动画
│   │   ├── ClueBoard.jsx       # 线索板（按卷宗隔离）
│   │   ├── ChoicePanel.jsx     # 剧情选项
│   │   ├── DynamicInput.jsx    # 自由行动输入
│   │   ├── InteractivePanel.jsx# 专属交互：监控 / 密码盘
│   │   ├── Phone.jsx           # 悬浮手机
│   │   ├── EndingScreen.jsx    # 结局页
│   │   ├── Archive.jsx         # 档案收藏
│   │   ├── Settings.jsx        # 设置
│   │   └── PixelArt.jsx        # 内联 SVG 像素插画
│   ├── games/
│   │   ├── lighthouse.js       # 卷宗一：剧情节点、谜题、结局
│   │   └── index.js            # 卷宗注册表
│   ├── systems/
│   │   ├── gameEngine.js       # 节点推进、线索、谜题判定
│   │   ├── aiService.js        # 前端 AI 请求 + 超时
│   │   ├── stateManager.js     # 存档、隔离容器、结局解锁
│   │   ├── endingSystem.js     # 结局查询
│   │   └── fallback.js         # 本地备用叙事
│   ├── styles/global.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### 职责边界

- **gameEngine**：唯一的规则执行者。危险操作、密码正确性、结局判定都在这里，AI 无权修改。
- **aiService**：只负责把玩家行动发给 `/api/chat`，12 秒超时，失败返回 `null`。
- **fallback**：AI 不可用时的本地叙事，保证游戏继续。
- **stateManager**：`state.cases[caseId]` 独立容器，切卷天然隔离。

---

## 三、一键运行（推荐）

Windows 双击 **`启动.cmd`**，或命令行：

```bash
python boot.py
```

它会自动：检查 Node → 首次安装依赖 → 启动开发服务器 → 打开浏览器（`http://127.0.0.1:5173/`）。

想要生产版本（更快、无热更新）：

```bash
python boot.py --build
```

构建完成后自动用本地服务器托管 `dist/`，地址 `http://127.0.0.1:8080/`。

> 首次运行需要联网安装依赖；之后启动只需几秒。

## 三·二、手动运行

需要 Node.js 18+。

```bash
npm install
npm run dev
```

打开 http://localhost:5173 。

### 配置 DeepSeek（可选）

没有 Key 也能完整游玩（自动走本地叙事）。

本地开发：

```bash
cp .env.example .env
# 编辑 .env，填入 DEEPSEEK_API_KEY=sk-xxxx
npx vercel dev
```

> `npm run dev` 只跑 Vite，不包含 `/api` 函数；要测 AI 请用 `vercel dev`。

---

## 四、部署到 Render（推荐）

项目自带 `server.js`：它同时托管前端构建产物和 `/api/chat` 代理，所以 **Render 一个 Web Service 就能跑完整游戏**。

### 1. 推到 GitHub

```bash
git init
git add .
git commit -m "THE UNKNOWN FILES"
git branch -M main
git remote add origin https://github.com/<你的用户名>/unknown-files.git
git push -u origin main
```

### 2. Render 创建 Web Service

- 打开 https://dashboard.render.com → **New** → **Web Service**
- 连接你的 GitHub 仓库 `unknown-files`
- 填写：

| 配置项 | 值 |
|---|---|
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `node server.js` |
| Health Check Path | `/healthz` |
| Instance Type | Free |

### 3. 配置 DeepSeek Key

在 **Environment** 里添加：

```
DEEPSEEK_API_KEY = sk-你的key
```

保存后 Render 会自动重新部署。

### 4. 部署完成

访问 `https://<你的服务名>.onrender.com`。前端会用同源 `/api/chat`，Key 不会出现在浏览器里。

> 免费实例闲置会休眠，第一次访问需要等 30–60 秒。

### 也可以用 Blueprint

仓库里带 `render.yaml`，在 Render 选择 **New → Blueprint**，指向该仓库即可自动创建服务，之后只需填 `DEEPSEEK_API_KEY`。

### 健康检查

```
GET /healthz  →  {"ok":true,"hasKey":true,"dist":true}
```

`hasKey:false` 说明环境变量没配好，此时游戏仍可玩，会自动走本地剧本。

## 五、部署到 Vercel（备选）

1. Vercel → New Project → 导入同一仓库（自动识别 Vite）。
2. Settings → Environment Variables 添加 `DEEPSEEK_API_KEY`。
3. Deploy。

Vercel 使用 `api/chat.js` 这个 Serverless 函数，逻辑与 `server.js` 完全一致（共用 `api/generate-core.js`）。

## 六、接口说明

```
POST /api/chat
{
  "caseId": "lighthouse",
  "player": { "name": "林", "gender": "不透露" },
  "storyState": { "progress": 5, "clues": [], "flags": {}, "history": [] },
  "userAction": "检查桌上的咖啡杯"
}
```

返回严格 JSON：`narrative / dialogue / choices / newClues / phoneMessage / scene / suggestedRisk`。
任何字段不合法都会返回 4xx/5xx，前端自动切换到本地叙事，游戏不中断。
## 七、部署到 Vercel（旧版说明）

1. 推到 GitHub：

```bash
git init
git add .
git commit -m "THE UNKNOWN FILES"
git branch -M main
git remote add origin https://github.com/<你的用户名>/unknown-files.git
git push -u origin main
```

2. Vercel → New Project → 导入仓库（Framework 自动识别 Vite）。
3. Settings → Environment Variables 添加：

```
DEEPSEEK_API_KEY = sk-xxxx
```

4. Deploy。完成后访问 `https://<project>.vercel.app`。

---

## 五、四个卷宗

| 卷宗 | 专属交互 | 节点 | 结局（死亡/生存） |
|---|---|---|---|
| 灰烬灯塔 | 四路监控 + 三次数字密码盘 | 22 | 2 / 3 |
| 坠入兔子洞 | 3×4 扑克牌 3D 翻牌，三轮博弈 | 21 | 2 / 3 |
| 荒岛二十日 | CSS 雷达防守 5 夜 + 资源管理 | 13 | 3 / 3 |
| 鹦鹉螺号 | 声呐光点 + 手机航海日志 + 日期锁 | 16 | 3 / 2 |

合计 **72 个剧情节点、21 个结局**。

## 六、玩法说明（卷宗一）

- **左侧线索板**：随调查自动累积，切卷隔离。
- **中央剧情**：逐字显示，关键词高亮；可跳过动画。
- **监控**：四路视角可切换，画面里的热点需要点击。
- **密码盘**：三次独立解谜（主电源 7788、储藏室 9912、铁皮柜 0417）。
- **手机**：右下角悬浮，未知号码会推进剧情。
- **自由输入**：任何行动都能输入；危险行为由引擎直接判定死亡。
- **结局**：3 个生存 + 2 个死亡，解锁后进入档案收藏。

---

## 七、档案馆

- **总进度**：已解锁结局 / 全部结局、死亡结局、生存结局、已收集线索，四条进度条。
- **单卷统计**：每个卷宗单独显示结局进度与线索收集进度。
- **结局列表**：未解锁显示为「？？？？？」，解锁后显示名称与达成方式。
- 线索总数由剧本自动统计（含监控热点里的隐藏线索），不需要手工维护。

## 八、音效与设置

- 音效由 Web Audio 实时合成（按键、翻牌、命中、警报、死亡、结局和弦），无外部音频文件。
- 背景音是一段低频雨声，默认关闭，避免浏览器自动播放限制。
- 设置里可调字体大小、开关音效/背景音、关闭全部动画。

## 九、测试清单

- [ ] 主菜单四个入口均可点击
- [ ] 未填姓名时建立档案会被拦截
- [ ] 选择卷宗后进入三栏布局
- [ ] 监控四路切换、热点点击有效
- [ ] 密码 7788 / 9912 / 0417 分别可解锁
- [ ] 连续输错触发死亡结局
- [ ] 自由输入「检查咖啡杯」返回相关叙事
- [ ] 自由输入「徒手摸电箱」直接死亡
- [ ] 刷新页面后进度保留
- [ ] 结局解锁后档案收藏可见
- [ ] 断网（停掉 API）后仍能继续游戏
- [ ] 兔子洞：翻错牌立即进入死亡结局
- [ ] 荒岛：雷达打偏三次触发夜袭；水耗尽触发脱水
- [ ] 鹦鹉螺号：手机可切换「航海日志」并翻阅
- [ ] 开启音效后，点击选项/翻牌/结局有声音
- [ ] 关闭动画后，线索卡片与转场不再播放动画
- [ ] 档案馆显示总结局进度、线索进度与单卷进度
- [ ] 双击 启动.cmd 能自动装依赖并打开浏览器
- [ ] python boot.py --build 能构建并托管 dist
