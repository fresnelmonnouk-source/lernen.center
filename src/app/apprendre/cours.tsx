import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { PhaseNote } from '@/components/ui/PhaseNote';

export default function CoursScreen() {
  return (
    <ScreenScaffold eyebrow="APPRENDRE" title="Cours" accent="IA">
      <PhaseNote label="Génération de cours par IA (vocabulaire, grammaire, conjugaison, orthographe, expression, culture) en formats court/standard/long, avec mini-examen, historique et suggestions. Branché sur POST /api/generate-course." />
    </ScreenScaffold>
  );
}
