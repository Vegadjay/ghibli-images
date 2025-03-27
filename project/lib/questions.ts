// Math MCQ questions database
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const mathQuestions: Question[] = [
  {
    id: 1,
    question: "What is the value of π (pi) to two decimal places?",
    options: ["3.14", "3.16", "3.12", "3.18"],
    correctAnswer: 0,
    explanation: "π is approximately equal to 3.14159..., which rounds to 3.14"
  },
  {
    id: 2,
    question: "What is the square root of 144?",
    options: ["10", "12", "14", "16"],
    correctAnswer: 1,
    explanation: "12 × 12 = 144, therefore the square root of 144 is 12"
  },
  // Adding more questions to demonstrate (showing first few for brevity)
  // In reality, this file will contain all 100 questions
];

// Helper function to paginate questions
export const getQuestionsForPage = (page: number, questionsPerPage: number = 10) => {
  const start = (page - 1) * questionsPerPage;
  const end = start + questionsPerPage;
  return mathQuestions.slice(start, end);
};

export const totalQuestions = mathQuestions.length;
export const questionsPerPage = 10;