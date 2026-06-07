import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Input } from '@/components/ui/Input';
import { Txt } from '@/components/ui/Txt';
import { api, ApiError } from '@/lib/api';
import { COPY } from '@/lib/copy';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';

const CONFIRM_WORD = 'SUPPRIMER';
const DELETED = ['Ton profil et ton niveau', 'Tes cours générés', 'Tes examens et résultats', 'Tes certifications'];

type Props = { visible: boolean; onClose: () => void };

/**
 * Flow de suppression de compte (RGPD art. 17 + Apple 5.1.1).
 * Double validation : l'utilisateur doit taper "SUPPRIMER" pour armer le bouton.
 * Suppression DURE et immédiate côté serveur, puis purge de la session locale.
 */
export function DeleteAccountDialog({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const armed = word.trim().toUpperCase() === CONFIRM_WORD;

  const close = () => {
    if (loading) return;
    setWord('');
    setError(null);
    onClose();
  };

  const confirmDelete = async () => {
    if (!armed || loading) return;
    setError(null);
    setLoading(true);
    try {
      await api.deleteAccount();
      // Compte supprimé côté serveur (cascade) → on purge la session locale,
      // le gate de navigation route alors vers l'écran de connexion.
      await signOut();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : COPY.errGeneric);
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.dialogWrap}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.ink, transform: [{ translateX: Shadow.md }, { translateY: Shadow.md }] }]} />
          <View style={[styles.dialog, { backgroundColor: colors.paper, borderColor: colors.ink }]}>
            <Txt font="display" size={24} uppercase tracking={-0.5}>
              Supprimer ton compte ?
            </Txt>

            <View style={[styles.warning, { backgroundColor: Accent.red }]}>
              <Txt font="bold" size={13} color="#F4F0E6" lineHeight={18}>
                C&apos;est définitif. Aucun retour en arrière possible.
              </Txt>
            </View>

            <View style={styles.list}>
              <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
                Ce qui sera supprimé
              </Txt>
              {DELETED.map((d) => (
                <Txt key={d} font="mono" size={11} lineHeight={17}>
                  {`— ${d}`}
                </Txt>
              ))}
            </View>

            <Input
              label="Tape SUPPRIMER pour confirmer"
              value={word}
              onChangeText={setWord}
              placeholder="SUPPRIMER"
              autoCapitalize="characters"
              autoCorrect={false}
            />

            {error ? (
              <Txt font="mono" size={11} color={Accent.red}>
                {error}
              </Txt>
            ) : null}

            <ButtonPrimary
              label="Supprimer définitivement"
              onPress={confirmDelete}
              loading={loading}
              disabled={!armed}
              color={Accent.red}
              textColor={colors.paper}
            />

            <Pressable onPress={close} style={styles.cancel} accessibilityRole="button" accessibilityLabel="Annuler">
              <Txt font="monoBold" size={11} uppercase tracking={1}>
                Annuler
              </Txt>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10,10,10,0.55)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  dialogWrap: { position: 'relative', alignSelf: 'stretch' },
  dialog: {
    borderWidth: Border.base,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  warning: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  list: { gap: Spacing.one },
  cancel: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
});
