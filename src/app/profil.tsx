import { type ReactNode, useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Input } from '@/components/ui/Input';
import { MenuList } from '@/components/ui/MenuList';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { api, ApiError } from '@/lib/api';
import { COPY } from '@/lib/copy';
import { supabase } from '@/lib/supabase';
import { DeleteAccountDialog } from '@/profil/DeleteAccountDialog';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, LevelColor, Shadow, Spacing } from '@/theme/tokens';

const APP_VERSION = '1.0.0 · beta';

type LevelCode = 'A1' | 'A2' | 'B1' | 'B2';
const LEVELS: { code: LevelCode; label: string }[] = [
  { code: 'A1', label: 'Débutant' },
  { code: 'A2', label: 'Élémentaire' },
  { code: 'B1', label: 'Intermédiaire' },
  { code: 'B2', label: 'Avancé' },
];

export default function ProfilScreen() {
  const { colors } = useTheme();
  const { profile, session, refreshProfile, signOut } = useAuth();

  const email = session?.user?.email ?? '—';
  const provider = session?.user?.app_metadata?.provider ?? 'email';

  const [name, setName] = useState(profile?.display_name ?? '');
  const [level, setLevel] = useState<LevelCode>((profile?.current_level as LevelCode) ?? 'A1');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [exporting, setExporting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const dirty = name.trim() !== (profile?.display_name ?? '').trim() || level !== profile?.current_level;

  const save = async () => {
    if (!session) return;
    setSaveError(null);
    setSaved(false);
    setSaving(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({ display_name: name.trim() || null, current_level: level })
      .eq('id', session.user.id);
    if (error) {
      setSaveError('Enregistrement impossible. Réessaie.');
      setSaving(false);
      return;
    }
    await refreshProfile();
    setSaving(false);
    setSaved(true);
  };

  const exportData = async () => {
    setExporting(true);
    try {
      const res = await api.exportUserData();
      const json = JSON.stringify(res.data, null, 2);
      // Partage natif (mail, notes, Drive…). Fichier dédié = amélioration future.
      await Share.share({ message: json, title: 'Mes données Lernen' });
    } catch (e) {
      Alert.alert('Export impossible', e instanceof ApiError ? e.message : COPY.errGeneric);
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScreenScaffold eyebrow="Ton compte" title="Profil">
      {/* Identité */}
      <Card>
        <Txt font="display" size={26} uppercase tracking={-0.5}>
          {profile?.display_name?.trim() || 'Toi'}
        </Txt>
        <Txt font="mono" size={11} tone="ink2" style={styles.email}>
          {email}
        </Txt>
        <View style={styles.identityRow}>
          <View style={[styles.levelBadge, { backgroundColor: LevelColor[level], borderColor: colors.ink }]}>
            <Txt font="display" size={14} color={level === 'A2' ? '#0A0A0A' : '#F4F0E6'}>
              {`NIVEAU ${level}`}
            </Txt>
          </View>
          <Txt font="mono" size={10} tone="ink2" uppercase tracking={1}>
            {`via ${provider}`}
          </Txt>
        </View>
      </Card>

      {/* Édition */}
      <Section title="Modifier" />
      <Input label="Ton prénom" value={name} onChangeText={setName} placeholder="Prénom ou pseudo" autoCapitalize="words" />
      <View style={styles.levels}>
        {LEVELS.map((l) => (
          <LevelChip key={l.code} code={l.code} label={l.label} active={level === l.code} onPress={() => setLevel(l.code)} />
        ))}
      </View>
      {saveError ? (
        <Txt font="mono" size={11} color={Accent.red}>
          {saveError}
        </Txt>
      ) : null}
      {saved && !dirty ? (
        <Txt font="mono" size={11} color={Accent.green} uppercase tracking={0.5}>
          ✓ Enregistré.
        </Txt>
      ) : null}
      <ButtonPrimary label="Enregistrer" onPress={save} loading={saving} disabled={!dirty} />

      {/* Données RGPD */}
      <Section title="Tes données" />
      <Txt font="mono" size={11} tone="ink2" lineHeight={17}>
        Exporte une copie de tes données, ou supprime ton compte. Tu gardes le contrôle.
      </Txt>
      <ButtonPrimary
        label="Exporter mes données"
        onPress={exportData}
        loading={exporting}
        color={Accent.blue}
        textColor={colors.paper}
      />
      <ButtonPrimary
        label="Supprimer mon compte"
        onPress={() => setShowDelete(true)}
        color={Accent.red}
        textColor={colors.paper}
      />

      {/* Légal */}
      <Section title="Légal" />
      <MenuList
        items={[
          {
            mark: '§',
            title: 'Confidentialité & mentions',
            subtitle: 'RGPD · données · contact',
            color: Accent.blue,
            href: '/legal',
          },
        ]}
      />

      {/* Pied */}
      <View style={styles.footer}>
        <Txt font="mono" size={10} tone="ink2" lineHeight={15}>
          {COPY.aiDisclaimer}
        </Txt>
        <Txt font="mono" size={10} tone="ink2" uppercase tracking={1}>
          {`Lernen.de · ${APP_VERSION}`}
        </Txt>
      </View>

      <Pressable onPress={signOut} style={styles.logout} accessibilityRole="button" accessibilityLabel="Se déconnecter">
        <Txt font="monoBold" size={11} tone="ink2" uppercase tracking={1}>
          Se déconnecter
        </Txt>
      </Pressable>

      <DeleteAccountDialog visible={showDelete} onClose={() => setShowDelete(false)} />
    </ScreenScaffold>
  );
}

function Card({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.cardWrap}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.ink, transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }] }]} />
      <View style={[styles.cardFace, { backgroundColor: colors.paper, borderColor: colors.ink }]}>{children}</View>
    </View>
  );
}

function Section({ title }: { title: string }) {
  return (
    <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={2} style={styles.section}>
      {title}
    </Txt>
  );
}

function LevelChip({ code, label, active, onPress }: { code: LevelCode; label: string; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const fg = active ? (code === 'A2' ? '#0A0A0A' : '#F4F0E6') : colors.ink;
  return (
    <Pressable onPress={onPress} style={styles.chip}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.ink, transform: [{ translateX: Shadow.sm }, { translateY: Shadow.sm }] }]} />
      <View style={[styles.chipFace, { backgroundColor: active ? LevelColor[code] : colors.paper, borderColor: colors.ink }]}>
        <Txt font="display" size={22} color={fg}>
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
  cardWrap: { position: 'relative' },
  cardFace: {
    borderWidth: Border.base,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  email: { marginTop: -2 },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  levelBadge: {
    borderWidth: Border.base,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  section: { marginTop: Spacing.two },
  levels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  chip: { width: '47%' },
  chipFace: {
    borderWidth: Border.base,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: 2,
  },
  footer: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  logout: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
});
