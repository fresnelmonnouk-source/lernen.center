import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { Chip } from '@/components/ui/Chip';
import { ScreenScaffold } from '@/components/ui/ScreenScaffold';
import { Txt } from '@/components/ui/Txt';
import { CERT_DISCLAIMER, LEVELS, SCHREIBEN_TASKS } from '@/certification/specs';
import { SchreibenComposer } from '@/certification/SchreibenComposer';
import { SchreibenResults } from '@/certification/SchreibenResults';
import {
  api,
  ApiError,
  type CertSchreibenResponse,
  type GradeSchreibenResponse,
  type Level,
} from '@/lib/api';
import { Accent, LevelColor, Spacing } from '@/theme/tokens';

type Phase = 'setup' | 'writing' | 'done';

export default function SchreibenScreen() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [level, setLevel] = useState<Level>('B1');
  const [task, setTask] = useState<number>(1);
  const [subject, setSubject] = useState<CertSchreibenResponse['task'] | null>(null);
  const [draft, setDraft] = useState('');
  const [grade, setGrade] = useState<GradeSchreibenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tasks = SCHREIBEN_TASKS[level];

  /** Force `task` à rester dans les tâches valides du niveau sélectionné. */
  const pickLevel = (l: Level) => {
    setLevel(l);
    const validTasks = SCHREIBEN_TASKS[l].map((t) => t.task);
    if (!validTasks.includes(task)) setTask(validTasks[0]);
  };

  const generate = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.certSchreiben({ level, task });
      setSubject(res.task);
      setDraft('');
      setGrade(null);
      setPhase('writing');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Génération impossible. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!subject) return;
    setError(null);
    setGrading(true);
    try {
      const res = await api.gradeSchreiben({ task: subject, userText: draft });
      setGrade(res);
      setPhase('done');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Correction impossible. Réessaie.');
    } finally {
      setGrading(false);
    }
  };

  const restart = () => {
    setSubject(null);
    setDraft('');
    setGrade(null);
    setError(null);
    setPhase('setup');
  };

  const errorBox = error ? (
    <Txt font="mono" size={12} color={Accent.red}>
      {error}
    </Txt>
  ) : null;

  if (phase === 'writing' && subject) {
    return (
      <ScreenScaffold eyebrow="CERTIFICATION" title="Schreiben">
        <SchreibenComposer
          task={subject}
          value={draft}
          onChangeText={setDraft}
          submitting={grading}
          onSubmit={submit}
        />
        {errorBox}
      </ScreenScaffold>
    );
  }

  if (phase === 'done' && grade) {
    return (
      <ScreenScaffold eyebrow="CERTIFICATION" title="Bilan">
        <SchreibenResults data={grade} />
        <ButtonPrimary label="Nouveau sujet" onPress={restart} color={Accent.green} />
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold eyebrow="CERTIFICATION" title="Schreiben">
      <Txt font="serifItalic" size={14} tone="ink2" lineHeight={20}>
        Expression écrite niveau A1 à B2. Sujet généré par IA, correction selon 4 critères
        (Erfüllung, Kohärenz, Wortschatz, Strukturen).
      </Txt>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Niveau</Txt>
        <View style={styles.rowWrap}>
          {LEVELS.map((l) => (
            <Chip key={l} label={l} selected={level === l} onPress={() => pickLevel(l)} color={LevelColor[l]} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Txt font="monoBold" size={10} tone="ink2" uppercase tracking={1.5}>Tâche</Txt>
        <View style={styles.tasksCol}>
          {tasks.map((t) => (
            <Chip
              key={t.task}
              label={`Tâche ${t.task} · ${t.title}`}
              sublabel={`${t.wordCount.min}–${t.wordCount.max} mots · ${t.description}`}
              selected={task === t.task}
              onPress={() => setTask(t.task)}
              color={Accent.green}
              fullWidth
            />
          ))}
        </View>
      </View>

      {errorBox}
      <ButtonPrimary label="Générer le sujet" onPress={generate} loading={loading} color={Accent.green} />

      <Txt font="serifItalic" size={11} tone="ink2" lineHeight={16}>
        {CERT_DISCLAIMER}
      </Txt>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tasksCol: { gap: Spacing.two },
});
