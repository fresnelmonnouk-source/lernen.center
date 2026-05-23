import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Accent } from '@/theme/tokens';

/** Sous-menu APPRENDRE : Cours (IA) + Découvrir (vocab + conjugaison). */
export default function ApprendreScreen() {
  return (
    <ScreenScaffold eyebrow="MENU 01" title="Apprendre" accent="l'allemand">
      <MenuList
        items={[
          {
            mark: '📖',
            title: 'Cours',
            subtitle: 'GÉNÉRÉS PAR IA · ÉCOUTE · MINI-EXAMEN',
            color: Accent.blue,
            href: '/apprendre/cours',
          },
          {
            mark: '🎴',
            title: 'Découvrir',
            subtitle: 'VOCABULAIRE · CONJUGAISON',
            color: Accent.green,
            href: '/apprendre/decouvrir',
          },
        ]}
      />
    </ScreenScaffold>
  );
}
