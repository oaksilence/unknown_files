import lighthouse from "./lighthouse.js";
import rabbitHole from "./rabbitHole.js";
import island from "./island.js";
import nautilus from "./nautilus.js";

const CASES = {
  lighthouse,
  rabbit: rabbitHole,
  island,
  nautilus
};

export function getCase(caseId) {
  return CASES[caseId] || null;
}

export function listCases() {
  return Object.values(CASES);
}

export function caseStats(def) {
  const clueIds = new Set();

  Object.values(def.nodes || {}).forEach((node) => {
    if (node.clue && node.clue.id) clueIds.add(node.clue.id);
    if (node.ui && node.ui.type === "camera") {
      Object.values(node.ui.reveals || {}).forEach((r) => {
        if (r.clue && r.clue.id) clueIds.add(r.clue.id);
      });
    }
  });

  const endings = Object.values(def.endings || {});
  return {
    clues: clueIds.size,
    endings: endings.length,
    deaths: endings.filter((e) => e.type === "death").length,
    survives: endings.filter((e) => e.type === "survive").length
  };
}
