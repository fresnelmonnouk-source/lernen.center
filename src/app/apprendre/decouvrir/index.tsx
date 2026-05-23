import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Palette } from '@/theme/bauhaus';

/** Sous-menu DÉCOUVRIR : Vocabulaire (flashcards) + Conjugaison. */
export default function DecouvrirScreen() {
  return (
    <ScreenScaffold eyebrow="APPRENDRE" title="Découvrir">
      <MenuList
        items={[
          {
            mark: 'V',
            title: 'Vocabulaire',
            subtitle: '1377 MOTS · FLASHCARDS PAR CATÉGORIE + NIVEAU',
            color: Palette.red,
            href: '/apprendre/decouvrir/vocabulaire',
          },
          {
            mark: 'K',
            title: 'Conjugaison',
            subtitle: '98 VERBES · CONSULTER · QUIZ · RÉGULIER ?',
            color: Palette.blue,
            href: '/apprendre/decouvrir/conjugaison',
          },
        ]}
      />
    </ScreenScaffold>
  );
}
