import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { Accent } from '@/theme/tokens';

/**
 * Certification Goethe (4 compétences). Lesen + Schreiben en V1.
 * Hören + Sprechen verrouillés (V2 — OpenAI TTS / Whisper).
 */
export default function CertificationScreen() {
  return (
    <ScreenScaffold eyebrow="EXAMEN" title="Certification" accent="Goethe">
      <MenuList
        items={[
          {
            mark: 'L',
            title: 'Lesen',
            subtitle: 'COMPRÉHENSION ÉCRITE · 4 PARTIES B1',
            color: Accent.blue,
            href: '/tester/examen/certification/lesen',
          },
          {
            mark: 'S',
            title: 'Schreiben',
            subtitle: 'EXPRESSION ÉCRITE · 4 CRITÈRES GOETHE',
            color: Accent.green,
            href: '/tester/examen/certification/schreiben',
          },
          { mark: 'H', title: 'Hören', subtitle: 'COMPRÉHENSION ORALE · V2', locked: true },
          { mark: 'P', title: 'Sprechen', subtitle: 'EXPRESSION ORALE · V2', locked: true },
        ]}
      />
      <Txt font="serifItalic" size={11} tone="ink2" lineHeight={16}>
        Tests inspirés du format Goethe-Zertifikat. Contenus originaux générés par IA. Non affilié au Goethe-Institut.
      </Txt>
    </ScreenScaffold>
  );
}
