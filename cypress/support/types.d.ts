import { Schema } from 'mongoose';

interface Answer {
    text: string;
    isCorrect: boolean;
}

interface Question {
    _id: string;
    question: string;
    answers: Answer[];
}

export type { Question, Answer };
