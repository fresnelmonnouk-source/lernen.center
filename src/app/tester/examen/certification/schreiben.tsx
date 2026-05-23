import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { PhaseNote } from '@/components/ui/PhaseNote';

export default function SchreibenScreen() {
  return (
    <ScreenScaffold eyebrow="CERTIFICATION" title="Schreiben">
      <PhaseNote label="Expression écrite : sujet généré (POST /api/cert-schreiben), correction selon les 4 critères officiels Goethe (POST /api/grade-schreiben). Contenus 100% originaux." />
    </ScreenScaffold>
  );
}
