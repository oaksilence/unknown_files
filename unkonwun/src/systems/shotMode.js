import { blankState, blankCase } from "./stateManager.js";
import { enterNode } from "./gameEngine.js";
import { getCase } from "../games/index.js";

export function readShot() {
  try {
    const p = new URLSearchParams(window.location.search);
    const kind = p.get("shot");
    if (!kind) return null;
    return {
      kind,
      caseId: p.get("case") || "lighthouse",
      node: p.get("node") || null,
      end: p.get("end") || null
    };
  } catch (e) {
    return null;
  }
}

export function shotState(shot) {
  const base = blankState();
  base.player = { name: "林", gender: "不透露" };
  base.settings = { ...base.settings, sfx: false, bgm: false, anim: false };

  const def = getCase(shot.caseId);
  if (!def) return base;

  let cs = blankCase(shot.caseId);
  const startId = shot.node || def.start;
  const r = enterNode(def, cs, startId);
  cs = r.cs;

  // 让截图里的线索板有内容
  Object.values(def.nodes).forEach((n) => {
    if (n.clue && cs.clues.length < 5 && !cs.clues.some((c) => c.id === n.clue.id)) {
      cs.clues.push(n.clue);
    }
  });

  if (def.nodes[startId] && def.nodes[startId].ui && def.nodes[startId].ui.type === "cards") {
    cs.flags["_round_" + startId] = 0;
  }

  base.cases[shot.caseId] = cs;
  base.current = shot.caseId;

  if (shot.kind === "archive") {
    base.cases.lighthouse = { ...cs, ended: "good1" };
    base.archive.endings = ["lighthouse:good1", "lighthouse:death1", "rabbit:good1", "island:death1"];
    base.archive.clues = ["lighthouse:c_mail", "lighthouse:c_9912"];
    base.current = null;
  }

  return base;
}

export function shotView(shot) {
  if (shot.kind === "cases") return "cases";
  if (shot.kind === "game") return "game";
  if (shot.kind === "archive") return "archive";
  if (shot.kind === "ending") return "ending";
  return "menu";
}

export function shotEnding(shot) {
  const def = getCase(shot.caseId);
  if (!def) return null;
  return def.endings[shot.end || "good1"] || null;
}
