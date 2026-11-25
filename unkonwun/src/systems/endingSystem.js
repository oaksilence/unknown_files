export function findEnding(caseDef, endingId) {
  return caseDef.endings[endingId] || null;
}

export function endingSummary(caseDef, ending) {
  if (!ending) return "";
  return "【" + ending.title + "】";
}

export function countEndings(caseDef) {
  return Object.values(caseDef.endings || {});
}

export function unlockedOf(caseDef, archiveEndings, caseId) {
  return Object.keys(caseDef.endings || {}).filter((id) =>
    archiveEndings.includes(caseId + ":" + id)
  );
}
