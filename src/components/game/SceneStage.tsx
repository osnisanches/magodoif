import { axisGlow } from "./ParticleLayer";
import type { AxisId } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface Props {
  axis: AxisId | "gold";
  burst: number;
  brewing?: boolean;
  dropZoneRef: React.RefObject<HTMLDivElement | null>;
}

export function SceneStage({ axis, burst, brewing, dropZoneRef }: Props) {
  const glow = axisGlow(axis);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="wizard-position absolute bottom-0 right-0 z-10 h-full w-[34%] sm:w-[28%]">
        <div className="wizard-portrait absolute top-0 right-0 h-[53%] w-auto sm:h-[55%]">
          <img
            src={`${import.meta.env.BASE_URL}game/wizard.png`}
            alt=""
            className="wizard-idle h-full w-auto max-w-none object-contain"
            draggable={false}
          />
        </div>
      </div>

      <div
        ref={dropZoneRef}
        data-drop="cauldron"
        className="pointer-events-auto absolute left-1/2 top-[45%] z-20 h-[74%] w-[90%] max-w-[544px]"
        style={{ transform: "translateX(-50%)" }}
      >
        <div key={burst} className={cn("absolute inset-0", burst > 0 && "cauldron-react")}>
          <div
            className="pointer-events-none absolute left-1/2 top-[10%] h-24 w-40 -translate-x-1/2 rounded-full blur-2xl"
            style={{ background: glow, opacity: 0.55, animation: "pulse-glow 2.4s ease-in-out infinite" }}
          />
          <img
            src={`${import.meta.env.BASE_URL}game/cauldron.png`}
            alt="Caldeirão"
            className={cn(
              "cauldron-idle absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 object-contain",
              brewing && "scale-110",
            )}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
