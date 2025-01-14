import { mount } from 'cypress/react';
import Quiz from '../../client/src/components/Quiz';
import '@testing-library/cypress/add-commands';
import { getQuestions } from '../support/utils/helpers';
//client\src\components\Quiz.tsx
describe('Quiz Component', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/questions/random', (req) => {
            req.reply({
                statusCode: 200,
                body: getQuestions()
            });
        }).as('getQuestion');
    });

    it('renders the Start Quiz button', () => {
        mount(<Quiz />);
        cy.get('[data-cy="start-button"]').should('exist');
    });

    it('should display a random question when Start Quiz is clicked', () => {
        mount(<Quiz />);
        cy.get('[data-cy="start-button"]').click();
        cy.wait('@getQuestion');
        cy.get('[data-cy="question-card"]').should('be.visible');
        cy.get('[data-cy="question-text"]').should('have.text', 'What is the capital of France?');
    });

    it('displays the correct number of answers', () => {
        mount(<Quiz />);
        cy.get('[data-cy="start-button"]').click();
        cy.wait('@getQuestion');
        cy.get('[data-cy="answer-container"]').find('[data-cy="answer-text"]').should('have.length', 4);
    });

    it('displays the next question when an answer is clicked', () => {
        mount(<Quiz />);
        cy.get('[data-cy="start-button"]').click();
        cy.wait('@getQuestion');
        cy.get('[data-cy="answer-container"]').find('[data-cy="answer-btn"]').first().click();
        // cy.wait('@getQuestion');
        cy.get('[data-cy="question-text"]').should('have.text', 'Which planet is known as the Red Planet?');
    });
});
