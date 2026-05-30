import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Input } from '@/components/ui/Input';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';
import type { CertSchreibenResponse } from '@/lib/api';

type Props = {
  task: CertSchreibenResponse['task'];
  value: string;
  onChangeText: (v: string) => void;
  submitting: boolean;
  onSubmit: () => void;
};

/** Compte de mots cohérent avec le backend (`grade-schreiben.js` ligne 106). */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Affiche un sujet Schreiben (consigne DE + traduction FR + points à couvrir +
 * tips) puis une zone de rédaction multiline avec compteur de mots live.
 * Désactive « Corriger » tant que < 10 caractères (cf. backend).
 */
export function SchreibenComposer({ task, value, onChangeText, submitting, onSubmit }: Props) {
  const { colors } = useTheme();
  const words = useMemo(() => countWords(value), [value]);
  const min = task.word_count?.min ?? 30;
  const max = task.word_count?.max ?? 150;
  const wordTone = words === 0 ? Accent.red : words < min ? Accent.yellowDark : words > max ? Accent.red : Accent.green;
  const charCount = value.length;
  const canSubmit = charCount >= 10;

  return (
    <View style={styles.wrap}>
      <HardShadowBox background={colors.cream2} offset={Shadow.md} contentStyle={styles.card}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
          Sujet · {task.task_type}
        </Txt>
        <Txt font="bold" size={18} lineHeight={24}>
          {task.instructions_de}
        </Txt>
        <Txt font="serifItalic" size={14} tone="ink2" lineHeight={20}>
          {task.instructions_fr}
        </Txt>
      </HardShadowBox>

      {task.context ? (
        <View style={styles.contextRow}>
          {task.context.recipient ? (
            <ContextBlock label="Destinataire" value={task.context.recipient} />
          ) : null}
          {task.context.purpose ? <ContextBlock label="But" value={task.context.purpose} /> : null}
        </View>
      ) : null}

      {task.context?.scenario ? (
        <ContextBlock label="Mise en situation" value={task.context.scenario} block />
      ) : null}

      {task.elements_to_cover_fr && task.elements_to_cover_fr.length > 0 ? (
        <View style={styles.section}>
          <Txt font="monoBold" size={11} color={Accent.red} uppercase tracking={1.2}>
            À couvrir obligatoirement
          </Txt>
          {task.elements_to_cover_fr.map((el, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bullet, { backgroundColor: Accent.red, borderColor: colors.ink }]} />
              <Txt font="body" size={14} lineHeight={20} style={styles.bulletTxt}>
                {el}
                {task.elements_to_cover?.[i] ? (
                  <Txt font="serifItalic" size={12} tone="ink2">
                    {'  '}({task.elements_to_cover[i]})
                  </Txt>
                ) : null}
              </Txt>
            </View>
          ))}
        </View>
      ) : null}

      {task.tips && task.tips.length > 0 ? (
        <View style={styles.section}>
          <Txt font="monoBold" size={11} color={Accent.blue} uppercase tracking={1.2}>
            Conseils
          </Txt>
          {task.tips.map((tip, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bullet, { backgroundColor: Accent.blue, borderColor: colors.ink }]} />
              <Txt font="body" size={13} lineHeight={19} tone="ink2" style={styles.bulletTxt}>
                {tip}
              </Txt>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.editorHead}>
          <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>
            Ta réponse · {min}–{max} mots
          </Txt>
          <Txt font="monoBold" size={11} color={wordTone} uppercase tracking={1.2}>
            {words} mots
          </Txt>
        </View>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder="Schreibe deinen Text auf Deutsch…"
          multiline
          textAlignVertical="top"
          style={styles.editor}
          autoCapitalize="sentences"
        />
      </View>

      <ButtonPrimary
        label="Corriger ma production"
        onPress={onSubmit}
        loading={submitting}
        disabled={!canSubmit}
        color={Accent.green}
      />
    </View>
  );
}

function ContextBlock({ label, value, block }: { label: string; value: string; block?: boolean }) {
  const { colors } = useTheme();
  return (
    <HardShadowBox background={colors.paper} offset={Shadow.sm} contentStyle={styles.ctx} style={block ? null : styles.ctxFlex}>
      <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.2}>
        {label}
      </Txt>
      <Txt font="body" size={13} lineHeight={18}>
        {value}
      </Txt>
    </HardShadowBox>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  card: { padding: Spacing.three, gap: Spacing.two },
  contextRow: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  ctx: { padding: Spacing.two, gap: 2 },
  ctxFlex: { flex: 1, minWidth: 140 },
  section: { gap: Spacing.two },
  bulletRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  bullet: { width: 10, height: 10, borderWidth: Border.thin, marginTop: 5 },
  bulletTxt: { flex: 1 },
  editorHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editor: { minHeight: 180 },
});
