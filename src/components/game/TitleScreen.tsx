import { Link } from "@tanstack/react-router";
import { FlaskConical, Hand, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onStart: () => void;
}

export function TitleScreen({ onStart }: Props) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center overflow-y-auto bg-bg/60 px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] text-center backdrop-blur-[3px]">
      <div className="my-auto flex w-full max-w-2xl flex-col items-center py-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
          IFPA Campus Bragança
        </p>
        <h1 className="font-display max-w-xl text-[2.35rem] font-semibold leading-[1.12] tracking-tight text-fg sm:text-6xl">
          O Mago das Vocações
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted sm:text-lg">
          Arraste palavras-essência para o caldeirão e descubra qual curso do campus combina com o seu jeito de ver o mundo.
        </p>

        <ol className="mt-7 grid w-full gap-3 text-left sm:grid-cols-3">
          {[
            { icon: Hand, title: "Escolha o nível", body: "Técnico, graduação ou pós." },
            { icon: FlaskConical, title: "Solte no caldeirão", body: "Cinco afinidades depois do nível." },
            { icon: Sparkles, title: "Revele a poção", body: "O curso com maior afinidade." },
          ].map((step) => (
            <li
              key={step.title}
              className="rounded-lg border border-border bg-surface/85 px-4 py-3"
            >
              <step.icon className="mb-2 size-5 text-primary" />
              <p className="font-medium text-fg">{step.title}</p>
              <p className="mt-1 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <Button size="lg" className="mt-8 min-h-12 min-w-48" onClick={onStart}>
          Começar o ritual
        </Button>

        <Link
          to="/admin"
          className="mt-5 text-xs text-subtle underline-offset-4 hover:text-muted hover:underline"
        >
          Painel da equipe
        </Link>
      </div>
    </div>
  );
}
