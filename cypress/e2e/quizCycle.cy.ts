import { getQuestions } from '../support/utils/helpers';

describe('Quiz Component', () => {
    context('Game Setup', () => {
        beforeEach(() => {
            cy.intercept('GET', '/api/questions/random', (req) => {
                req.reply({
                    statusCode: 200,
                    body: getQuestions()
                });
            }).as('getQuestion');
            cy.visit('/');
            cy.get('[data-cy=start-button]').click();
        });

        it('should get the list of mock questions', () => {
            cy.wait('@getQuestion').its('response.statusCode').should('eq', 200);

            cy.get('[data-cy=question-card]').should('be.visible');
        });

    });

    context('Complete the Quiz', () => {
        beforeEach(() => {
            cy.intercept('GET', '/api/questions/random', (req) => {
                req.reply({
                    statusCode: 200,
                    body: getQuestions()
                });
            }).as('getQuestion');
            cy.visit('/');
            cy.get('[data-cy=start-button]').click();
            cy.wait('@getQuestion');
            const questionsLength: number = getQuestions().length;
            for (let i = 0; i < questionsLength; i++) {
                cy.get('[data-cy=answer-btn]').first().click();
            }
        });

        it('should display the quiz completed message', () => {
            cy.get('[data-cy=quiz-end-card]').find('h2').should('have.text', 'Quiz Completed');
        });

        it('should display the final score', () => {
            cy.get('[data-cy=final-score]').should('exist');
        });

        it('should display the Take New Quiz', () => {
            cy.get('[data-cy="restart-btn"]').should('exist');
        });
    });

    context('Play Again', () => {
        beforeEach(() => {
            cy.intercept('GET', '/api/questions/random', (req) => {
                req.reply({
                    statusCode: 200,
                    body: getQuestions()
                });
            }).as('getQuestion');
            cy.visit('/');
            cy.get('[data-cy=start-button]').click();
            cy.wait('@getQuestion');
            const questionsLength: number = getQuestions().length;
            for (let i = 0; i < questionsLength; i++) {
                cy.get('[data-cy=answer-btn]').first().click();
            }            
        });

        it('should not display the Start Quiz button after restarting', () => {
            cy.get('[data-cy="restart-btn"]').click();
            cy.get('[data-cy=start-button]').should('not.exist');
        });

        it('should display a new question after restarting', () => {
            cy.get('[data-cy="restart-btn"]').click();
            cy.get('[data-cy=question-text]').should('exist');
        });
    });


});