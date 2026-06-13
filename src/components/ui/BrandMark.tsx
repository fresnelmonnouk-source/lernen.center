import { View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { Accent } from '@/theme/tokens';

/** Wordmark « myLERNEN » en un bloc : « my » (DM Serif italic, rouge, assumé comme
 *  préfixe de marque) + LERNEN (Bricolage 800, ink). Le « .de » n'est PAS dans le
 *  logo (réservé à l'URL mylernen.de) — le « my » porte la promesse de perso IA. */
export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Txt font="serifItalic" size={size * 0.85} color={Accent.red} tracking={-0.5}>
        my
      </Txt>
      <Txt font="display" size={size} uppercase tracking={-1.5}>
        LERNEN
      </Txt>
    </View>
  );
}
