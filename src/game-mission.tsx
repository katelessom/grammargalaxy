"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { tasksFor } from "./task-bank";
import type { GrammarTask, Level } from "./task-bank";
import { playNamedJingle, playSound } from "./audio";

type GameId = "race" | "repair" | "code";
type MissionTask = GrammarTask & {
  options: string[];
  choiceLabels: string[];
  displayPrompt: string;
  instruction: string;
};
type AnswerRecord = { task: MissionTask; chosen: string; correct: boolean };

const gameCopy: Record<GameId, { title: string }> = {
  race: { title: "Rocket Race" },
  repair: { title: "Starship Repair" },
  code: { title: "Alien Codebreaker" },
};

function shuffle<T>(items: readonly T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function normalized(value: string) { return value.trim().toLowerCase().replace(/[’']/g, "'").replace(/\s*\/\s*/g, "/").replace(/\s+/g, " "); }
function completedSentence(task: GrammarTask, answer: string) { return task.prompt.includes("___") ? task.prompt.replace("___", answer) : `${task.prompt} ${answer}`; }

function ruleHint(topic: string) {
  const hints: Record<string, string> = {
    "Present Perfect": "Look for unfinished time, life experience, or a result that matters now. Finished past-time markers usually need Past Simple.",
    "Past Perfect": "Identify the earlier of two past actions. The earlier action often uses had plus a past participle.",
    "Passive Voice": "Focus on the receiver of the action. Build the verb with the correct form of be plus a past participle.",
    "Reported Speech": "Check whether the reporting verb changes tense, pronouns, time words, or the order of a question.",
    "Modal Verbs": "Decide whether the meaning is obligation, possibility, deduction, advice, or permission before choosing the modal.",
    "Relative Clauses": "First decide whether the missing word refers to a person, thing, place, time, reason, or possession.",
    "Gerunds & Infinitives": "The first verb controls whether the next verb uses -ing or to plus the base form.",
    "Prepositions": "Treat the adjective or verb and its preposition as one fixed expression.",
    "Questions": "Choose the auxiliary first, then keep statement word order after the question word.",
  };
  return hints[topic] ?? "Identify the time, subject, and purpose of the sentence before selecting the grammar structure.";
}

export default function GameMission({ game, level, topic, soundOn, soundVolume, hints, onUseHint, onExit, onComplete }: {
  game: GameId; level: Level; topic: string; soundOn: boolean; soundVolume: number; hints: number; onUseHint: () => boolean; onExit: () => void;
  onComplete: (reward: { xp: number; stardust: number; correct: number; total: number }) => void;
}) {
  const key = `grammar-galaxy-seen-${game}-${level}-${topic}`;
  const missionTasks = useMemo<MissionTask[]>(() => {
    const pool = tasksFor(level, topic);
    const lane = game === "race" ? 0 : game === "repair" ? 1 : 2;
    const offset = pool.length ? (lane * 10) % pool.length : 0;
    const laneOrdered = [...pool.slice(offset), ...pool.slice(0, offset)];
    const seen: string[] = typeof window === "undefined" ? [] : JSON.parse(window.localStorage.getItem(key) || "[]");
    const ordered = [...shuffle(laneOrdered.filter((task) => !seen.includes(task.id))), ...shuffle(laneOrdered.filter((task) => seen.includes(task.id)))].slice(0, Math.min(10, pool.length));
    return ordered.map((task, taskIndex) => {
      const options = shuffle(task.options);
      const faulty = options.find((option) => normalized(option) !== normalized(task.answer)) ?? options[0];
      const displayPrompt = game === "repair"
        ? taskIndex % 3 === 0
          ? `Faulty sentence: ${completedSentence(task, faulty)}`
          : taskIndex % 3 === 1
            ? `Editor’s draft: ${completedSentence(task, faulty)}`
            : `Restore the original meaning: ${completedSentence(task, faulty)}`
        : game === "code"
          ? taskIndex % 3 === 0 ? `Recover the missing grammar signal: ${task.prompt}` : taskIndex % 3 === 1 ? `Assemble the form that completes this message: ${task.prompt}` : `Build the exact grammar sequence: ${task.prompt}`
          : task.prompt;
      const fullChoice = game === "race" && taskIndex % 2 === 1 && task.prompt.includes("___");
      const choiceLabels = fullChoice
        ? options.map((option) => completedSentence(task, option))
        : options;
      const instruction = game === "race"
        ? fullChoice ? "Fly to the planet with the only complete correct sentence." : "Choose the grammar form that completes the route log."
        : game === "repair"
          ? taskIndex % 3 === 0 ? "Replace the damaged language module." : taskIndex % 3 === 1 ? "Correct the editor’s draft without changing its meaning." : "Find the form that restores the original sentence."
          : taskIndex % 3 === 0 ? "Select code fragments and place them in the correct order." : taskIndex % 3 === 1 ? "Build the missing form from signal fragments." : "Decode the grammar sequence before transmitting it.";
      return { ...task, options, choiceLabels, displayPrompt, instruction };
    });
  }, [game, key, level, topic]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [usedHints, setUsedHints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(22);
  const startTime = useRef(Date.now());
  const task = missionTasks[index];
  const info = gameCopy[game];
  const correctCount = records.filter((record) => record.correct).length;
  const accuracy = missionTasks.length ? Math.round((correctCount / missionTasks.length) * 100) : 0;
  const xp = Math.max(0, correctCount * 12 + (accuracy === 100 ? 30 : 0) - usedHints * 2);
  const stardust = Math.max(0, correctCount * 3 + (accuracy >= 80 ? 10 : 0));

  useEffect(() => {
    if (!missionTasks.length || typeof window === "undefined") return;
    const seen: string[] = JSON.parse(window.localStorage.getItem(key) || "[]");
    window.localStorage.setItem(key, JSON.stringify([...new Set([...seen, ...missionTasks.map((item) => item.id)])]));
  }, [key, missionTasks]);

  useEffect(() => {
    setTimeLeft(22);
    if (game !== "race" || confirmed || showResult) return;
    const timer = window.setInterval(() => setTimeLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [game, index, confirmed, showResult]);

  useEffect(() => { if (game === "race" && timeLeft === 0 && !confirmed && task) confirmAnswer("Time ran out", true); }, [game, timeLeft, confirmed, task]);

  function rewardFor(answerRecords: AnswerRecord[]) {
    const finalCorrect = answerRecords.filter((record) => record.correct).length;
    const finalAccuracy = missionTasks.length ? Math.round((finalCorrect / missionTasks.length) * 100) : 0;
    return { correct: finalCorrect, accuracy: finalAccuracy, xp: Math.max(0, finalCorrect * 12 + (finalAccuracy === 100 ? 30 : 0) - usedHints * 2), stardust: Math.max(0, finalCorrect * 3 + (finalAccuracy >= 80 ? 10 : 0)) };
  }
  function confirmAnswer(forced?: string, advanceAutomatically = false) {
    if (confirmed || !task) return;
    const answer = forced ?? selected;
    if (!answer.trim()) return;
    const correct = normalized(answer) === normalized(task.answer);
    const nextRecords = [...records, { task, chosen: answer, correct }];
    setConfirmed(true); setRecords(nextRecords);
    if (soundOn) playSound(game === "race" ? "launch" : game === "repair" ? "repair" : "transmit", soundVolume);
    if (advanceAutomatically) window.setTimeout(() => advance(nextRecords), game === "race" ? 1050 : game === "repair" ? 520 : 340);
  }
  function advance(answerRecords = records) {
    if (index + 1 >= missionTasks.length) return finish(answerRecords);
    setIndex((value) => value + 1); setSelected(""); setConfirmed(false); setHintShown(false);
  }
  function finish(finalRecords = records) {
    setShowResult(true); if (soundOn) { playSound("reward", soundVolume); playNamedJingle("./audio/jingle-mission-complete.mp3", soundVolume); }
    const reward = rewardFor(finalRecords);
    const history = JSON.parse(window.localStorage.getItem("grammar-galaxy-history") || "[]");
    history.unshift({ id: `${Date.now()}`, date: new Date().toISOString(), game, level, topic, correct: reward.correct, total: missionTasks.length, xp: reward.xp, stardust: reward.stardust, seconds: Math.round((Date.now() - startTime.current) / 1000), usedHints });
    window.localStorage.setItem("grammar-galaxy-history", JSON.stringify(history.slice(0, 100)));
    const mistakes = finalRecords.filter((record) => !record.correct).map((record) => ({ id: record.task.id, prompt: record.task.prompt, chosen: record.chosen, answer: record.task.answer, explanation: record.task.explanation, level, topic }));
    const oldMistakes = JSON.parse(window.localStorage.getItem("grammar-galaxy-mistakes") || "[]");
    window.localStorage.setItem("grammar-galaxy-mistakes", JSON.stringify([...mistakes, ...oldMistakes].slice(0, 200)));
  }
  function revealHint() { if (hintShown || confirmed) return; if (onUseHint()) { setHintShown(true); setUsedHints((value) => value + 1); } }

  if (!task) return <div className="mission-overlay"><div className="empty-mission"><img src="./assets/ui/emblem-03.webp" alt="" /><h2>No tasks in this sector yet</h2><p>Choose another topic or level.</p><button className="primary-button" onClick={onExit}>Back to missions</button></div></div>;

  if (showResult) return <div className={`mission-overlay results-screen ${game}`}><div className="cosmic-celebration" aria-hidden="true"><span className="celebration-wave" />{Array.from({ length: 56 }, (_, star) => <i style={{ "--x": `${(star * 37) % 100}%`, "--delay": `${-(star % 13) * .17}s`, "--duration": `${1.8 + (star % 7) * .22}s`, "--size": `${4 + (star % 4) * 2}px` } as React.CSSProperties} key={star} />)}{Array.from({ length: 4 }, (_, streak) => <b style={{ "--streak": streak } as React.CSSProperties} key={streak} />)}</div><div className="results-panel"><img className="result-cup" src={accuracy >= 80 ? "./assets/decor/object-15.webp" : "./assets/ui/emblem-06.webp"} alt="Mission award" /><span className="eyebrow">MISSION COMPLETE</span><h2>{accuracy >= 80 ? "Brilliant flight!" : accuracy >= 50 ? "Mission accomplished!" : "Training data collected"}</h2><p>{info.title} · {topic} · {level}</p><div className="result-stats"><div><b>{correctCount}/{missionTasks.length}</b><span>Correct</span></div><div><b>{accuracy}%</b><span>Accuracy</span></div><div><b>+{xp}</b><span>XP</span></div><div><b>+{stardust}</b><span>Stardust</span></div></div><div className="answer-report"><div className="report-heading"><h3>Answer report</h3><p>Correct sentences and comments appear here only after the complete mission.</p></div>{records.map((record, recordIndex) => <article className={record.correct ? "report-correct" : "report-wrong"} key={record.task.id}><span className="report-number">{recordIndex + 1}</span><div><b>{completedSentence(record.task, record.task.answer)}</b><p>Your answer: <em>{record.chosen}</em></p>{!record.correct && <p>Correct answer: <strong>{record.task.answer}</strong></p>}<small>{record.task.explanation}</small></div><span className="report-status"><MissionIcon name={record.correct ? "check" : "close"} /></span></article>)}</div><div className="results-actions"><button className="primary-button" onClick={() => onComplete({ xp, stardust, correct: correctCount, total: missionTasks.length })}>Collect rewards</button></div></div></div>;

  return <div className={`mission-overlay game-screen ${game}`} style={{ "--mission-bg": `url(./assets/scenes/${game}.webp)` } as React.CSSProperties}>
    <div className="mission-effects" aria-hidden="true"><i /><i /><i /><i /><i /><span /></div>
    <div className="mission-topbar"><button className="mission-exit" onClick={() => { if (soundOn) playSound("navigate", soundVolume); onExit(); }}><MissionIcon name="exit" />Exit</button><div><b>{info.title}</b><small>{topic} · {level}</small></div><span className="mission-counter">{game === "race" && <b className={timeLeft <= 5 ? "danger" : ""}><MissionIcon name="clock" />{timeLeft}s</b>}<span>{index + 1} / {missionTasks.length}</span></span></div>
    <div className="mission-progress" aria-label={`${index + (confirmed ? 1 : 0)} of ${missionTasks.length} answered`}><span style={{ width: `${((index + (confirmed ? 1 : 0)) / missionTasks.length) * 100}%` }} /></div>
    <div className="mission-stage" key={`${task.id}-${index}`}>
      <GameProgress game={game} correct={correctCount} total={missionTasks.length} />
      <article className="question-card"><div className="question-meta"><span>{game === "race" ? "PLOT A COURSE TO THE RIGHT PLANET" : game === "repair" ? "REPAIR THE SENTENCE" : "ASSEMBLE THE GRAMMAR CODE"}</span><button className="hint-button" disabled={confirmed || hintShown || hints <= 0} onClick={revealHint}><MissionIcon name="hint" /><span>Hint charge</span><b>{hints}</b></button></div><p className="challenge-lead">{task.instruction}</p><div className={`transmission ${game}`}>{task.displayPrompt}</div>{hintShown && <div className="hint-panel"><MissionIcon name="hint" /><p>{ruleHint(topic)}</p></div>}
        {game === "race" && <PlanetRoute options={task.options} labels={task.choiceLabels} selected={selected} disabled={confirmed} collected={correctCount} onSelect={(option) => { setSelected(option); confirmAnswer(option, true); }} />}
        {game === "repair" && <RepairBoard task={task} selected={selected} disabled={confirmed} onSelect={(option) => { setSelected(option); confirmAnswer(option, true); }} />}
        {game === "code" && <CodeAssembler task={task} disabled={confirmed} onFragment={() => { if (soundOn) playSound("fragment", soundVolume); }} onRemove={() => { if (soundOn) playSound("remove", soundVolume); }} onTransmit={(answer) => confirmAnswer(answer, true)} />}
        {confirmed && <div className="answer-saved">Answer saved. Moving to the next task.</div>}
      </article>
    </div>
  </div>;
}

function PlanetRoute({ options, labels, selected, disabled, collected, onSelect }: { options: string[]; labels: string[]; selected: string; disabled: boolean; collected: number; onSelect: (option: string) => void }) {
  const target = Math.max(0, options.findIndex((option) => option === selected));
  return <div className={`planet-route ${selected ? `course-${target}` : ""} ${disabled ? "course-locked" : ""}`}><div className="route-lines" aria-hidden="true" /><img className="route-ship" src="./assets/cabin-items/rocket.png" alt="Your mission ship" /><div className="planet-field">{options.map((option, optionIndex) => <button className={`answer-planet planet-${optionIndex} ${labels[optionIndex].length > 28 ? "long-answer" : ""} ${selected === option ? "selected" : ""}`} disabled={disabled} onClick={() => onSelect(option)} key={option}><i aria-hidden="true" /><span>{labels[optionIndex]}</span><small>Course {String.fromCharCode(65 + optionIndex)}</small></button>)}</div><div className="cargo-bay"><span>MISSION CARGO</span><div>{Array.from({ length: 10 }, (_, item) => <i className={item < collected ? "collected" : ""} key={item} />)}</div></div></div>;
}

type CodeFragment = { id: string; label: string };

function codePlan(value: string) {
  const clean = value.trim();
  if (clean.includes("/")) return { parts: clean.split("/").map((part) => part.trim()).filter(Boolean), joiner: " / " };
  if (clean.includes(" ")) return { parts: clean.split(/\s+/).filter(Boolean), joiner: " " };
  const suffix = ["ing", "est", "ed", "es", "er", "s"].find((ending) => clean.length > ending.length + 2 && clean.endsWith(ending));
  return suffix ? { parts: [clean.slice(0, -suffix.length), suffix], joiner: "" } : { parts: [clean], joiner: "" };
}

function CodeAssembler({ task, disabled, onFragment, onRemove, onTransmit }: { task: MissionTask; disabled: boolean; onFragment: () => void; onRemove: () => void; onTransmit: (answer: string) => void }) {
  const plan = useMemo(() => codePlan(task.answer), [task.answer]);
  const fragments = useMemo<CodeFragment[]>(() => {
    const correct = plan.parts.map((label, index) => ({ id: `core-${index}-${label}`, label }));
    const decoyLabels = plan.parts.length === 1
      ? task.options.filter((option) => normalized(option) !== normalized(task.answer))
      : task.options.filter((option) => normalized(option) !== normalized(task.answer)).flatMap((option) => codePlan(option).parts);
    const decoys = decoyLabels.slice(0, Math.max(3, 8 - correct.length)).map((label, index) => ({ id: `noise-${index}-${label}`, label }));
    return shuffle([...correct, ...decoys]);
  }, [plan.parts, task.answer, task.options]);
  const [sequence, setSequence] = useState<CodeFragment[]>([]);
  const used = new Set(sequence.map((fragment) => fragment.id));
  const decoded = sequence.map((fragment) => fragment.label).join(plan.joiner);

  function add(fragment: CodeFragment) {
    if (disabled || sequence.length >= plan.parts.length || used.has(fragment.id)) return;
    onFragment();
    setSequence((current) => [...current, fragment]);
  }
  function remove(fragmentIndex: number) {
    if (disabled) return;
    onRemove();
    setSequence((current) => current.filter((_, index) => index !== fragmentIndex));
  }

  return <div className="code-assembler">
    <div className="decoder-console">
      <div className="decoder-header"><span>DECODE SEQUENCE</span><small>{sequence.length} / {plan.parts.length} fragments</small></div>
      <div className="decoder-slots">{Array.from({ length: plan.parts.length }, (_, slot) => <button disabled={disabled || !sequence[slot]} onClick={() => remove(slot)} className={sequence[slot] ? "filled" : ""} aria-label={sequence[slot] ? `Remove ${sequence[slot].label}` : `Empty code position ${slot + 1}`} key={slot}>{sequence[slot]?.label ?? ""}</button>)}</div>
      <div className="decoder-beam" aria-hidden="true"><i /><i /><i /></div>
    </div>
    <div className="code-fragment-bank">{fragments.map((fragment, fragmentIndex) => <button disabled={disabled || used.has(fragment.id) || sequence.length >= plan.parts.length} onClick={() => add(fragment)} style={{ "--fragment": fragmentIndex } as React.CSSProperties} key={fragment.id}><span>{fragment.label}</span><i aria-hidden="true" /></button>)}</div>
    <div className="code-controls"><button className="glass-button" disabled={disabled || sequence.length === 0} onClick={() => { onRemove(); setSequence([]); }}>Clear sequence</button><button className="primary-button" disabled={disabled || sequence.length !== plan.parts.length} onClick={() => onTransmit(decoded)}>Transmit code</button></div>
  </div>;
}

function GameProgress({ game, correct, total }: { game: GameId; correct: number; total: number }) {
  if (game === "race") return <div className="stage-visual race-stage"><div className="race-track">{Array.from({ length: total }, (_, index) => <i className={index < correct ? "active" : ""} key={index} />)}<img className="race-rocket" src="./assets/decor/object-00.webp" alt="Rocket progress marker" style={{ left: `${3 + (correct / total) * 82}%` }} /><img className="race-portal" src="./assets/decor/object-03.webp" alt="Finish portal" /></div></div>;
  if (game === "repair") return <div className="stage-visual repair-stage"><div className="repair-reactor"><div className="reactor-art"><span className="reactor-ring" /><img src="./assets/games/repair-logo.webp" alt="Ship reactor" style={{ filter: `grayscale(${1 - correct / total}) brightness(${.45 + correct / total})` }} /></div><div className="repair-meter"><span><b>{correct}</b> systems online</span><i><b style={{ width: `${(correct / total) * 100}%` }} /></i></div></div></div>;
  return <div className="stage-visual code-stage"><div className="code-console"><div className="code-orb"><img src="./assets/games/code-logo.webp" alt="Alien decoder" /><i style={{ clipPath: `inset(${100 - (correct / total) * 100}% 0 0)` }} /></div><div className="code-meter"><span>Signal decoded</span><b>{Math.round((correct / total) * 100)}%</b><i><b style={{ width: `${(correct / total) * 100}%` }} /></i></div></div></div>;
}

function RepairBoard({ task, selected, disabled, onSelect }: { task: MissionTask; selected: string; disabled: boolean; onSelect: (option: string) => void }) {
  return <div className="repair-board"><div className={`repair-slot ${selected ? "filled" : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (!disabled) onSelect(event.dataTransfer.getData("text/plain")); }}>{selected ? completedSentence(task, selected) : "Drop a language module here"}</div><div className="module-bank">{task.options.map((option) => <button draggable={!disabled} onDragStart={(event) => event.dataTransfer.setData("text/plain", option)} disabled={disabled} className={selected === option ? "selected" : ""} onClick={() => onSelect(option)} key={option}><img src="./assets/decor/repair-08.webp" alt="" /><span>{option}</span></button>)}</div><small>Drag a module to the slot, or tap it on a phone or tablet.</small></div>;
}

function MissionIcon({ name }: { name: "exit" | "clock" | "hint" | "check" | "close" | "lock" }) {
  const paths = {
    exit: <><path d="M10 6 4 12l6 6M4 12h16" /></>, clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    hint: <><path d="M9 18h6M10 22h4" /><path d="M8 14c-1.3-1.1-2-2.7-2-4.5a6 6 0 1 1 12 0c0 1.8-.7 3.4-2 4.5-1 .9-1 1.7-1 2H9c0-.3 0-1.1-1-2Z" /></>,
    check: <path d="m5 12 4 4L19 6" />, close: <path d="m6 6 12 12M18 6 6 18" />, lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
