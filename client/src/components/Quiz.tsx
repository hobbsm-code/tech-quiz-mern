import { useState, } from 'react';
import type { Question } from '../models/Question.js';
import { getQuestions } from '../services/questionApi.js';

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const getRandomQuestions = async () => {
    try {
      const questions = await getQuestions();

      if (!questions) {
        throw new Error('something went wrong!');
      }

      setQuestions(questions);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerClick = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleStartQuiz = async () => {
    await getRandomQuestions();
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  if (!quizStarted) {
    return (
      <div className="p-4 text-center">
        <button 
          data-cy="start-button" 
          className="btn btn-primary d-inline-block mx-auto" 
          onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div data-cy="quiz-end-card" className="card p-4 text-center">
        <h2>Quiz Completed</h2>
        <div data-cy="final-score" className="alert alert-success">
          Your score: {score}/{questions.length}
        </div>
        <button data-cy="restart-btn" className="btn btn-primary d-inline-block mx-auto" onClick={handleStartQuiz}>
          Take New Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div data-cy='question-card' className='card p-4'>
      <h2 data-cy='question-text'>{currentQuestion.question}</h2>
      <div data-cy="answer-container" className="mt-3">
      {currentQuestion.answers.map((answer, index) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <button data-cy="answer-btn" className="btn btn-primary" onClick={() => handleAnswerClick(answer.isCorrect)}>{index + 1}</button>
          <div data-cy="answer-text" className="alert alert-secondary mb-0 ms-2 flex-grow-1">{answer.text}</div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Quiz;
