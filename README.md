# Purana: Abyss Return

Purana: Abyss Return is an **HTML5 + JavaScript** game project. The core modules are managed by **Vite** for modern dependency handling, while some standalone scripts are still loaded via classic `<script>` tags.

> 🤝 **欢迎贡献！** 我们欢迎开发者、设计师和AI领域的朋友加入项目！
> 
> - 🚀 [快速开始](QUICKSTART.md) - 5分钟上手指南
> - 📖 [贡献指南](CONTRIBUTING.md) - 详细的贡献流程

---

## 🚀 Running the Game

> ⚠️ **Note:** Opening the HTML files via `file://` can break module loading and asset paths. Please run a local HTTP server instead.

Here are three common ways to serve the project locally:

### 1️⃣ VS Code Live Server
- Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
- Open [`index.html`](/index.html) and choose **“Open with Live Server.”**
- Your browser will launch and preview the page.

---

### 2️⃣ Python Built-in HTTP Server
Run from the project root:

#### Python 3
```bash
python -m http.server 8000
```

#### Python 2
```bash
python -m SimpleHTTPServer 8000
```

Then visit:

```
http://localhost:8000
```

---

### 3️⃣ Node.js Tools

#### Using `serve`
```bash
# install once globally
npm install -g serve

# serve the current directory
serve .

# or specify a port
serve -l 8000
```

#### Using `http-server`
```bash
# install once globally
npm install -g http-server

# start the server
http-server -p 8000
```

Then visit:

```
http://localhost:8000
```

---

## 🛠 Vite Development

> ⚠️ Requires Node.js.  
⚠️ A prebuilt `main.js` is already included. If you only want to play the game and you are not editing code in `src/`, you do not need to rebuild.

### Install dependencies
```bash
npm install
```

### Start the dev server
```bash
npm run dev
```

- Vite opens `index.html` by default.
- To keep compatibility with non-Vite usage, **HMR is currently disabled**.
- If you want to develop with Vite, copy `game.html` as `test_game.html` and change the Vite entry to `src/main.js`. Then open a link like:
  `http://localhost:5173/test_game.html`

---

## 📦 Build for Production

To rebuild the bundled modules:

```bash
npm run build
```

- Output goes to `dist/`.
- By default, only `src/main.js` and its dependencies are bundled into `dist/main.js`.
- To add more entry points, edit [`vite.config.js`](/vite.config.js).

---

## 📖 Plot Data Loading

- All plot text, triggers, and interactions are managed in `Plot.V3/plot-data.json`. The `plotData` field stores chapter content; `interactions` contains per-level triggers.
- `plot` events in map files are stripped during loading; only non-plot events remain. Plot interactions are injected by `PlotManager` based on chapter/level.
- `PlotManager` respects `PlotModeManager` settings. When plot mode is disabled, interactions still trigger but no text is shown.
- To add new story content, extend `plot-data.json` without editing the map files.

---

## 🤝 Invitation: Join the Community Agent Project

We welcome community members to help design **game-specific agents** that can assist with testing, storytelling, balancing, and tooling around Purana: Abyss Return.

**How you can contribute:**
- Propose agent ideas (QA bots, narrative reviewers, balance analyzers, helper tools).
- Implement prototypes that interact with our content and gameplay systems.
- Share feedback on agent workflows and how they can best support creators and players.

If you’re interested, feel free to open an issue or start a discussion—let’s build the next generation of creative game agents together!

---

## 🤝 参与贡献

我们欢迎各类贡献者加入项目！无论你是：

- 💻 **程序员** - 改进游戏系统、优化性能、开发新功能
- 🎨 **美术设计师** - 创作角色、场景、UI等视觉资源  
- 📝 **游戏策划** - 设计关卡、撰写剧情、平衡数值
- 🤖 **AI研究者** - 探索AI智体与游戏的深度融合

**查看 [贡献指南](CONTRIBUTING.md) 了解详细信息！**

### AI集成机会

我们特别欢迎AI领域的朋友探索以下方向：
- 🧠 敌人智能优化（行为树、强化学习等）
- 💬 NPC智能对话系统
- 🎲 程序化内容生成（关卡、任务等）
- 📊 玩家行为分析与难度自适应
- 🎮 AI辅助玩家系统

> 📖 **深入阅读**: [AI智体与游戏融合技术文档](AI_INTEGRATION.md) - 详细的技术实现方案和代码示例

**让我们一起探索AI智体与游戏玩法的创新融合！**

---

