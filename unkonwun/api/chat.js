import { runChat } from "./generate-core.js";

/**
 * Vercel Serverless 入口。
 * Render / 本地统一走 server.js，两者共用同一套生成逻辑。
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  body = body || {};

  const result = await runChat({
    caseId: body.caseId,
    player: body.player,
    storyState: body.storyState,
    userAction: body.userAction,
    key: process.env.DEEPSEEK_API_KEY
  });

  res.status(result.status).json(result.body);
}
