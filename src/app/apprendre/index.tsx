import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Palette } from '@/theme/bauhaus';

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
            color: Palette.blue,
            href: '/apprendre/cours',
          },
          {
            mark: '🎴',
            title: 'Découvrir',
            subtitle: 'VOCABULAIRE · CONJUGAISON',
            color: Palette.green,
            href: '/apprendre/decouvrir',
          },
        ]}
      />
    </ScreenScaffold>
  );
}
