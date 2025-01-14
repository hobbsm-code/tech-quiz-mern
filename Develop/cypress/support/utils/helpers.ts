import { Question } from "../types";
import questions from "../../fixtures/questions.json";

export const getQuestions = (): Question[] => {
  return questions.map((question: Question) => ({
    _id: question._id,
    question: question.question,
    answers: question.answers
  }));
};
