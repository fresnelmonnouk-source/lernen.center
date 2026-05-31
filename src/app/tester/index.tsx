import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Accent } from '@/theme/tokens';

/** Sous-menu TESTER : Quiz + Examen. */
export default function TesterScreen() {
  return (
    <ScreenScaffold eyebrow="MENU 02" title="Tester" accent="sans triche.">
      <MenuList
        items={[
          {
            mark: 'Q',
            title: 'Quiz',
            subtitle: 'QCM RAPIDE · SUPER QUIZ ÉCRITURE',
            color: Accent.yellow,
            href: '/tester/quiz',
          },
          {
            mark: 'E',
            title: 'Examen',
            subtitle: 'TEST IA · CERTIFICATION',
            color: Accent.red,
            href: '/tester/examen',
          },
        ]}
      />
    </ScreenScaffold>
  );
}
