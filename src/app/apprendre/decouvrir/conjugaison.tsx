import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { PhaseNote } from '@/components/ui/PhaseNote';

export default function ConjugaisonScreen() {
  return (
    <ScreenScaffold eyebrow="DÉCOUVRIR" title="Conjugaison">
      <PhaseNote label="98 verbes pré-conjugués (local) + consultation IA de n'importe quel verbe (POST /api/conjugate), tableau à remplir (quiz), et « régulier ou irrégulier ? » avec explication (POST /api/check-irregular)." />
    </ScreenScaffold>
  );
}
