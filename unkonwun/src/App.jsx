import { useEffect, useMemo, useState } from "react";
import MainMenu from "./components/MainMenu.jsx";
import PlayerSetup from "./components/PlayerSetup.jsx";
import CaseSelect from "./components/CaseSelect.jsx";
import GameLayout from "./components/GameLayout.jsx";
import EndingScreen from "./components/EndingScreen.jsx";
import Archive from "./components/Archive.jsx";
import Settings from "./components/Settings.jsx";

import { listCases, getCase as getDef } from "./games/index.js";
import {
  loadState,
  saveState,
  blankCase,
  getCase,
  withCase,
  resetCase,
  unlockEnding,
  archiveClue
} from "./systems/stateManager.js";
import {
  enterNode,
  chooseOption,
  applyHotspot,
  submitPuzzle,
  playCards,
  playRadar,
  playSonar,
  applyEffects,
  freeAction
} from "./systems/gameEngine.js";
import { askAI } from "./systems/aiService.js";
import { localNarrative } from "./systems/fallback.js";
import { applyAudioSettings, play } from "./systems/audio.js";
import { readShot, shotState, shotView, shotEnding } from "./systems/shotMode.js";

export default function App() {
  const SHOT = readShot();
  const [state, setState] = useState(() => (SHOT ? shotState(SHOT) : loadState()));
  const [view, setView] = useState(() => (SHOT ? shotView(SHOT) : "menu"));
  const [ending, setEnding] = useState(() => (SHOT ? shotEnding(SHOT) : null));
  const [extra, setExtra] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const cases = useMemo(() => listCases(), []);
  const caseDef = state.current ? getDef(state.current) : null;
  const cs = state.current ? getCase(state, state.current) : null;
  const node = caseDef && cs && cs.nodeId ? caseDef.nodes[cs.nodeId] : null;
  const radarNeed =
    node && node.ui && node.ui.type === "radar"
      ? node.ui.angles[(cs.flags["_radar_" + node.id] || 0) % node.ui.angles.length]
      : null;

  useEffect(() => {
    applyAudioSettings(state.settings);
    saveState(state);
    document.documentElement.style.setProperty("--font-scale", String(state.settings.fontScale));
  }, [state]);

  const updateCase = (patch) => setState((s) => withCase(s, s.current, patch));

  function startNew() {
    setView("setup");
  }

  function setupDone(player) {
    setState((s) => ({ ...s, player }));
    setView("cases");
  }

  function pickCase(id) {
    const def = getDef(id);
    let cur = getCase(state, id);
    if (!cur.nodeId) {
      const r = enterNode(def, blankCase(id), def.start);
      cur = r.cs;
    }
    setState((s) => ({ ...withCase(s, id, cur), current: id }));
    setEnding(null);
    setExtra(null);
    setFeedback(null);
    setImage(def.nodes[cur.nodeId]?.image || null);
    setView("game");
  }

  function finish(end) {
    setState((s) => {
      const id = s.current;
      const patched = withCase(s, id, { ...getCase(s, id), ended: end.id });
      const unlocked = unlockEnding(patched, id, end);
      return (getCase(unlocked, id).clues || []).reduce(
        (acc, c) => archiveClue(acc, id, c),
        unlocked
      );
    });
    play(end.type === "death" ? "death" : "good");
    setEnding(end);
    setView("ending");
  }

  function handleChoose(choice) {
    if (!node) return;
    play("click");
    const r = chooseOption(caseDef, cs, node, choice);
    if (r.ending) return finish(r.ending);

    let next = applyEffects(r.cs, choice.effects);
    if (caseDef.id === "island" && next.resources && next.resources.water <= 0) {
      return finish(caseDef.endings.death3);
    }
    updateCase(next);
    setExtra(null);
    setFeedback(null);
    setImage(r.node?.image || null);
  }

  function handleReveal(hotspot) {
    if (!node || node.ui?.type !== "camera") return;
    const reveal = node.ui.reveals?.[hotspot.id];
    if (!reveal) return;
    const clue = reveal.clue
      ? { id: reveal.clue.id, name: reveal.clue.name, description: reveal.clue.description }
      : null;
    const r = applyHotspot(caseDef, cs, node, { id: hotspot.id, clue, to: reveal.to });
    updateCase(r.cs);
    setExtra({ text: reveal.text });
    setFeedback(null);
  }

  function handlePuzzle(value) {
    if (!node) return;
    const r = submitPuzzle(caseDef, cs, node, value);
    if (r.ending) return finish(r.ending);
    updateCase(r.cs);
    if (r.ok) {
      setFeedback({ ok: true, text: "解锁成功。" });
      setExtra(null);
      setImage(r.node?.image || null);
    } else {
      setFeedback({
        ok: false,
        text: r.mistakes ? `密码错误（第 ${r.mistakes} 次）。` : "密码错误。"
      });
    }
  }

  async function handleFree(text) {
    if (!caseDef) return;
    if (caseDef.dangerRegex && caseDef.dangerRegex.test(text)) {
      play("alarm");
      return finish(caseDef.endings.death1);
    }

    setLoading(true);
    setExtra(null);

    const fr = freeAction(caseDef, cs, text);
    let cur = {
      ...fr.cs,
      history: [...fr.cs.history, { action: text, at: Date.now() }]
    };
    updateCase(cur);

    const ai = await askAI({
      caseId: caseDef.id,
      player: state.player,
      storyState: cur,
      userAction: text
    });

    if (ai) {
      const clues = [...cur.clues];
      (ai.newClues || []).forEach((c) => {
        if (!clues.some((x) => x.id === c.id)) clues.push(c);
      });
      const phone = [...cur.phone];
      if (ai.phoneMessage && ai.phoneMessage.text) {
        phone.push({
          id: "p" + phone.length,
          from: ai.phoneMessage.sender || "未知号码",
          text: ai.phoneMessage.text
        });
      }
      cur = { ...cur, clues, phone };
      updateCase(cur);
      setExtra({ text: ai.narrative, dialogue: ai.dialogue });
    } else {
      const fb = localNarrative(caseDef.id, text);
      if (fb.danger) {
        setLoading(false);
        return finish(caseDef.endings.death1);
      }
      setExtra({ text: fb.narrative });
    }

    setLoading(false);
  }

  function handleCard(cardId) {
    play("flip");
    const r = playCards(caseDef, cs, node, cardId);
    if (r.ending) return finish(r.ending);
    updateCase(r.cs);
    setFeedback(r.ok ? { ok: true, text: "翻对了。" } : { ok: false, text: "翻错了。" });
  }

  function handleRadar(angle) {
    if (!Number.isFinite(angle)) return;
    const r = playRadar(caseDef, cs, node, angle);
    play(r.ok ? "hit" : "miss");
    if (r.ending) return finish(r.ending);
    updateCase(r.cs);
    if (r.ok) setFeedback({ ok: true, text: "命中。红点退开了一段。" });
    else setFeedback({ ok: false, text: r.miss ? `未命中（失误 ${r.miss}）。` : "未命中。" });
  }

  function handleSonar(index) {
    const r = playSonar(caseDef, cs, node, index);
    play(r.ok ? "clue" : "alarm");
    if (r.ending) return finish(r.ending);
    updateCase(r.cs);
    setFeedback({ ok: r.ok, text: r.ok ? "坐标正确，舱门开启。" : "坐标错误。" });
  }

  function restartCase() {
    const id = state.current;
    const def = getDef(id);
    const r = enterNode(def, blankCase(id), def.start);
    setState((s) => ({ ...withCase(s, id, r.cs), current: id }));
    setEnding(null);
    setExtra(null);
    setFeedback(null);
    setImage(def.nodes[r.cs.nodeId]?.image || null);
    setView("game");
  }

  const hasSave = Object.values(state.cases).some((c) => c.nodeId);

  return (
    <div className={"app-root" + (state.settings.anim ? "" : " no-anim")}>
      {view === "menu" && (
        <MainMenu
          hasSave={hasSave}
          onStart={startNew}
          onContinue={() => setView(state.player.name ? "cases" : "setup")}
          onArchive={() => setView("archive")}
          onSettings={() => setView("settings")}
        />
      )}

      {view === "setup" && (
        <PlayerSetup
          player={state.player}
          onDone={setupDone}
          onBack={() => setView("menu")}
        />
      )}

      {view === "cases" && (
        <CaseSelect
          cases={cases}
          states={state.cases}
          onPick={pickCase}
          onBack={() => setView("menu")}
        />
      )}

      {view === "game" && caseDef && (
        <GameLayout
          caseDef={caseDef}
          node={node}
          cs={cs}
          image={image || node?.image}
          dialogue={extra?.dialogue}
          extra={extra}
          loading={loading}
          feedback={feedback}
          targetAngle={radarNeed}
          anim={state.settings.anim}
          onChoose={handleChoose}
          onFree={handleFree}
          onReveal={handleReveal}
          onPuzzle={handlePuzzle}
          onCard={handleCard}
          onRadar={handleRadar}
          onSonar={handleSonar}
          onBack={() => setView("cases")}
          onRestart={restartCase}
          onArchive={() => setView("archive")}
          onPickClue={() => {}}
        />
      )}

      {view === "ending" && (
        <EndingScreen
          ending={ending}
          onRestart={restartCase}
          onArchive={() => setView("archive")}
        />
      )}

      {view === "archive" && (
        <Archive cases={cases} state={state} onBack={() => setView(state.current ? "cases" : "menu")} />
      )}

      {view === "settings" && (
        <Settings
          settings={state.settings}
          onChange={(settings) => setState((s) => ({ ...s, settings }))}
          onBack={() => setView("menu")}
          onClear={() => {
            if (state.current) {
              setState((s) => resetCase(s, s.current));
              setView("cases");
            }
          }}
        />
      )}
    </div>
  );
}
