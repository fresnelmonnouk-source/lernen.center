import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { CERT_DISCLAIMER } from '@/certification/specs';
import { Accent } from '@/theme/tokens';

/**
 * Préparation aux certifications d'allemand (4 compétences). Lesen + Schreiben en V1.
 * Hören + Sprechen verrouillés (V2 — OpenAI TTS / Whisper).
 * Préparation indépendante, contenus 100% IA, sans affiliation officielle.
 */
export default function CertificationScreen() {
  return (
    <ScreenScaffold eyebrow="EXAMEN" title="Certification">
      <MenuList
        items={[
          {
            mark: 'L',
            title: 'Lesen',
            subtitle: 'COMPRÉHENSION ÉCRITE',
            color: Accent.blue,
            href: '/tester/examen/certification/lesen',
          },
          {
            mark: 'S',
            title: 'Schreiben',
            subtitle: 'EXPRESSION ÉCRITE · CORRECTION IA 4 CRITÈRES',
            color: Accent.green,
            href: '/tester/examen/certification/schreiben',
          },
          { mark: 'H', title: 'Hören', subtitle: 'COMPRÉHENSION ORALE · V2', locked: true },
          { mark: 'P', title: 'Sprechen', subtitle: 'EXPRESSION ORALE · V2', locked: true },
        ]}
      />
      <Txt font="serifItalic" size={11} tone="ink2" lineHeight={16}>
        {CERT_DISCLAIMER}
      </Txt>
    </ScreenScaffold>
  );
}
