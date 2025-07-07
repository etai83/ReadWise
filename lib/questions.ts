
export async function generateQuestions(text: string) {
  // In a real application, you would use an LLM to generate questions.
  // For this example, we'll just return some dummy data.
  return [
    {
      prompt: "What is the capital of France?",
      correct: "Paris",
      optionA: "Paris",
      optionB: "London",
      optionC: "Berlin",
      optionD: "Madrid",
    },
  ];
}
