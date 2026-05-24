import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { AuthScaffold } from '@/components/ui/AuthScaffold';
import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Input } from '@/components/ui/Input';
import { Txt } from '@/components/ui/Txt';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, LevelColor, Shadow, Spacing } from '@/theme/tokens';

type LevelCode = 'A1' | 'A2' | 'B1' | 'B2';
const LEVELS: { code: LevelCode; label: string }[] = [
  { code: 'A1', label: 'Débutant' },
  { code: 'A2', label: 'Élémentaire' },
  { code: 'B1', label: 'Intermédiaire' },
  { code: 'B2', label: 'Avancé' },
];

export default function OnboardingScreen() {
  const { session, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.display_name ?? '');
  const [level, setLevel] = useState<LevelCode>((profile?.current_level as LevelCode) ?? 'A1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!session) return;
    setError(null);
    setLoading(true);
    const { error: e } = await supabase.from('user_profiles').upsert({
      id: session.user.id,
      display_name: name.trim() || null,
      current_level: level,
      onboarding_completed: true,
    });
    if (e) {
      setError("Impossible d'enregistrer. Réessaie.");
      setLoading(false);
      return;
    }
    await refreshProfile(); // root gate then routes to the app
  };

  return (
    <AuthScaffold eyebrow="Bienvenue" title="On fait connaissance">
      <Input
        label="Ton prénom"
        value={name}
        onChangeText={setName}
        placeholder="Comment on t'appelle ?"
        autoCapitalize="words"
      />
      <View style={styles.levelsBlock}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
          Ton niveau d&apos;allemand
        </Txt>
        <View style={styles.levels}>
          {LEVELS.map((l) => (
            <LevelChip key={l.code} code={l.code} label={l.label} active={level === l.code} onPress={() => setLevel(l.code)} />
          ))}
        </View>
      </View>
      {error ? (
        <Txt font="mono" size={11} color={Accent.red}>
          {error}
        </Txt>
      ) : null}
      <ButtonPrimary label="C'est parti" onPress={submit} loading={loading} />
    </AuthScaffold>
  );
}

function LevelChip({ code, label, active, onPress }: { code: LevelCode; label: string; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  // Fixed text colors against the accent fill (readable in both themes).
  const fg = active ? (code === 'A2' ? '#0A0A0A' : '#F4F0E6') : colors.ink;

  return (
    <Pressable onPress={onPress} style={styles.chip}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.ink, transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }] },
        ]}
      />
      <View style={[styles.chipFace, { backgroundColor: active ? LevelColor[code] : colors.paper, borderColor: colors.ink }]}>
        <Txt font="display" size={24} color={fg}>
          {code}
        </Txt>
        <Txt font="mono" size={9} color={fg} uppercase tracking={0.5}>
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  levelsBlock: { gap: Spacing.two },
  levels: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three, justifyContent: 'space-between' },
  chip: { width: '47%' },
  chipFace: {
    borderWidth: Border.base,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: 2,
  },
});
