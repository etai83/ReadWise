
export function scoreQuiz(answers: Record<string, string>, questions: any[]) {
  let score = 0;
  for (const question of questions) {
    if (answers[question.id] === question.correct) {
      score++;
    }
  }
  return score;
}
