const KEY = "unknown_files_save_v1";

export function blankState() {
  return {
    player: { name: "", gender: "未透露" },
    current: null,
    cases: {},
    archive: { endings: [], clues: [] },
    settings: { fontScale: 1, sfx: false, bgm: false, anim: true }
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blankState();
    const data = JSON.parse(raw);
    return { ...blankState(), ...data };
  } catch (e) {
    return blankState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    /* 存储失败不影响游戏 */
  }
}

export function blankCase(caseId) {
  return {
    caseId,
    nodeId: null,
    visited: [],
    clues: [],
    flags: {},
    history: [],
    phone: [],
    solved: {},
    progress: 0,
    ended: null,
    startedAt: Date.now()
  };
}

export function getCase(state, caseId) {
  return state.cases[caseId] || blankCase(caseId);
}

export function withCase(state, caseId, patch) {
  const prev = getCase(state, caseId);
  const next = { ...prev, ...patch };
  return { ...state, cases: { ...state.cases, [caseId]: next } };
}

export function resetCase(state, caseId) {
  const cases = { ...state.cases };
  delete cases[caseId];
  return { ...state, cases, current: state.current === caseId ? null : state.current };
}

export function unlockEnding(state, caseId, ending) {
  const id = caseId + ":" + ending.id;
  if (state.archive.endings.includes(id)) return state;
  return {
    ...state,
    archive: { ...state.archive, endings: [...state.archive.endings, id] }
  };
}

export function archiveClue(state, caseId, clue) {
  const id = caseId + ":" + clue.id;
  if (state.archive.clues.includes(id)) return state;
  return {
    ...state,
    archive: { ...state.archive, clues: [...state.archive.clues, id] }
  };
}

export function isEndingUnlocked(state, caseId, endingId) {
  return state.archive.endings.includes(caseId + ":" + endingId);
}
