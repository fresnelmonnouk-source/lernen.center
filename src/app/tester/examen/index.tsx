import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Accent } from '@/theme/tokens';

/** Sous-menu EXAMEN : Test IA + Préparation Certification. */
export default function ExamenScreen() {
  return (
    <ScreenScaffold eyebrow="TESTER" title="Examen">
      <MenuList
        items={[
          {
            mark: 'AI',
            title: 'Test IA',
            subtitle: 'PERSONNALISÉ · DOMAINE / NIVEAU / DIFFICULTÉ',
            color: Accent.purple,
            href: '/tester/examen/test-ia',
          },
          {
            mark: 'C',
            title: 'Certification',
            subtitle: 'LESEN · SCHREIBEN · A1 À B2',
            color: Accent.green,
            href: '/tester/examen/certification',
          },
        ]}
      />
    </ScreenScaffold>
  );
}
