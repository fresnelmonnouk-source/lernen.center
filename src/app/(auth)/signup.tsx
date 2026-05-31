import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { AuthScaffold } from '@/components/ui/AuthScaffold';
import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Input } from '@/components/ui/Input';
import { Txt } from '@/components/ui/Txt';
import { Accent, Spacing } from '@/theme/tokens';

export default function SignupScreen() {
  const { signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Renseigne email et mot de passe.');
      return;
    }
    if (password.length < 6) {
      setError('Mot de passe trop court (6 caractères min.).');
      return;
    }
    setLoading(true);
    try {
      const { needsConfirmation } = await signUpWithEmail(email, password);
      if (needsConfirmation) setSent(true);
      // Otherwise the session is live → root gate routes to onboarding.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthScaffold eyebrow="DERNIÈRE ÉTAPE" title="Email envoyé">
        <HardShadowBox contentStyle={styles.box}>
          <Txt font="bold" size={16}>Active ton compte</Txt>
          <Txt font="body" size={14} tone="ink2" lineHeight={20}>
            Clique sur le lien qu&apos;on vient d&apos;envoyer à {email.trim()} pour activer ton compte, puis connecte-toi.
          </Txt>
        </HardShadowBox>
        <Link href="/login" replace>
          <Txt font="bold" size={13} color={Accent.red}>
            ← Retour à la connexion
          </Txt>
        </Link>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold eyebrow="Bienvenue" title="Créer un compte">
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="toi@exemple.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
      />
      <Input
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        placeholder="6 caractères minimum"
        secureTextEntry
        autoCapitalize="none"
      />
      {error ? (
        <Txt font="mono" size={11} color={Accent.red}>
          {error}
        </Txt>
      ) : null}
      <ButtonPrimary label="Créer mon compte" onPress={submit} loading={loading} />
      <View style={styles.footer}>
        <Txt font="body" size={13} tone="ink2">
          Déjà un compte ?{' '}
        </Txt>
        <Link href="/login" replace>
          <Txt font="bold" size={13} color={Accent.red}>
            Se connecter
          </Txt>
        </Link>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  box: { padding: Spacing.four, gap: Spacing.two },
  footer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.one },
});
