import { StyleSheet, View } from 'react-native';

import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { Accent, Spacing } from '@/theme/tokens';

const CONTACT = 'privacy@mylernen.de';

/**
 * Écran de transparence légale (in-app, pas de page 404).
 * Reprend l'essentiel des drafts Confidentialité / CGU / Mentions rédigés par
 * Helena. Les documents complets, validés par un avocat et hébergés sur une URL
 * publique, restent à finaliser avant publication sur les stores.
 */
export default function LegalScreen() {
  return (
    <ScreenScaffold eyebrow="Transparence" title="Légal">
      <Txt font="mono" size={11} tone="ink2" lineHeight={18}>
        L&apos;essentiel ci-dessous. Les documents complets (Politique de confidentialité, CGU,
        Mentions légales) sont en cours de finalisation et de validation juridique.
      </Txt>

      <Block title="Tes données & l'hébergement">
        Tes données sont stockées dans l&apos;Union européenne (Supabase, Francfort) et le backend
        tourne en région UE. Aucune clé d&apos;IA n&apos;est stockée sur ton téléphone.
      </Block>

      <Block title="Sous-traitants">
        Supabase (base de données & authentification), DeepSeek (génération de contenu par IA),
        Resend (emails). Chacun traite le strict nécessaire au fonctionnement de l&apos;app.
      </Block>

      <Block title="Contenus générés par IA">
        Les cours, examens et corrections sont produits par une IA. Ils peuvent contenir des
        erreurs : vérifie les points critiques avant un examen réel. Préparation indépendante,
        sans affiliation à un organisme de certification officiel.
      </Block>

      <Block title="Tes droits (RGPD)">
        Accès, rectification, portabilité (art. 20) et effacement (art. 17). Tu peux{'\n'}
        <Txt font="monoBold" size={11} color={Accent.blue}>exporter</Txt> ou{' '}
        <Txt font="monoBold" size={11} color={Accent.red}>supprimer</Txt> ton compte directement
        depuis l&apos;écran Profil. Suppression immédiate via l&apos;app (sous 30 jours max par email).
      </Block>

      <Block title="Contact">
        Pour toute question sur tes données : {CONTACT}
      </Block>

      <View style={styles.note}>
        <Txt font="mono" size={10} tone="ink2" lineHeight={15}>
          Version résumée. Les documents légaux complets seront publiés avant la mise sur les
          stores, après validation par un avocat.
        </Txt>
      </View>
    </ScreenScaffold>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.block}>
      <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={2}>
        {title}
      </Txt>
      <Txt font="mono" size={11} lineHeight={18}>
        {children}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.one },
  note: {
    marginTop: Spacing.two,
    opacity: 0.85,
  },
});
