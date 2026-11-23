/**
 * Lecture d'un test collé en texte libre. Format accepté (souple) :
 *
 *   1. Quelle est la durée d'un sprint Scrum ?
 *   A) 1 à 4 semaines
 *   B) 6 mois
 *   C) 1 jour
 *   Réponse : A
 *   Explication : Un sprint dure au plus un mois.   (facultatif)
 *
 * - Questions séparées par une ligne vide ou numérotées (1. / 1) / Q1 / Question 1 :)
 * - Options : « A) », « A. », « a) », « - A) »… ou marquée d’un « * » en début de ligne pour la bonne réponse
 * - Réponse : « Réponse : B », « Réponses : A, C », « Bonne réponse : B », « R : B »
 */
export type QuizQuestion = { q: string; options: string[]; answer: number[]; explanation?: string };

const OPT = /^\s*[-•]?\s*(\*)?\s*([A-Ha-h])\s*[).:\-–]\s+(.*)$/;
const ANS = /^\s*(?:bonnes?\s+)?(?:r[ée]ponses?|r|answer|correct)\s*[:=\-–]\s*(.+)$/i;
const EXP = /^\s*(?:explications?|justification|pourquoi)\s*[:=\-–]\s*(.+)$/i;
const QNUM = /^\s*(?:q(?:uestion)?\s*)?\d{1,3}\s*[).:\-–]\s*(.*)$/i;

export function parseQuiz(text: string): { questions: QuizQuestion[]; errors: string[] } {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks: string[][] = [];
  let cur: string[] = [];
  const flush = () => {
    if (cur.some((l) => l.trim())) blocks.push(cur);
    cur = [];
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      // une ligne vide ne coupe que si la question a déjà des options
      if (cur.some((l) => OPT.test(l))) flush();
      continue;
    }
    if (QNUM.test(line) && !OPT.test(line) && cur.some((l) => OPT.test(l))) flush();
    cur.push(line);
  }
  flush();

  const questions: QuizQuestion[] = [];
  const errors: string[] = [];
  blocks.forEach((b, bi) => {
    const qLines: string[] = [];
    const options: string[] = [];
    const starred: number[] = [];
    let answerRaw = "";
    let explanation = "";
    for (const l of b) {
      const om = l.match(OPT);
      const am = l.match(ANS);
      const em = l.match(EXP);
      if (am && !om) answerRaw = am[1];
      else if (em) explanation = em[1].trim();
      else if (om && (options.length || qLines.length)) {
        if (om[1]) starred.push(options.length);
        options.push(om[3].trim());
      } else if (!options.length) {
        const qm = l.match(QNUM);
        qLines.push(qm && !qLines.length ? qm[1] : l.trim());
      } else if (explanation) explanation += " " + l.trim();
      else options[options.length - 1] += " " + l.trim();
    }
    const q = qLines.join(" ").trim();
    let answer = starred;
    if (answerRaw) {
      answer = [...answerRaw.toUpperCase().matchAll(/\b([A-H])\b/g)].map((m) => m[1].charCodeAt(0) - 65).filter((i) => i < options.length);
    }
    const n = bi + 1;
    if (!q) errors.push(`Question ${n} : intitulé manquant.`);
    else if (options.length < 2) errors.push(`Question ${n} (« ${q.slice(0, 40)}… ») : au moins 2 propositions A), B)… sont nécessaires.`);
    else if (!answer.length) errors.push(`Question ${n} (« ${q.slice(0, 40)}… ») : bonne réponse non trouvée (ajoutez « Réponse : B »).`);
    else questions.push({ q, options, answer: [...new Set(answer)].sort(), ...(explanation ? { explanation } : {}) });
  });
  return { questions, errors };
}

/** Questions sans les réponses, envoyées au navigateur du participant. */
export const publicQuestions = (qs: QuizQuestion[]) => qs.map(({ q, options, answer }) => ({ q, options, multiple: answer.length > 1 }));
