import { View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { Accent } from '@/theme/tokens';

/** Wordmark: LERNEN (Bricolage 800) + .de (DM Serif italic, red). */
export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Txt font="display" size={size} uppercase tracking={-1.5}>
        LERNEN
      </Txt>
      <Txt font="serifItalic" size={size * 0.7} color={Accent.red} tracking={-0.5}>
        .de
      </Txt>
    </View>
  );
}
