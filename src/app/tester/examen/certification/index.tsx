import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { StyleSheet, Text } from 'react-native';

import { Palette } from '@/theme/bauhaus';

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
            color: Palette.blue,
            href: '/tester/examen/certification/lesen',
          },
          {
            mark: 'S',
            title: 'Schreiben',
            subtitle: 'EXPRESSION ÉCRITE · 4 CRITÈRES GOETHE',
            color: Palette.green,
            href: '/tester/examen/certification/schreiben',
          },
          { mark: 'H', title: 'Hören', subtitle: 'COMPRÉHENSION ORALE · V2', locked: true },
          { mark: 'P', title: 'Sprechen', subtitle: 'EXPRESSION ORALE · V2', locked: true },
        ]}
      />
      <Text style={styles.disclaimer}>
        Tests inspirés du format Goethe-Zertifikat. Contenus originaux générés par IA. Non affilié au Goethe-Institut.
      </Text>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  disclaimer: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Palette.ink2,
    lineHeight: 16,
  },
});
