/**
 * Render / 本地统一服务器
 * - 托管 Vite 构建产物 dist/
 * - 提供 POST /api/chat（DeepSeek 代理，Key 从环境变量读取）
 * 启动：node server.js
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runChat } from "./api/generate-core.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8"
};

function sendJson(res, status, obj) {
  const data = Buffer.from(JSON.stringify(obj), "utf-8");
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": data.length,
    "Access-Control-Allow-Origin": "*"
  });
  res.end(data);
}

function readBody(req, limit = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

function serveStatic(req, res, pathname) {
  const safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(DIST, safePath);

  if (!filePath.startsWith(DIST)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    // SPA 回退
    filePath = path.join(DIST, "index.html");
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("dist/ 不存在，请先运行 npm run build");
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  const isAsset = filePath.includes(path.sep + "assets" + path.sep);

  res.writeHead(200, {
    "Content-Type": type,
    "Cache-Control": isAsset ? "public, max-age=31536000, immutable" : "no-cache"
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://" + (req.headers.host || "localhost"));
  const pathname = url.pathname;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  if (pathname === "/healthz") {
    sendJson(res, 200, {
      ok: true,
      hasKey: Boolean(process.env.DEEPSEEK_API_KEY),
      dist: fs.existsSync(path.join(DIST, "index.html"))
    });
    return;
  }

  if (pathname === "/api/chat") {
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "method not allowed" });
      return;
    }
    let body = {};
    try {
      const raw = await readBody(req);
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      sendJson(res, 400, { error: "invalid body", fallback: true });
      return;
    }

    const result = await runChat({
      caseId: body.caseId,
      player: body.player,
      storyState: body.storyState,
      userAction: body.userAction,
      key: process.env.DEEPSEEK_API_KEY
    });
    sendJson(res, result.status, result.body);
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res, pathname);
    return;
  }

  sendJson(res, 405, { error: "method not allowed" });
});

server.listen(PORT, HOST, () => {
  console.log("THE UNKNOWN FILES listening on http://" + HOST + ":" + PORT);
  console.log("DeepSeek key: " + (process.env.DEEPSEEK_API_KEY ? "已配置" : "未配置（将走本地剧本）"));
  console.log("dist: " + (fs.existsSync(path.join(DIST, "index.html")) ? "已构建" : "缺少，请先 npm run build"));
});
