import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { PhaseNote } from '@/components/ui/PhaseNote';

export default function QuizScreen() {
  return (
    <ScreenScaffold eyebrow="TESTER" title="Quiz">
      <PhaseNote label="Quiz rapide (QCM 10 questions sur le vocabulaire), Super Quiz (écriture libre du mot allemand, correction stricte article + orthographe), et Quiz quotidien (1/jour basé sur l'historique)." />
    </ScreenScaffold>
  );
}
