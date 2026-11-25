const URL = "/api/chat";

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

function valid(data) {
  return data && typeof data.narrative === "string" && data.narrative.length > 0;
}

export async function askAI({ caseId, player, storyState, userAction }) {
  const payload = {
    caseId,
    player,
    storyState: {
      progress: storyState.progress || 0,
      clues: storyState.clues || [],
      flags: storyState.flags || {},
      history: (storyState.history || []).slice(-6)
    },
    userAction
  };

  const req = fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(async (r) => {
    if (!r.ok) return null;
    const data = await r.json();
    return valid(data) ? data : null;
  });

  try {
    return await Promise.race([req, timeout(14000)]);
  } catch (e) {
    return null;
  }
}
