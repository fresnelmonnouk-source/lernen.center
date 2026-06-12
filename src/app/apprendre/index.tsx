import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Accent } from '@/theme/tokens';

/** Sous-menu APPRENDRE : Cours (IA) + Découvrir (vocab + conjugaison). */
export default function ApprendreScreen() {
  return (
    <ScreenScaffold eyebrow="MENU 01" title="Apprendre" accent="autrement">
      <MenuList
        items={[
          {
            mark: 'C',
            title: 'Cours',
            subtitle: 'GÉNÉRÉS PAR IA · MINI-EXAMEN',
            color: Accent.blue,
            href: '/apprendre/cours',
          },
          {
            mark: 'D',
            title: 'Découvrir',
            subtitle: 'VOCABULAIRE · CONJUGAISON',
            color: Accent.green,
            href: '/apprendre/decouvrir',
          },
          {
            mark: 'H',
            title: 'Historique',
            subtitle: 'TES COURS PASSÉS · SCORES',
            color: Accent.purple,
            href: '/apprendre/historique',
          },
        ]}
      />
    </ScreenScaffold>
  );
}
