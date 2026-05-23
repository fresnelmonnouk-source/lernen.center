import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { PhaseNote } from '@/components/ui/PhaseNote';

export default function TestIaScreen() {
  return (
    <ScreenScaffold eyebrow="EXAMEN" title="Test IA">
      <PhaseNote label="Examen personnalisé (70% QCM + 30% ouvert) : choix domaine / niveau / difficulté / nb de questions. Génération POST /api/generate-test, correction + bilan POST /api/grade-test, sauvegarde dans exam_history." />
    </ScreenScaffold>
  );
}
