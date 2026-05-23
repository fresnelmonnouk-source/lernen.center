import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { PhaseNote } from '@/components/ui/PhaseNote';

export default function LesenScreen() {
  return (
    <ScreenScaffold eyebrow="CERTIFICATION" title="Lesen">
      <PhaseNote label="Compréhension écrite au format Goethe (4 parties, niveau B1). Génération POST /api/cert-lesen. Contenus 100% originaux, jamais de vrais sujets Goethe." />
    </ScreenScaffold>
  );
}
