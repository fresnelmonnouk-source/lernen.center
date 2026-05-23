import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Accent } from '@/theme/tokens';

/** Sous-menu TESTER : Quiz + Examen. */
export default function TesterScreen() {
  return (
    <ScreenScaffold eyebrow="MENU 02" title="Tester" accent="ton niveau">
      <MenuList
        items={[
          {
            mark: '🎲',
            title: 'Quiz',
            subtitle: 'RAPIDE · SUPER QUIZ · QUOTIDIEN',
            color: Accent.yellow,
            href: '/tester/quiz',
          },
          {
            mark: '🎯',
            title: 'Examen',
            subtitle: 'TEST IA · CERTIFICATION GOETHE',
            color: Accent.red,
            href: '/tester/examen',
          },
        ]}
      />
    </ScreenScaffold>
  );
}
