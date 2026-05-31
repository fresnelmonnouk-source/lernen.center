import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { AuthScaffold } from '@/components/ui/AuthScaffold';
import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Input } from '@/components/ui/Input';
import { Txt } from '@/components/ui/Txt';
import { Accent, Spacing } from '@/theme/tokens';

export default function LoginScreen() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Renseigne email et mot de passe.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // Session change triggers the root gate → redirect.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold eyebrow="BON RETOUR" title="Connexion">
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
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
      />
      {error ? (
        <Txt font="mono" size={11} color={Accent.red}>
          {error}
        </Txt>
      ) : null}
      <ButtonPrimary label="Se connecter" onPress={submit} loading={loading} />
      <View style={styles.footer}>
        <Txt font="body" size={13} tone="ink2">
          Pas encore de compte ?{' '}
        </Txt>
        <Link href="/signup" replace>
          <Txt font="bold" size={13} color={Accent.red}>
            Créer un compte
          </Txt>
        </Link>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.one },
});
