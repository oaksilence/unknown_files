export function enterNode(def, cs, nodeId) {
  const node = def.nodes[nodeId];
  if (!node) return { cs, node: null };

  const clues = [...cs.clues];
  if (node.clue && !clues.some((c) => c.id === node.clue.id)) clues.push(node.clue);

  const phone = [...cs.phone];
  if (node.phone) phone.push({ ...node.phone, id: "p" + phone.length, at: Date.now() });

  const visited = cs.visited.includes(nodeId) ? cs.visited : [...cs.visited, nodeId];

  return {
    cs: {
      ...cs,
      nodeId,
      visited,
      clues,
      phone,
      flags: { ...cs.flags, ...(node.setFlags || {}) },
      progress: Math.max(cs.progress || 0, node.level || 0)
    },
    node
  };
}

export function chooseOption(def, cs, node, choice) {
  if (choice.danger) {
    return { cs, node, ending: def.endings[choice.danger] };
  }
  if (choice.to) {
    const r = enterNode(def, cs, choice.to);
    if (r.node && r.node.finish) {
      return { cs: r.cs, node: r.node, ending: def.endings[r.node.finish] };
    }
    return { cs: r.cs, node: r.node };
  }
  return { cs, node };
}

export function applyHotspot(def, cs, node, hotspot) {
  const clues = [...cs.clues];
  if (hotspot.clue && !clues.some((c) => c.id === hotspot.clue.id)) clues.push(hotspot.clue);

  const flags = { ...cs.flags, [hotspot.id]: true };
  let next = cs;
  if (hotspot.to) {
    const r = enterNode(def, { ...cs, clues, flags }, hotspot.to);
    next = r.cs;
  } else {
    next = { ...cs, clues, flags };
  }
  return { cs: next, hot: hotspot };
}

export function submitPuzzle(def, cs, node, value) {
  const ui = node.ui;
  if (!ui || ui.type !== "keypad") return { ok: false, cs };
  if (String(value) === String(ui.answer)) {
    const r = enterNode(def, { ...cs, solved: { ...cs.solved, [node.id]: true } }, ui.success);
    if (r.node && r.node.finish) {
      return { ok: true, cs: r.cs, node: r.node, ending: def.endings[r.node.finish] };
    }
    return { ok: true, cs: r.cs, node: r.node };
  }
  const mistakes = (cs.flags["_miss_" + node.id] || 0) + 1;
  const flags = { ...cs.flags, ["_miss_" + node.id]: mistakes };
  if (ui.maxMistakes && mistakes >= ui.maxMistakes) {
    return { ok: false, cs: { ...cs, flags }, ending: def.endings[ui.failEnding || "death1"] };
  }
  return { ok: false, cs: { ...cs, flags }, mistakes };
}

export function freeAction(def, cs, text) {
  for (const rule of def.keywords || []) {
    if (rule.test.test(text)) {
      const clues = [...cs.clues];
      if (rule.clue && !clues.some((c) => c.id === rule.clue.id)) clues.push(rule.clue);
      return { cs: { ...cs, clues, flags: { ...cs.flags, ...(rule.flags || {}) } }, rule };
    }
  }
  return { cs, rule: null };
}

export function isChoiceVisible(choice, cs) {
  if (choice.requireFlag && !cs.flags[choice.requireFlag]) return false;
  if (choice.requireClue && !cs.clues.some((c) => c.id === choice.requireClue)) return false;
  return true;
}

/* ---------- 资源 ---------- */
export function applyEffects(cs, effects) {
  if (!effects) return cs;
  const res = { ...(cs.resources || { food: 3, water: 3, power: 5, material: 2 }) };
  Object.keys(effects).forEach((k) => {
    res[k] = Math.max(0, (res[k] || 0) + effects[k]);
  });
  return { ...cs, resources: res };
}

/* ---------- 扑克牌 ---------- */
export function playCards(def, cs, node, cardId) {
  const ui = node.ui;
  const roundIndex = cs.flags["_round_" + node.id] || 0;
  const round = ui.rounds[roundIndex];
  if (!round) return { cs };

  if (cardId === round.correct) {
    const nextIndex = roundIndex + 1;
    const flags = { ...cs.flags, ["_round_" + node.id]: nextIndex };
    if (nextIndex >= ui.rounds.length) {
      const r = enterNode(def, { ...cs, flags, solved: { ...cs.solved, [node.id]: true } }, ui.success);
      return { ok: true, cs: r.cs, node: r.node, ending: r.node?.finish ? def.endings[r.node.finish] : undefined };
    }
    return { ok: true, cs: { ...cs, flags }, round: nextIndex };
  }
  return { ok: false, cs, ending: def.endings[ui.failEnding || "death1"], wrong: true };
}

/* ---------- 雷达 ---------- */
export function playRadar(def, cs, node, angle) {
  const ui = node.ui;
  const hit = cs.flags["_radar_" + node.id] || 0;
  const miss = cs.flags["_miss_" + node.id] || 0;
  const need = ui.angles[hit % ui.angles.length];
  const diff = Math.abs(((angle - need + 540) % 360) - 180);

  if (diff <= (ui.tolerance || 12)) {
    const nextHit = hit + 1;
    const flags = { ...cs.flags, ["_radar_" + node.id]: nextHit };
    if (nextHit >= ui.goal) {
      const r = enterNode(def, { ...cs, flags, solved: { ...cs.solved, [node.id]: true } }, ui.success);
      return { ok: true, cs: r.cs, node: r.node, ending: r.node?.finish ? def.endings[r.node.finish] : undefined };
    }
    return { ok: true, cs: { ...cs, flags }, hit: nextHit, need };
  }

  const nextMiss = miss + 1;
  const flags = { ...cs.flags, ["_miss_" + node.id]: nextMiss };
  if (nextMiss >= (ui.maxMiss || 3)) {
    return { ok: false, cs: { ...cs, flags }, ending: def.endings[ui.failEnding || "death1"] };
  }
  return { ok: false, cs: { ...cs, flags }, miss: nextMiss, need };
}

/* ---------- 声呐 ---------- */
export function playSonar(def, cs, node, index) {
  const ui = node.ui;
  if (index === ui.correct) {
    const r = enterNode(def, { ...cs, solved: { ...cs.solved, [node.id]: true } }, ui.success);
    return { ok: true, cs: r.cs, node: r.node, ending: r.node?.finish ? def.endings[r.node.finish] : undefined };
  }
  return { ok: false, cs, ending: def.endings[ui.failEnding || "death1"] };
}