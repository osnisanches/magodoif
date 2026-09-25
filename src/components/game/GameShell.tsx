import { useEffect, useRef } from "react";
import { bindVisibilityResume, setMuted as setAudioMuted, startAmbient, unlockAudio } from "@/lib/game/audio";
import { useGame } from "@/lib/game/store";
import { Hud } from "./Hud";
import { ParticleLayer } from "./ParticleLayer";
import { PotionFinale } from "./PotionFinale";
import { ResultScreen } from "./ResultScreen";
import { SceneStage } from "./SceneStage";
import { TitleScreen } from "./TitleScreen";
import { WordCloud } from "./WordCloud";

interface Props {
  showAdminLink?: boolean;
}

export function GameShell({ showAdminLink = true }: Props) {
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const phase = useGame((s) => s.phase);
  const cloud = useGame((s) => s.cloud);
  const ingredients = useGame((s) => s.ingredients);
  const selectedLevel = useGame((s) => s.selectedLevel);
  const cauldronAxis = useGame((s) => s.cauldronAxis);
  const burst = useGame((s) => s.burst);
  const result = useGame((s) => s.result);
  const muted = useGame((s) => s.muted);
  const reducedMotion = useGame((s) => s.reducedMotion);
  const hydrate = useGame((s) => s.hydrate);
  const start = useGame((s) => s.start);
  const dropWord = useGame((s) => s.dropWord);
  const undo = useGame((s) => s.undo);
  const cycle = useGame((s) => s.cycle);
  const finishBrew = useGame((s) => s.finishBrew);
  const restart = useGame((s) => s.restart);
  const setMuted = useGame((s) => s.setMuted);

  useEffect(() => {
    hydrate();
    return bindVisibilityResume();
  }, [hydrate]);

  useEffect(() => {
    if (phase !== "playing" || !selectedLevel) return;
    const id = window.setInterval(cycle, 2800);
    return () => window.clearInterval(id);
  }, [phase, selectedLevel, cycle]);

  const onStart = () => {
    unlockAudio();
    startAmbient();
    start();
  };

  const onMute = () => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    if (!next) {
      unlockAudio();
      startAmbient();
    }
  };

  return (
    <main
      className="relative h-[100dvh] w-full overflow-hidden bg-bg text-fg"
      style={{
        touchAction: "none",
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}game/bg.jpg`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/35 via-bg/20 to-bg/70" />

      <ParticleLayer cauldronAxis={cauldronAxis} burst={burst} reducedMotion={reducedMotion} />
      {phase !== "title" && (
        <SceneStage axis={cauldronAxis} burst={burst} brewing={phase === "brewing"} dropZoneRef={dropZoneRef} />
      )}

      {phase === "playing" && (
        <WordCloud
          words={cloud}
          levelSelect={!selectedLevel}
          onDrop={dropWord}
          dropZoneRef={dropZoneRef}
        />
      )}

      {phase !== "title" && phase !== "result" && (
        <Hud
          count={ingredients.length}
          ingredients={ingredients}
          level={selectedLevel}
          canUndo={ingredients.length > 0 && phase !== "brewing"}
          muted={muted}
          onUndo={undo}
          onMute={onMute}
        />
      )}

      {phase !== "title" && (
        <header className="absolute left-0 right-0 top-0 z-30 flex items-start justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary">IFPA campus Bragança</p>
            <p className="font-display text-sm text-fg/90 sm:text-base">O Mago das Vocações</p>
          </div>
        </header>
      )}

      {phase === "title" && <TitleScreen onStart={onStart} showAdminLink={showAdminLink} />}
      {phase === "brewing" && <PotionFinale onDone={finishBrew} />}
      {phase === "result" && result && (
        <ResultScreen result={result} ingredients={ingredients} onRestart={restart} />
      )}

      {phase !== "title" && (
        <img
          src={`${import.meta.env.BASE_URL}game/logo.png`}
          alt="Selo do canal"
          className="pointer-events-none absolute bottom-20 right-20 z-50 h-32 w-auto max-w-[8rem] object-contain sm:h-36 sm:max-w-[9rem]"
          draggable={false}
        />
      )}
    </main>
  );
}
