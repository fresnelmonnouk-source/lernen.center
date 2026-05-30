import { StyleSheet, View } from 'react-native';

import { HardShadowBox } from '@/components/ui/HardShadowBox';
import { Txt } from '@/components/ui/Txt';
import { useTheme } from '@/theme/theme-context';
import { Accent, Border, Shadow, Spacing } from '@/theme/tokens';
import type { GradeSchreibenResponse, SchreibenCriterion, SchreibenError } from '@/lib/api';

type Props = { data: GradeSchreibenResponse };

const CRITERIA: { key: keyof GradeSchreibenResponse['evaluation']['scores']; label: string; german: string; color: string }[] = [
  { key: 'erfuellung', label: 'Réalisation de la tâche', german: 'Erfüllung', color: Accent.green },
  { key: 'kohaerenz', label: 'Cohérence', german: 'Kohärenz', color: Accent.blue },
  { key: 'wortschatz', label: 'Vocabulaire', german: 'Wortschatz', color: Accent.purple },
  { key: 'strukturen', label: 'Structures', german: 'Strukturen', color: Accent.red },
];

const ERROR_LABEL: Record<string, string> = {
  grammatik: 'Grammaire',
  wortschatz: 'Vocabulaire',
  orthographie: 'Orthographe',
  struktur: 'Structure',
};

/** Bilan d'une correction Schreiben — 4 critères Goethe officiels + corrections. */
export function SchreibenResults({ data }: Props) {
  const { colors } = useTheme();
  const ev = data.evaluation;
  const accent = ev.passed ? Accent.green : Accent.red;

  return (
    <View style={styles.wrap}>
      <HardShadowBox background={accent} offset={Shadow.lg} contentStyle={styles.scoreCard}>
        <Txt font="display" size={52} color="#FFFFFF" tracking={-1}>
          {ev.total_score}/{ev.max_score}
        </Txt>
        <Txt font="monoBold" size={13} color="#FFFFFF" uppercase tracking={1.2}>
          {ev.mention} · {ev.passed ? 'Admis' : 'Non admis'}
        </Txt>
        <Txt font="serifItalic" size={14} color="#FFFFFF">
          {ev.word_count} mots
        </Txt>
      </HardShadowBox>

      <View style={styles.criteria}>
        {CRITERIA.map((c) => (
          <CriterionRow key={c.key} criterion={ev.scores[c.key]} label={c.label} german={c.german} color={c.color} />
        ))}
      </View>

      <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.feedbackCard}>
        <Txt font="monoBold" size={11} color={Accent.blue} uppercase tracking={1.2}>
          Bilan global
        </Txt>
        <Txt font="body" size={14} lineHeight={20}>
          {ev.global_feedback}
        </Txt>
      </HardShadowBox>

      <InsightList title="Points forts" items={ev.strengths} color={Accent.green} />
      <InsightList title="À améliorer" items={ev.improvements} color={Accent.red} />

      {ev.errors && ev.errors.length > 0 ? (
        <View style={styles.section}>
          <Txt font="monoBold" size={11} color={Accent.red} uppercase tracking={1.2}>
            Erreurs corrigées
          </Txt>
          {ev.errors.map((err, i) => (
            <ErrorCard key={i} error={err} />
          ))}
        </View>
      ) : null}

      {ev.improved_version ? (
        <HardShadowBox background={colors.cream2} offset={Shadow.sm} contentStyle={styles.feedbackCard}>
          <Txt font="monoBold" size={11} color={Accent.green} uppercase tracking={1.2}>
            Version améliorée
          </Txt>
          <Txt font="body" size={14} lineHeight={22}>
            {ev.improved_version}
          </Txt>
        </HardShadowBox>
      ) : null}

      <InsightList title="Prochaines étapes" items={ev.next_steps} color={Accent.purple} />
    </View>
  );
}

function CriterionRow({
  criterion,
  label,
  german,
  color,
}: {
  criterion: SchreibenCriterion;
  label: string;
  german: string;
  color: string;
}) {
  const { colors } = useTheme();
  const pct = criterion.max === 0 ? 0 : Math.max(0, Math.min(100, (criterion.points / criterion.max) * 100));
  return (
    <HardShadowBox background={colors.paper} offset={Shadow.sm} contentStyle={styles.criterion}>
      <View style={styles.critHead}>
        <View style={styles.critTitleCol}>
          <Txt font="bold" size={14}>
            {label}
          </Txt>
          <Txt font="serifItalic" size={12} tone="ink2">
            {german}
          </Txt>
        </View>
        <Txt font="display" size={20} color={color} tracking={-0.5}>
          {criterion.points}/{criterion.max}
        </Txt>
      </View>
      <View style={[styles.barTrack, { backgroundColor: colors.cream3, borderColor: colors.ink }]}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      {criterion.comment ? (
        <Txt font="body" size={13} lineHeight={18} tone="ink2">
          {criterion.comment}
        </Txt>
      ) : null}
    </HardShadowBox>
  );
}

function ErrorCard({ error }: { error: SchreibenError }) {
  const { colors } = useTheme();
  const typeLabel = ERROR_LABEL[error.type] ?? error.type;
  return (
    <HardShadowBox background={colors.paper} offset={Shadow.sm} contentStyle={styles.errorCard}>
      <Txt font="monoBold" size={10} color={Accent.red} uppercase tracking={1.2}>
        {typeLabel}
      </Txt>
      {error.extract ? (
        <Txt font="serifItalic" size={14} tone="ink2" lineHeight={20}>
          « {error.extract} »
        </Txt>
      ) : null}
      <Txt font="body" size={13} lineHeight={18}>
        {error.issue}
      </Txt>
      {error.correction ? (
        <View style={styles.correctionRow}>
          <Txt font="monoBold" size={10} color={Accent.green} uppercase tracking={1.2}>
            Correction
          </Txt>
          <Txt font="bold" size={14} color={Accent.green}>
            {error.correction}
          </Txt>
        </View>
      ) : null}
    </HardShadowBox>
  );
}

function InsightList({ title, items, color }: { title: string; items: string[]; color: string }) {
  const { colors } = useTheme();
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.section}>
      <Txt font="monoBold" size={11} color={color} uppercase tracking={1.2}>
        {title}
      </Txt>
      {items.map((it, i) => (
        <View key={i} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: color, borderColor: colors.ink }]} />
          <Txt font="body" size={14} lineHeight={20} style={styles.bulletTxt}>
            {it}
          </Txt>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  scoreCard: { padding: Spacing.four, alignItems: 'center', gap: Spacing.two },
  criteria: { gap: Spacing.two },
  criterion: { padding: Spacing.three, gap: Spacing.two },
  critHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  critTitleCol: { flex: 1, gap: 0 },
  barTrack: { height: 12, borderWidth: Border.thin, overflow: 'hidden' },
  barFill: { height: '100%' },
  feedbackCard: { padding: Spacing.three, gap: Spacing.two },
  section: { gap: Spacing.two },
  errorCard: { padding: Spacing.three, gap: Spacing.two },
  correctionRow: { gap: 2 },
  bulletRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  bullet: { width: 10, height: 10, borderWidth: Border.thin, marginTop: 5 },
  bulletTxt: { flex: 1 },
});
