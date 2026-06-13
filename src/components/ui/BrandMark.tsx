import { View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { Accent } from '@/theme/tokens';

/** Wordmark: my + LERNEN (Bricolage 800) + .de — « my » et « .de » mêmes
 *  taille/typo (DM Serif italic, rouge), encadrant le LERNEN inchangé → myLERNEN.de
 *  (aligné sur le domaine mylernen.de). */
export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Txt font="serifItalic" size={size * 0.7} color={Accent.red} tracking={-0.5}>
        my
      </Txt>
      <Txt font="display" size={size} uppercase tracking={-1.5}>
        LERNEN
      </Txt>
      <Txt font="serifItalic" size={size * 0.7} color={Accent.red} tracking={-0.5}>
        .de
      </Txt>
    </View>
  );
}
