import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { PhaseNote } from '@/components/ui/PhaseNote';

export default function VocabulaireScreen() {
  return (
    <ScreenScaffold eyebrow="DÉCOUVRIR" title="Vocabulaire">
      <PhaseNote label="Flashcards des 1377 mots (data.js porté en TS), filtrables par catégorie et niveau CECRL. Articles colorés der/die/das. 100% local, fonctionne hors-ligne." />
    </ScreenScaffold>
  );
}
