"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import GameMission from "./game-mission";
import { playNamedJingle, playSound } from "./audio";
import { grammarTasks, topicsForLevel } from "./task-bank";
import type { Level } from "./task-bank";

type View = "home" | "missions" | "profile" | "cabin" | "shop" | "settings";
type GameId = "race" | "repair" | "code";
type IconName = "home" | "missions" | "profile" | "cabin" | "shop" | "settings" | "dust" | "xp" | "streak" | "hint" | "info" | "next" | "close" | "sound" | "music" | "save" | "check";

type Profile = {
  name: string;
  avatar: string;
  level: Level;
  xp: number;
  stardust: number;
  missions: number;
  streak: number;
  hints: number;
  perfectMissions: number;
  lastVisit: string;
  purchases: string[];
  equipped: string | null;
  equippedItems: string[];
  newCabinItem: string | null;
  achievements: string[];
};

type HistoryItem = { id: string; game: GameId; level: Level; topic: string; correct: number; total: number; xp: number; stardust: number; date: string };

type Game = {
  id: GameId;
  title: string;
  kicker: string;
  description: string;
  image: string;
  emblem: string;
  color: string;
  instructions: string[];
};

const games: Game[] = [
  {
    id: "race", title: "Rocket Race", kicker: "Speed mission", color: "cyan",
    description: "Choose accurate grammar forms, charge the engine and reach the portal before the flight clock expires.",
    image: "./assets/scenes/race.webp", emblem: "./assets/games/race-logo.webp",
    instructions: ["Choose a grammar topic and CEFR level.", "Plot a course to one of four planets. Some planets show a missing form; others show a complete sentence.", "Every landing counts as a completed question. Correct answers collect mission cargo and move the rocket forward.", "After ten planets, review every mistake, correct sentence and reward."],
  },
  {
    id: "repair", title: "Sentence Builder", kicker: "Word order mission", color: "coral",
    description: "Build correct English sentences from floating word modules and lock the final structure into the grammar engine.",
    image: "./assets/scenes/repair.webp", emblem: "./assets/games/repair-logo.webp",
    instructions: ["Choose a grammar topic and CEFR level.", "Read the sentence frame and inspect the floating word modules.", "Tap modules in the correct order to build the missing phrase, then lock the sentence.", "After ten builds, inspect every correct sentence, comment and reward."],
  },
  {
    id: "code", title: "Grammar Duel", kicker: "Battle mission", color: "violet",
    description: "Face a rival drone, fire the correct grammar answer and keep your shield stronger than the enemy attack.",
    image: "./assets/scenes/code.webp", emblem: "./assets/games/code-logo.webp",
    instructions: ["Choose a grammar topic and CEFR level.", "Read the duel prompt before the enemy drone charges.", "Tap the correct answer to fire. Correct shots damage the drone; wrong shots hit your shield.", "After ten turns, collect rewards and review every answer."],
  },
];

const topics = [...new Set(grammarTasks.map((task) => task.topic))].sort();
const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];
const avatars = Array.from({ length: 12 }, (_, index) => ({ id: `cadet-${String(index).padStart(2, "0")}`, src: `./assets/avatars/cadet-${String(index).padStart(2, "0")}.webp`, name: `Space cadet ${index + 1}` }));
const shopItems = [
  { id: "rocket", image: "./assets/decor/object-00.webp", name: "Comet Rocket", price: 45, kind: "Desk model" },
  { id: "crimson-rocket", image: "./assets/decor/object-01.webp", name: "Crimson Rocket", price: 55, kind: "Shelf model" },
  { id: "finish-gate", image: "./assets/decor/object-02.webp", name: "Finish Gate", price: 65, kind: "Mission souvenir" },
  { id: "portal", image: "./assets/decor/object-03.webp", name: "Nebula Portal", price: 75, kind: "Wall portal" },
  { id: "launch-pad", image: "./assets/decor/object-04.webp", name: "Launch Pad", price: 85, kind: "Floor display" },
  { id: "meteor", image: "./assets/decor/object-05.webp", name: "Meteor Fragment", price: 95, kind: "Rare specimen" },
  { id: "galaxy", image: "./assets/decor/object-06.webp", name: "Spiral Galaxy", price: 110, kind: "Window projection" },
  { id: "beacon", image: "./assets/decor/object-07.webp", name: "Signal Beacon", price: 120, kind: "Navigation light" },
  { id: "crystal", image: "./assets/decor/object-08.webp", name: "Grammar Crystal", price: 135, kind: "Learning amplifier" },
  { id: "star", image: "./assets/decor/object-09.webp", name: "Orbit Star", price: 150, kind: "Holographic lamp" },
  { id: "gravity-dice", image: "./assets/decor/object-10.webp", name: "Gravity Dice", price: 165, kind: "Zero-gravity toy" },
  { id: "saturn-panel", image: "./assets/decor/object-11.webp", name: "Saturn Panel", price: 180, kind: "Cabin artwork" },
  { id: "shield", image: "./assets/decor/object-12.webp", name: "Shield Projector", price: 195, kind: "Energy decoration" },
  { id: "aurora-comet", image: "./assets/decor/object-14.webp", name: "Aurora Comet", price: 215, kind: "Ceiling projection" },
  { id: "trophy", image: "./assets/decor/object-15.webp", name: "Captain Trophy", price: 240, kind: "Achievement display" },
  { id: "energy-cell", image: "./assets/decor/repair-01.webp", name: "Energy Cell", price: 260, kind: "Engine room relic" },
  { id: "nav-console", image: "./assets/decor/repair-03.webp", name: "Navigation Console", price: 280, kind: "Interactive console" },
  { id: "holo-globe", image: "./assets/decor/repair-05.webp", name: "Hologram Globe", price: 300, kind: "Study projection" },
  { id: "lunar-antenna", image: "./assets/decor/repair-07.webp", name: "Lunar Antenna", price: 330, kind: "Signal collector" },
  { id: "repair-arm", image: "./assets/decor/repair-11.webp", name: "Repair Arm", price: 360, kind: "Robotic assistant" },
] as const;

const legacyShopIds: Record<string, string> = { fern: "crystal", poster: "galaxy", ufo: "portal", bot: "repair-arm", frame: "star", view: "trophy" };
const normaliseShopId = (id: string) => legacyShopIds[id] ?? id;

const achievementDefinitions = [
  { id: "first-flight", name: "First Flight", description: "Complete one mission", image: "./assets/ui/emblem-00.webp", unlocked: (profile: Profile) => profile.missions >= 1 },
  { id: "three-missions", name: "Orbit Rookie", description: "Complete three missions", image: "./assets/ui/emblem-01.webp", unlocked: (profile: Profile) => profile.missions >= 3 },
  { id: "five-missions", name: "Mission Crew", description: "Complete five missions", image: "./assets/ui/emblem-02.webp", unlocked: (profile: Profile) => profile.missions >= 5 },
  { id: "ten-missions", name: "Deep Space Pilot", description: "Complete ten missions", image: "./assets/ui/emblem-03.webp", unlocked: (profile: Profile) => profile.missions >= 10 },
  { id: "xp-500", name: "Orbit Explorer", description: "Collect 500 XP", image: "./assets/ui/emblem-04.webp", unlocked: (profile: Profile) => profile.xp >= 500 },
  { id: "xp-1200", name: "Star Captain", description: "Collect 1,200 XP", image: "./assets/ui/emblem-05.webp", unlocked: (profile: Profile) => profile.xp >= 1200 },
  { id: "perfect-orbit", name: "Perfect Orbit", description: "Finish a flawless mission", image: "./assets/ui/emblem-06.webp", unlocked: (profile: Profile) => profile.perfectMissions >= 1 },
  { id: "five-perfect", name: "Grammar Ace", description: "Finish five flawless missions", image: "./assets/ui/emblem-07.webp", unlocked: (profile: Profile) => profile.perfectMissions >= 5 },
  { id: "topic-explorer", name: "Topic Explorer", description: "Practise five grammar topics", image: "./assets/ui/emblem-08.webp", unlocked: (_profile: Profile, history: HistoryItem[]) => new Set(history.map((item) => item.topic)).size >= 5 },
  { id: "level-explorer", name: "Level Voyager", description: "Practise three CEFR levels", image: "./assets/ui/emblem-09.webp", unlocked: (_profile: Profile, history: HistoryItem[]) => new Set(history.map((item) => item.level)).size >= 3 },
  { id: "first-purchase", name: "First Upgrade", description: "Buy one cabin item", image: "./assets/ui/emblem-10.webp", unlocked: (profile: Profile) => profile.purchases.length >= 1 },
  { id: "cabin-curator", name: "Cabin Curator", description: "Display four cabin items", image: "./assets/ui/emblem-11.webp", unlocked: (profile: Profile) => profile.equippedItems.length >= 4 },
];

const today = () => new Date().toISOString().slice(0, 10);
const emptyProfile: Profile = { name: "", avatar: "cadet-00", level: "A2", xp: 0, stardust: 40, missions: 0, streak: 1, hints: 3, perfectMissions: 0, lastVisit: "", purchases: [], equipped: null, equippedItems: [], newCabinItem: null, achievements: [] };
const cabinItemSrc = (id: string) => `./assets/cabin-items/${id}.png`;
const avatarSrc = (id: string) => avatars.find((avatar) => avatar.id === id)?.src ?? avatars[0].src;
const unlockAchievements = (profile: Profile, history: HistoryItem[]) => ({ ...profile, achievements: [...new Set([...profile.achievements, ...achievementDefinitions.filter((award) => award.unlocked(profile, history)).map((award) => award.id)])] });
const musicState: { audio: HTMLAudioElement | null; track: string; token: number } = { audio: null, track: "", token: 0 };

function stopCurrentMusic() {
  if (!musicState.audio) return;
  musicState.audio.pause();
  musicState.audio.removeAttribute("src");
  musicState.audio.load();
  musicState.audio = null;
  musicState.track = "";
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Profile>(emptyProfile);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [instructionGame, setInstructionGame] = useState<Game | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [mission, setMission] = useState<{ game: GameId; topic: string; level: Level } | null>(null);
  const [topic, setTopic] = useState("Present Perfect");
  const [level, setLevel] = useState<Level>("A2");
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const [soundVolume, setSoundVolume] = useState(55);
  const [musicVolume, setMusicVolume] = useState(24);

  useEffect(() => {
    const saved = window.localStorage.getItem("grammar-galaxy-profile");
    const settings = window.localStorage.getItem("grammar-galaxy-settings");
    const savedHistory = JSON.parse(window.localStorage.getItem("grammar-galaxy-history") || "[]") as HistoryItem[];
    setHistory(savedHistory);
    if (saved) {
      const raw = JSON.parse(saved) as Partial<Profile>;
      const migratedAvatar = typeof raw.avatar === "string" && raw.avatar.startsWith("cadet-") ? raw.avatar : "cadet-00";
      const validIds = new Set(shopItems.map((item) => item.id));
      const purchases = [...new Set((raw.purchases ?? []).map(normaliseShopId).filter((id) => validIds.has(id)))];
      const previousEquipped = raw.equipped ? normaliseShopId(raw.equipped) : null;
      const migratedDisplay = (raw.equippedItems?.length ? raw.equippedItems : previousEquipped ? [previousEquipped] : []).map(normaliseShopId).filter((id) => validIds.has(id));
      const equippedItems = [...new Set(migratedDisplay)];
      equippedItems.forEach((id) => { if (!purchases.includes(id)) purchases.push(id); });
      if (!purchases.length && !equippedItems.length && typeof raw.stardust === "number" && raw.stardust < emptyProfile.stardust) {
        purchases.push("crystal");
        equippedItems.push("crystal");
      }
      let parsed = unlockAchievements({ ...emptyProfile, ...raw, avatar: migratedAvatar, purchases, equippedItems, equipped: equippedItems[0] ?? null } as Profile, savedHistory);
      if (parsed.lastVisit && parsed.lastVisit !== today()) parsed = { ...parsed, streak: parsed.streak + 1, hints: Math.min(7, parsed.hints + 1), lastVisit: today() };
      if (!parsed.lastVisit) parsed.lastVisit = today();
      setProfile(parsed); setDraft(parsed); setLevel(parsed.level);
      window.localStorage.setItem("grammar-galaxy-profile", JSON.stringify(parsed));
    } else setProfileOpen(true);
    if (settings) {
      const parsed = JSON.parse(settings) as { soundOn?: boolean; musicOn?: boolean; soundVolume?: number; musicVolume?: number };
      setSoundOn(parsed.soundOn ?? true); setMusicOn(parsed.musicOn ?? true); setSoundVolume(parsed.soundVolume ?? 55); setMusicVolume(parsed.musicVolume ?? 24);
    }
  }, []);

  useEffect(() => { window.localStorage.setItem("grammar-galaxy-settings", JSON.stringify({ soundOn, musicOn, soundVolume, musicVolume })); }, [soundOn, musicOn, soundVolume, musicVolume]);
  useCosmicCursor();
  const musicTrack = mission
    ? `./music-${mission.game === "race" ? "rocket-race" : mission.game === "repair" ? "starship-repair" : "codebreaker"}.mp3`
    : view === "cabin" ? "./music-cabin.mp3"
      : view === "shop" ? "./music-shop.mp3"
        : "./music-main-menu.mp3";
  useLocationMusic(musicTrack, musicOn, musicVolume);

  const rank = useMemo(() => !profile ? "Space Cadet" : profile.xp >= 2400 ? "Galaxy Commander" : profile.xp >= 1200 ? "Star Captain" : profile.xp >= 500 ? "Orbit Explorer" : "Space Cadet", [profile]);
  const availableTopics = useMemo(() => topicsForLevel(level), [level]);
  useEffect(() => { if (availableTopics.length && !availableTopics.includes(topic)) setTopic(availableTopics[0]); }, [availableTopics, topic]);

  function saveProfile() {
    const clean = { ...draft, name: draft.name.trim() || "Explorer", lastVisit: draft.lastVisit || today() };
    commitProfile(clean); setLevel(clean.level); setProfileOpen(false); if (soundOn && soundVolume > 0) playSound("select", soundVolume);
  }
  function commitProfile(next: Profile, nextHistory = history) { const awarded = unlockAchievements(next, nextHistory); setProfile(awarded); setDraft(awarded); window.localStorage.setItem("grammar-galaxy-profile", JSON.stringify(awarded)); }
  function buyOrEquip(item: (typeof shopItems)[number]) {
    const current = profile ?? emptyProfile;
    const owned = current.purchases.includes(item.id);
    const displayed = current.equippedItems.includes(item.id);
    if (owned) {
      const equippedItems = displayed ? current.equippedItems.filter((id) => id !== item.id) : [...new Set([...current.equippedItems, item.id])];
      if (soundOn && soundVolume > 0) playSound(displayed ? "remove" : "place", soundVolume);
      return commitProfile({ ...current, equippedItems, equipped: equippedItems[0] ?? null });
    }
    if (current.stardust >= item.price) {
      const purchases = [...new Set([...current.purchases, item.id])];
      const equippedItems = [...new Set([...current.equippedItems, item.id])];
      if (soundOn && soundVolume > 0) playSound("purchase", soundVolume);
      commitProfile({ ...current, stardust: current.stardust - item.price, purchases, equippedItems, equipped: equippedItems[0] ?? item.id, newCabinItem: item.id });
      setView("cabin");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  function clearCabinArrival() {
    const current = profile ?? emptyProfile;
    if (current.newCabinItem) commitProfile({ ...current, newCabinItem: null });
  }
  function buyHint() { const current = profile ?? emptyProfile; if (current.stardust >= 35 && current.hints < 9) { if (soundOn && soundVolume > 0) playSound("purchase", soundVolume); commitProfile({ ...current, stardust: current.stardust - 35, hints: current.hints + 1 }); } }
  function useHint() { const current = profile ?? emptyProfile; if (current.hints <= 0) return false; if (soundOn && soundVolume > 0) playSound("hint", soundVolume); commitProfile({ ...current, hints: current.hints - 1 }); return true; }
  function nav(next: View) { if (soundOn && soundVolume > 0) playSound("navigate", soundVolume); setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return <div className="app-shell">
    <div className="stars" aria-hidden="true" />
    <header className="topbar">
      <button className="brand" onClick={() => nav("home")} aria-label="Grammar Galaxy home"><img src="./assets/games/race-logo.webp" alt="" /><span><b>Grammar</b> Galaxy</span></button>
      <nav className="desktop-nav" aria-label="Main navigation">
        <NavButton active={view === "home"} onClick={() => nav("home")} icon="home" label="Home" />
        <NavButton active={view === "missions"} onClick={() => nav("missions")} icon="missions" label="Missions" />
        <NavButton active={view === "profile"} onClick={() => nav("profile")} icon="profile" label="My Profile" />
        <NavButton active={view === "cabin"} onClick={() => nav("cabin")} icon="cabin" label="My Cabin" />
        <NavButton active={view === "shop"} onClick={() => nav("shop")} icon="shop" label="Shop" />
      </nav>
      <div className="pilot-pill"><span className="currency"><Icon name="dust" />{profile?.stardust ?? 0}</span><button onClick={() => nav("profile")} aria-label="Open profile"><img className="pilot-avatar" src={avatarSrc(profile?.avatar ?? emptyProfile.avatar)} alt="" /><span className="pilot-copy"><b>{profile?.name || "New Pilot"}</b><small>{rank}</small></span></button><button className="icon-button" onClick={() => nav("settings")} aria-label="Settings"><Icon name="settings" /></button></div>
    </header>

    <main>
      {view === "home" &&
        <section className="hero"><img src="./assets/mission-transition.webp" alt="A shuttle travelling to three grammar missions" /><div className="hero-shade" /><div className="hero-copy"><span className="eyebrow">ENGLISH GRAMMAR · SPACE ADVENTURE</span><h1>Launch your next<br /><em>grammar mission.</em></h1><p>Master English, earn Stardust and turn your cabin into the coolest place in the galaxy.</p><div className="hero-actions"><button className="primary-button" onClick={() => document.getElementById("missions")?.scrollIntoView({ behavior: "smooth" })}>Choose a mission <Icon name="next" /></button><button className="ghost-button" onClick={() => setInstructionGame(games[0])}>How it works</button></div><div className="hero-stats"><span><b>{profile?.missions ?? 0}</b> missions</span><span><b>{profile?.xp ?? 0}</b> total XP</span><span><b>{profile?.hints ?? 3}</b> hint charges</span></div></div></section>
      }
      {(view === "home" || view === "missions") &&
        <section id="missions" className="section missions-section"><div className="section-heading"><div><span className="eyebrow">MISSION CONTROL</span><h2>Choose your adventure</h2></div><p>Three different grammar games, {grammarTasks.length} unique tasks and levels from A1 to C1. Each mission prioritises unseen questions.</p></div><div className="game-grid">{games.map((game) => <article className={`game-card ${game.color}`} key={game.id}><div className="game-visual"><img src={game.image} alt={`${game.title} space scene`} /><span>{game.id === "race" ? "Planet routes" : game.id === "repair" ? "Sentence modules" : "Grammar battle"}</span></div><div className="game-content"><div className="game-title-row"><img className="game-emblem" src={game.emblem} alt="" /><div><span className="game-kicker">{game.kicker}</span><h3>{game.title}</h3></div></div><p>{game.description}</p><div className="game-actions"><button className="primary-button small" onClick={() => setSelectedGame(game)}>Play <Icon name="next" /></button><button className="glass-button" onClick={() => setInstructionGame(game)}><Icon name="info" />How to Play</button></div></div></article>)}</div></section>
      }

      {view === "profile" && <ProfileView profile={profile ?? emptyProfile} rank={rank} history={history} onEdit={() => { setDraft(profile ?? emptyProfile); setProfileOpen(true); }} onCabin={() => nav("cabin")} />}
      {view === "cabin" && <Cabin profile={profile ?? emptyProfile} onShop={() => nav("shop")} onToggleItem={buyOrEquip} onArrivalComplete={clearCabinArrival} />}
      {view === "shop" && <Shop profile={profile ?? emptyProfile} onBuy={buyOrEquip} onBuyHint={buyHint} />}
      {view === "settings" && <section className="section settings-page"><span className="eyebrow">CONTROL PANEL</span><h2>Settings</h2><div className="settings-card"><Toggle label="Sound effects" description="Navigation, missions, purchases and reward sounds" value={soundOn} onChange={setSoundOn} icon="sound" /><Volume label="Effects volume" value={soundVolume} onChange={setSoundVolume} /><Toggle label="Background music" description="A separate soundtrack for every part of the galaxy" value={musicOn} onChange={setMusicOn} icon="music" /><Volume label="Music volume" value={musicVolume} onChange={setMusicVolume} /><div className="setting-row"><span className="setting-icon"><Icon name="save" /></span><div><b>Local progress</b><small>Your profile and results are stored only on this device.</small></div><button className="glass-button" onClick={() => { const data = JSON.stringify(profile ?? emptyProfile, null, 2); const blob = new Blob([data], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "grammar-galaxy-profile.json"; a.click(); URL.revokeObjectURL(url); }}>Export</button></div></div></section>}
    </main>

    {mission && <GameMission game={mission.game} topic={mission.topic} level={mission.level} soundOn={soundOn} soundVolume={soundVolume} hints={profile?.hints ?? 0} onUseHint={useHint} onExit={() => setMission(null)} onComplete={(reward) => {
      const current = profile ?? emptyProfile;
      const perfect = reward.correct === reward.total;
      const updated = { ...current, xp: current.xp + reward.xp, stardust: current.stardust + reward.stardust, missions: current.missions + 1, hints: Math.min(9, current.hints + (perfect ? 1 : 0)), perfectMissions: current.perfectMissions + (perfect ? 1 : 0) };
      const nextHistory = JSON.parse(window.localStorage.getItem("grammar-galaxy-history") || "[]") as HistoryItem[];
      if (soundOn && soundVolume > 0) { playSound(perfect ? "achievement" : "reward", soundVolume); playNamedJingle(perfect ? "./jingle-achievement.mp3" : "./jingle-mission-complete.mp3", soundVolume); }
      setHistory(nextHistory); commitProfile(updated, nextHistory); setMission(null); setView("profile");
    }} />}

    <AudioDock musicOn={musicOn} soundOn={soundOn} musicVolume={musicVolume} soundVolume={soundVolume} onMusic={setMusicOn} onSound={setSoundOn} onMusicVolume={setMusicVolume} onSoundVolume={setSoundVolume} />

    <nav className="mobile-nav" aria-label="Mobile navigation"><NavButton active={view === "home"} onClick={() => nav("home")} icon="home" label="Home" /><NavButton active={view === "missions"} onClick={() => nav("missions")} icon="missions" label="Missions" /><NavButton active={view === "profile"} onClick={() => nav("profile")} icon="profile" label="Profile" /><NavButton active={view === "cabin"} onClick={() => nav("cabin")} icon="cabin" label="Cabin" /><NavButton active={view === "shop"} onClick={() => nav("shop")} icon="shop" label="Shop" /></nav>

    {profileOpen && <Modal onClose={profile ? () => setProfileOpen(false) : undefined}><span className="eyebrow">PILOT REGISTRATION</span><h2>{profile ? "Edit your profile" : "Create your profile"}</h2><p className="modal-intro">Choose a call sign, illustrated avatar and default mission level. You can change them later.</p><label className="field"><span>Call sign</span><input maxLength={18} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Your name" autoFocus /></label><div className="field"><span>Choose an avatar</span><div className="avatar-grid">{avatars.map((avatar) => <button aria-label={avatar.name} className={draft.avatar === avatar.id ? "active" : ""} onClick={() => setDraft({ ...draft, avatar: avatar.id })} key={avatar.id}><img src={avatar.src} alt={avatar.name} /></button>)}</div></div><div className="field"><span>Default CEFR level</span><div className="level-grid">{levels.map((item) => <button className={draft.level === item ? "active" : ""} onClick={() => setDraft({ ...draft, level: item })} key={item}>{item}</button>)}</div></div><button className="primary-button full" onClick={saveProfile}>{profile ? "Save changes" : "Create profile"}<Icon name="next" /></button></Modal>}
    {instructionGame && <Modal onClose={() => setInstructionGame(null)}><div className="instruction-title"><div><span className="eyebrow">HOW TO PLAY</span><h2>{instructionGame.title}</h2></div></div><ol className="instruction-list">{instructionGame.instructions.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol><button className="primary-button full" onClick={() => { setInstructionGame(null); setSelectedGame(instructionGame); }}>Choose topic and level<Icon name="next" /></button></Modal>}
    {selectedGame && <Modal onClose={() => setSelectedGame(null)}><div className="instruction-title"><div><span className="eyebrow">MISSION SETUP</span><h2>{selectedGame.title}</h2></div></div><label className="field"><span>Grammar topic</span><select value={topic} onChange={(event) => setTopic(event.target.value)}>{availableTopics.map((item) => <option key={item}>{item}</option>)}</select></label><div className="field"><span>Mission level</span><div className="level-grid">{levels.map((item) => <button className={level === item ? "active" : ""} onClick={() => setLevel(item)} key={item}>{item}</button>)}</div></div><div className="mission-summary"><span>{Math.min(10, grammarTasks.filter((task) => task.level === level && task.topic === topic).length)} tasks</span><span>Final report</span><span>{profile?.hints ?? 0} hint charges</span></div><button className="primary-button full" onClick={() => { setMission({ game: selectedGame.id, topic, level }); setSelectedGame(null); }}>Start mission<Icon name="next" /></button></Modal>}
  </div>;
}

function ProfileView({ profile, rank, history, onEdit, onCabin }: { profile: Profile; rank: string; history: HistoryItem[]; onEdit: () => void; onCabin: () => void }) {
  const completed = new Map<string, { correct: number; total: number }>();
  history.forEach((item) => { const old = completed.get(item.topic) ?? { correct: 0, total: 0 }; completed.set(item.topic, { correct: old.correct + item.correct, total: old.total + item.total }); });
  const progress = [...completed.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 6);
  const unlockedCount = achievementDefinitions.filter((award) => award.unlocked(profile, history)).length;
  return <section className="section dashboard-page"><div className="section-heading"><div><span className="eyebrow">PILOT DATABASE</span><h2>My Profile</h2></div><button className="ghost-button" onClick={onEdit}>Edit profile</button></div><div className="profile-grid"><article className="profile-card captain-card"><img className="big-avatar" src={avatarSrc(profile.avatar)} alt="Selected space cadet" /><div><span className="status-dot">ONLINE</span><h3>{profile.name || "Explorer"}</h3><p>{rank} · Level {profile.level}</p></div><div className="xp-bar"><span style={{ width: `${Math.min(100, (profile.xp % 500) / 5)}%` }} /></div><small>{profile.xp} XP collected</small></article><Stat icon="xp" value={profile.xp} label="Total XP" /><Stat icon="dust" value={profile.stardust} label="Stardust" /><Stat icon="hint" value={profile.hints} label="Hint charges" /><article className="profile-card wide-card"><h3>Grammar progress</h3>{progress.length ? <div className="progress-list">{progress.map(([name, data]) => { const value = Math.round((data.correct / data.total) * 100); return <div key={name}><span>{name}</span><i><b style={{ width: `${value}%` }} /></i><small>{value}%</small></div>; })}</div> : <p className="empty-copy">Complete a mission to begin your grammar map.</p>}</article><article className="profile-card achievement-card"><div className="achievement-heading"><h3>Achievements</h3><span>{unlockedCount} / {achievementDefinitions.length} unlocked</span></div><div className="award-list">{achievementDefinitions.map((award) => { const unlocked = award.unlocked(profile, history); return <div className={unlocked ? "unlocked" : "locked"} key={award.id}><img src={award.image} alt="" /><span><b>{award.name}</b><small>{award.description}</small></span></div>; })}</div></article><article className="profile-card cabin-card"><span className="eyebrow">MY CABIN</span><h3>{profile.equippedItems.length ? "Your cabin is taking shape" : "Ready for an upgrade?"}</h3><p>Enter your spacecraft cabin, see your avatar and arrange up to six illustrated decorations.</p><button className="primary-button small" onClick={onCabin}>Enter cabin<Icon name="next" /></button></article></div></section>;
}

function Cabin({ profile, onShop, onToggleItem, onArrivalComplete }: { profile: Profile; onShop: () => void; onToggleItem: (item: (typeof shopItems)[number]) => void; onArrivalComplete: () => void }) {
  const displayed = profile.equippedItems.map((id) => shopItems.find((item) => item.id === id)).filter((item): item is (typeof shopItems)[number] => Boolean(item));
  const owned = profile.purchases.map((id) => shopItems.find((item) => item.id === id)).filter((item): item is (typeof shopItems)[number] => Boolean(item));
  const [arrivingItem, setArrivingItem] = useState<string | null>(profile.newCabinItem);
  useEffect(() => {
    if (!profile.newCabinItem) return;
    const timer = window.setTimeout(() => { setArrivingItem(null); onArrivalComplete(); }, 2600);
    return () => window.clearTimeout(timer);
  }, [profile.newCabinItem, onArrivalComplete]);
  return <section className="section cabin-page"><div className="section-heading"><div><span className="eyebrow">PERSONAL QUARTERS</span><h2>My Space Cabin</h2></div><button className="ghost-button" onClick={onShop}>Open shop</button></div><div className="full-cabin"><img className="cabin-background" src="./assets/scenes/cabin.webp" alt="A cosy spacecraft cabin with a wide window overlooking a purple planet" /><div className="cabin-shade" /><div className="cabin-console"><span>GRAMMAR DRIVE</span><b>{profile.xp} XP</b><div><i style={{ width: `${Math.min(100, (profile.xp % 500) / 5)}%` }} /></div></div><div className="cabin-edit-state"><b>{displayed.length}</b><span>decorations placed</span></div><div className="cabin-pilot"><span className="pilot-bubble">Welcome home, {profile.name || "Explorer"}!</span><img src={avatarSrc(profile.avatar)} alt="Your space cadet" /></div>{displayed.length ? <div className="placed-decorations">{displayed.map((item, index) => <div className={`cabin-slot cabin-slot-${(index % 20) + 1} ${arrivingItem === item.id ? "materialising" : ""}`} title={item.name} key={item.id}><span /><img src={cabinItemSrc(item.id)} alt={item.name} /><small>{item.name}</small>{arrivingItem === item.id && <div className="materialise-dust" aria-hidden="true">{Array.from({ length: 32 }, (_, dust) => <i style={{ "--a": `${dust * 137.5}deg`, "--r": `${42 + (dust % 6) * 12}px`, "--d": `${(dust % 8) * .07}s` } as React.CSSProperties} key={dust} />)}</div>}</div>)}</div> : <button className="empty-cabin-prompt" onClick={onShop}><span>YOUR CABIN IS READY</span><b>Choose a decoration in the shop</b></button>}</div><div className="cabin-inventory"><div><b>In the cabin</b><span>{displayed.length} objects placed</span></div><div><b>Owned items</b><span>{owned.length} / {shopItems.length}</span></div><div><b>Cabin budget</b><span className="inline-value"><Icon name="dust" />{profile.stardust}</span></div></div>{owned.length > 0 && <div className="owned-catalog"><div className="owned-heading"><div><span className="eyebrow">MY DECORATIONS</span><h3>Decorate the cabin</h3></div><small>Every purchased object can be placed directly in the room.</small></div><div className="owned-grid">{owned.map((item) => { const active = profile.equippedItems.includes(item.id); return <article className={active ? "active" : ""} key={item.id}><img src={item.image} alt={item.name} /><div><b>{item.name}</b><small>{active ? "Placed in the cabin" : "Not placed"}</small></div><button className="glass-button" onClick={() => onToggleItem(item)}>{active ? "Remove" : "Place"}</button></article>; })}</div></div>}</section>;
}

function Shop({ profile, onBuy, onBuyHint }: { profile: Profile; onBuy: (item: (typeof shopItems)[number]) => void; onBuyHint: () => void }) {
  return <section className="section shop-page"><div className="shop-hero"><img src="./assets/scenes/shop.webp" alt="A futuristic orbital rewards boutique" /><div><span className="eyebrow">ORBITAL MARKET</span><h2>Space Shop</h2><p>Spend mission Stardust on twenty illustrated cabin objects or recharge a limited hint.</p><span className="shop-balance"><Icon name="dust" />{profile.stardust} Stardust</span></div></div><div className="shop-catalog-title"><div><span className="eyebrow">CABIN COLLECTION</span><h3>Twenty objects to collect</h3></div><span>{profile.purchases.length} owned / {profile.equippedItems.length} displayed</span></div><div className="shop-grid"><article className="shop-card hint-card"><img src="./assets/decor/object-08.webp" alt="Blue hint crystal" /><h3>Hint Charge</h3><p>This is a mission hint, not a cabin decoration. Maximum 9 charges.</p><button className="primary-button small" onClick={onBuyHint} disabled={profile.stardust < 35 || profile.hints >= 9}><Icon name="dust" />Buy hint 35</button></article>{shopItems.map((item) => { const owned = profile.purchases.includes(item.id); const displayed = profile.equippedItems.includes(item.id); return <article className={`shop-card ${owned ? "owned" : ""} ${displayed ? "equipped" : ""}`} key={item.id}><img src={item.image} alt={item.name} /><h3>{item.name}</h3><p>{displayed ? "Placed in your cabin" : owned ? "Owned. Tap to place it in the cabin." : item.kind}</p><button className="primary-button small" onClick={() => onBuy(item)} disabled={!owned && profile.stardust < item.price}>{displayed ? "Remove from cabin" : owned ? "Place in cabin" : <><Icon name="dust" />Buy {item.price}</>}</button></article>; })}</div></section>;
}
function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: IconName; label: string }) { return <button className={active ? "active" : ""} onClick={onClick}><Icon name={icon} /><span>{label}</span></button>; }
function Modal({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) { return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal-card">{onClose && <button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>}{children}</div></div>; }
function Toggle({ label, description, value, onChange, icon }: { label: string; description: string; value: boolean; onChange: (value: boolean) => void; icon: IconName }) { return <div className="setting-row"><span className="setting-icon"><Icon name={icon} /></span><div><b>{label}</b><small>{description}</small></div><button className={`toggle ${value ? "on" : ""}`} onClick={() => onChange(!value)} aria-pressed={value}><i /></button></div>; }
function Volume({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label className="volume-row"><span>{label}</span><input type="range" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} /><b>{value}%</b></label>; }
function AudioDock({ musicOn, soundOn, musicVolume, soundVolume, onMusic, onSound, onMusicVolume, onSoundVolume }: { musicOn: boolean; soundOn: boolean; musicVolume: number; soundVolume: number; onMusic: (value: boolean) => void; onSound: (value: boolean) => void; onMusicVolume: (value: number) => void; onSoundVolume: (value: number) => void }) {
  const [open, setOpen] = useState(false);
  const setMusicVolume = (value: number) => { onMusicVolume(value); onMusic(value > 0); };
  const setEffectsVolume = (value: number) => { onSoundVolume(value); onSound(value > 0); };
  return <aside className={`audio-dock ${open ? "open" : ""}`} aria-label="Audio controls"><button className="audio-dock-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}><Icon name="music" /><span>Audio</span></button><div className="audio-dock-panel"><div className="audio-dock-title"><b>Audio control</b><small>Available everywhere</small></div><label><button onClick={() => { const enabled = !(musicOn && musicVolume > 0); onMusic(enabled); if (enabled && musicVolume === 0) onMusicVolume(24); }} aria-pressed={musicOn && musicVolume > 0}><Icon name="music" /><span>Music</span><i className={musicOn && musicVolume > 0 ? "on" : ""} /></button><input aria-label="Music volume" type="range" min="0" max="100" value={musicOn ? musicVolume : 0} onChange={(event) => setMusicVolume(Number(event.target.value))} /><b>{musicOn ? musicVolume : 0}%</b></label><label><button onClick={() => { const enabled = !(soundOn && soundVolume > 0); onSound(enabled); if (enabled && soundVolume === 0) { onSoundVolume(55); window.setTimeout(() => playSound("select", 55), 0); } else if (enabled) window.setTimeout(() => playSound("select", soundVolume), 0); }} aria-pressed={soundOn && soundVolume > 0}><Icon name="sound" /><span>Effects</span><i className={soundOn && soundVolume > 0 ? "on" : ""} /></button><input aria-label="Effects volume" type="range" min="0" max="100" value={soundOn ? soundVolume : 0} onChange={(event) => setEffectsVolume(Number(event.target.value))} /><b>{soundOn ? soundVolume : 0}%</b></label></div></aside>;
}
function Stat({ icon, value, label }: { icon: IconName; value: number; label: string }) { return <article className="profile-card stat-card"><span><Icon name={icon} /></span><b>{value}</b><small>{label}</small></article>; }

function Icon({ name }: { name: IconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6" /></>,
    missions: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3" /></>,
    profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" /></>,
    cabin: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M7 8h10v7H7zM8 20v-3M16 20v-3" /></>,
    shop: <><path d="M5 9h14l-1 11H6L5 9Z" /><path d="M9 9V7a3 3 0 0 1 6 0v2" /></>,
    settings: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
    dust: <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />,
    xp: <path d="m13 2-8 12h6l-1 8 9-13h-6V2Z" />,
    streak: <path d="M12 22c4 0 7-3 7-7 0-5-3-8-6-12 0 4-4 5-5 9-2-1-2-3-2-4-2 3-3 5-3 8 0 3 3 6 6 6 0-3 1-5 3-7 2 2 3 4 3 7h-3Z" />,
    hint: <><path d="M9 18h6M10 22h4" /><path d="M8 14c-1.3-1.1-2-2.7-2-4.5a6 6 0 1 1 12 0c0 1.8-.7 3.4-2 4.5-1 .9-1 1.7-1 2H9c0-.3 0-1.1-1-2Z" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    next: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    sound: <><path d="M5 10v4h4l5 4V6L9 10H5Z" /><path d="M17 9c1 1 1 5 0 6M20 7c2 3 2 7 0 10" /></>,
    music: <><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></>,
    save: <><path d="M5 3h12l3 3v15H4V3h1Z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>{paths[name]}</svg>;
}

function useCosmicCursor() {
  useEffect(() => {
    let last = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || Date.now() - last < 34) return;
      last = Date.now();
      const particle = document.createElement("i");
      particle.className = "cursor-dust";
      particle.style.left = `${event.clientX}px`; particle.style.top = `${event.clientY}px`;
      document.body.appendChild(particle); window.setTimeout(() => particle.remove(), 700);
    };
    window.addEventListener("pointermove", move); return () => window.removeEventListener("pointermove", move);
  }, []);
}

function useLocationMusic(track: string, enabled: boolean, volume: number) {
  const fallback = useRef<{ context: AudioContext; gain: GainNode; oscillators: OscillatorNode[] } | null>(null);
  const unlocked = useRef(false);
  useEffect(() => {
    const stopFallback = () => { if (!fallback.current) return; fallback.current.oscillators.forEach((oscillator) => { try { oscillator.stop(); } catch {} }); void fallback.current.context.close(); fallback.current = null; };
    const startFallback = () => {
      if (!enabled || fallback.current) return;
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass(); const gain = context.createGain(); gain.gain.value = (volume / 100) * .025; gain.connect(context.destination);
      const root = track.includes("race") ? 123.47 : track.includes("repair") ? 98 : track.includes("codebreaker") ? 116.54 : track.includes("cabin") ? 146.83 : track.includes("shop") ? 130.81 : 110;
      const oscillators = [root, root * 1.5, root * 2].map((frequency, index) => { const oscillator = context.createOscillator(); const localGain = context.createGain(); oscillator.type = index === 1 ? "sine" : "triangle"; oscillator.frequency.value = frequency; localGain.gain.value = .24 / (index + 1); oscillator.connect(localGain); localGain.connect(gain); oscillator.start(); return oscillator; });
      fallback.current = { context, gain, oscillators };
    };
    const start = () => {
      unlocked.current = true;
      stopCurrentMusic();
      if (!enabled || volume <= 0) return;
      const token = musicState.token + 1;
      musicState.token = token;
      const named = new Audio(track); named.loop = true; named.preload = "auto"; named.volume = Math.min(1, volume / 100);
      const startFallbackForCurrent = () => { if (musicState.token === token) startFallback(); };
      named.addEventListener("playing", stopFallback, { once: true }); named.addEventListener("error", startFallbackForCurrent, { once: true });
      musicState.audio = named; musicState.track = track; void named.play().catch(() => { if (musicState.token === token) startFallback(); });
    };
    if (unlocked.current) start(); else window.addEventListener("pointerdown", start, { once: true });
    if (!enabled || volume <= 0) { stopCurrentMusic(); stopFallback(); }
    return () => { window.removeEventListener("pointerdown", start); stopCurrentMusic(); stopFallback(); };
  }, [enabled, track, volume]);
  useEffect(() => {
    if (volume <= 0 || !enabled) stopCurrentMusic();
    else if (musicState.audio) musicState.audio.volume = Math.min(1, volume / 100);
    if (fallback.current) fallback.current.gain.gain.setTargetAtTime((volume / 100) * .025, fallback.current.context.currentTime, .08);
  }, [enabled, volume]);
}
