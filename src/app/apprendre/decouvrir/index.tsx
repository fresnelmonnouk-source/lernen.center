import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Accent } from '@/theme/tokens';

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
            color: Accent.red,
            href: '/apprendre/decouvrir/vocabulaire',
          },
          {
            mark: 'K',
            title: 'Conjugaison',
            subtitle: 'CONJUGUER (IA) · RÉGULIER OU IRRÉGULIER ?',
            color: Accent.blue,
            href: '/apprendre/decouvrir/conjugaison',
          },
        ]}
      />
    </ScreenScaffold>
  );
}
