// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
/// <reference types="Cypress" />

Cypress.Commands.add('createCourseExecution', (name, acronym, academicTerm) => {
  cy.get('[data-cy="createButton"]').click();
  cy.get('[data-cy="courseExecutionNameInput"]').type(name);
  cy.get('[data-cy="courseExecutionAcronymInput"]').type(acronym);
  cy.get('[data-cy="courseExecutionAcademicTermInput"]').type(academicTerm);
  cy.get('[data-cy="saveButton"]').click();
});

Cypress.Commands.add('closeErrorMessage', (message) => {
    if(message == null) {
        cy.contains('Error')
            .parent()
            .find('button')
            .click();
    } else {
        cy.contains(message)
            .parent()
            .find('button')
            .click();
    }
});

Cypress.Commands.add('deleteCourseExecution', acronym => {
  cy.contains(acronym)
    .parent()
    .should('have.length', 1)
    .children()
    .should('have.length', 7)
    .find('[data-cy="deleteCourse"]')
    .click();
});

Cypress.Commands.add(
  'createFromCourseExecution',
  (name, acronym, academicTerm) => {
    cy.contains(name)
      .parent()
      .should('have.length', 1)
      .children()
      .should('have.length', 7)
      .find('[data-cy="createFromCourse"]')
      .click();
    cy.get('[data-cy="courseExecutionAcronymInput"]').type(acronym);
    cy.get('[data-cy="courseExecutionAcademicTermInput"]').type(academicTerm);
    cy.get('[data-cy="saveButton"]').click();
  }
);

Cypress.Commands.add('createTournament', numberOfQuestions => {
  cy.get('[data-cy="createButton"]')
    .should('be.visible')
    .click({ force: true });
  cy.time('Start Time', 16, 0);
  cy.wait(100);
  cy.time('End Time', 18, 1);
  cy.get('[data-cy="NumberOfQuestions"]').type(numberOfQuestions, {
    force: true
  });
  cy.selectTopic('Adventure Builder');
  cy.selectTopic('Architectural Style');
  cy.get('[data-cy="saveButton"]').click();
});

Cypress.Commands.add('time', (date, day, type) => {
  let get1 = '';
  let get2 = '';
  if (type == 0) {
    get1 = '#startTimeInput-picker-container-DatePicker';
    get2 = '#startTimeInput-wrapper';
  } else {
    get1 = '#endTimeInput-picker-container-DatePicker';
    get2 = '#endTimeInput-wrapper';
  }

  cy.get('label')
    .contains(date)
    .click();

  cy.get(get1)
    .should('have.length', 1)
    .children()
    .should('have.length', 1)
    .children()
    .should('have.length', 3)
    .eq(0)
    .children()
    .should('have.length', 3)
    .eq(2)
    .click()
    .wait(500);

  cy.get(get1)
    .should('have.length', 1)
    .children()
    .should('have.length', 1)
    .children()
    .should('have.length', 3)
    .eq(2)
    .children()
    .contains(day)
    .click()
    .get(get2)
    .children()
    .should('have.length', 2)
    .eq(1)
    .click();
});

Cypress.Commands.add('selectTopic', topic => {
  cy.get('[data-cy="Topics"]')
    .should('be.visible')
    .should('have.length', 1)
    .children()
    .should('have.length', 4)
    .contains(topic)
    .parent()
    .should('have.length', 1)
    .children()
    .should('have.length', 2)
    .find('[data-cy="addTopic"]')
    .click();
});

Cypress.Commands.add('joinTournament', tournament => {
  cy.get('tbody')
    .children()
    .eq(tournament)
    .children()
    .should('have.length', 9)
    .eq(8)
    .find('[data-cy="JoinTournament"]')
    .click({ force: true });
});

Cypress.Commands.add('solveTournament', tournament => {
  cy.get('tbody')
    .children()
    .eq(tournament)
    .children()
    .should('have.length', 9)
    .eq(8)
    .find('[data-cy="SolveQuiz"]')
    .click({ force: true });
});

Cypress.Commands.add('leaveTournament', tournament => {
  cy.get('tbody')
    .children()
    .eq(tournament)
    .children()
    .should('have.length', 9)
    .eq(8)
    .find('[data-cy="LeaveTournament"]')
    .click({ force: true });
});

Cypress.Commands.add('editTournament', tournament => {
  cy.get('tbody')
    .children()
    .eq(tournament)
    .children()
    .should('have.length', 9)
    .eq(8)
    .find('[data-cy="EditTournament"]')
    .click({ force: true });

  cy.time('Start Time', 20, 0);
  cy.wait(100);
  cy.time('End Time', 22, 1);
  cy.get('[data-cy="NumberOfQuestions"]')
    .clear()
    .type(5, {
      force: true
    });
  cy.selectTopic('Allocation viewtype');
  cy.get('[data-cy="saveButton"]').click();
});

Cypress.Commands.add('cancelTournament', tournament => {
  cy.get('tbody')
    .children()
    .eq(tournament)
    .children()
    .should('have.length', 9)
    .eq(8)
    .find('[data-cy="CancelTournament"]')
    .click({ force: true });
});

Cypress.Commands.add('answerQuiz', n => {
  cy.get('[data-cy="quizzes"]').click();
  cy.get('[data-cy="availableQuizzes"]').click();
  cy.get('[data-cy="quizNo' + n + '"]').click();
  cy.get('[data-cy="optionNo1"]').click();
  cy.get('[data-cy="nextQuestion"]').click();
  cy.get('[data-cy="optionNo0"]').click();
  cy.get('[data-cy="nextQuestion"]').click();
  cy.get('[data-cy="optionNo2"]').click();
  cy.get('[data-cy="nextQuestion"]').click();
  cy.get('[data-cy="optionNo3"]').click();
  cy.get('[data-cy="nextQuestion"]').click();
  cy.get('[data-cy="optionNo1"]').click();
  cy.get('[data-cy="endQuiz"]').click();
  cy.get('[data-cy="confirmEndQuiz"]').click();
});

Cypress.Commands.add('writeDiscussion', content => {
  cy.get('[data-cy="discussionText"]').type(content);
  cy.get('[data-cy="createDiscussion"]').click();
});

Cypress.Commands.add('viewMyDiscussions', () => {
  cy.get('[data-cy="discussions"]').click();
});

Cypress.Commands.add('replyTeacherDiscussion', content => {
  cy.exec(
    'PGPASSWORD= psql -d tutordb -U daniel -h localhost -c "INSERT INTO replies (discussion_user_id, user_id, message, date) VALUES (676, 677, \'' +
      content +
      '\', \'2020-01-01 00:00:01\')"'
  );
});

Cypress.Commands.add('replyDiscussion', content => {
  cy.get('[data-cy="reply"]').type(content);
  cy.get('[data-cy="submitReply"]').click();
})

Cypress.Commands.add('openDiscussion', n => {
  cy.get('tbody > :nth-child(' + n + 1 + ') > .text-start').click();
});

Cypress.Commands.add('submitReply', message => {
  cy.get('[data-cy="filterDiscussions"]').click();
  cy.get('[data-cy="filterDiscussions"]').click();
  cy.get('[data-cy="showQuestionDialog"]')
    .first()
    .click();
  cy.get('[data-cy="ReplyMessage"]').type(message);
  cy.get('[data-cy="submitReply"]').click();
});

Cypress.Commands.add('submitEmptyReply', () => {
  cy.get('[data-cy="filterDiscussions"]').click();
  cy.get('[data-cy="filterDiscussions"]').click();
  cy.get('[data-cy="showQuestionDialog"]')
    .first()
    .click();
  cy.get('[data-cy="submitReply"]').click();
});

Cypress.Commands.add('clickAvailability', () => {
  cy.get('[data-cy="filterDiscussions"]').click();
  cy.get('[data-cy="filterDiscussions"]').click();
  cy.get('[data-cy="showQuestionDialog"]')
    .first()
    .click();
  cy.get('[data-cy="changeAvailability"]').click({ force: true });
})

Cypress.Commands.add('openSubmissions', () => {
  cy.contains('Questions').click();
  cy.contains('Submissions').click();
});

Cypress.Commands.add('reviewSubmission', (title, status) => {
    //add review for submission
    cy.exec('PGPASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH sub AS (SELECT s.id FROM submissions s JOIN questions q ON s.question_id=q.id WHERE q.title=\'' + title +'\') INSERT INTO reviews(creation_date,justification,status,student_id,submission_id,user_id) VALUES (current_timestamp,\'As opções estão incorretas, e a pergunta pouco clara\', \'REJECTED\', 676, (SELECT * FROM sub), 677);" ')
});

Cypress.Commands.add('addSubmission', (title, qstatus) => {
    //add question and submission
    cy.exec('PGPASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH quest AS (INSERT INTO questions (title, content, status, course_id, creation_date) VALUES (\''+ title +'\', \'Question?\', \''+ qstatus +'\', 2, current_timestamp) RETURNING id) INSERT INTO submissions (question_id, user_id) VALUES ((SELECT id from quest), 676);" ')

    //add options
    cy.exec('PGPASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH quest AS (SELECT * FROM questions WHERE title=\'' + title +'\') INSERT INTO options(content, correct, question_id, sequence) VALUES (\'teste a\', \'t\', (SELECT id FROM quest), 0);" ')
    cy.exec('PGPASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH quest AS (SELECT * FROM questions WHERE title=\'' + title +'\') INSERT INTO options(content, correct, question_id, sequence) VALUES (\'teste b\', \'f\', (SELECT id FROM quest), 0);" ')
    cy.exec('PGPASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH quest AS (SELECT * FROM questions WHERE title=\'' + title +'\') INSERT INTO options(content, correct, question_id, sequence) VALUES (\'teste c\', \'f\', (SELECT id FROM quest), 0);" ')
    cy.exec('PGPASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH quest AS (SELECT * FROM questions WHERE title=\'' + title +'\') INSERT INTO options(content, correct, question_id, sequence) VALUES (\'teste d\', \'f\', (SELECT id FROM quest), 0);" ')
});



Cypress.Commands.add('openTeacherQuestions', () => {
    cy.get('[data-cy="Management"]').click();
    cy.get('[data-cy="Questions"]').click();
});

Cypress.Commands.add(
  'submitQuestion',
  (title, content, opt1, opt2, opt3, opt4) => {
      cy.openSubmissions();
      cy.get('[data-cy="submitQuestion"]').click();
      cy.get('[data-cy="QuestionTitle"]').type(title);
      cy.get('[data-cy="QuestionContent"]').type(content);
      cy.get('[data-cy="Switch1"]').click({ force: true });
      cy.get('[data-cy="Option1"]').type(opt1);
      cy.get('[data-cy="Option2"]').type(opt2);
      cy.get('[data-cy="Option3"]').type(opt3);
      cy.get('[data-cy="Option4"]').type(opt4);
      cy.get('[data-cy="submitButton"]').click();
      cy.contains(title)
        .parent().parent().parent()
        .should('have.length', 1)
        .children()
        .should('have.length', 5);
      cy.wait(500);
  }
);

Cypress.Commands.add(
  'resubmitQuestion',
  (title, content, opt1, opt2, opt3, opt4) => {
      cy.get('[data-cy="QuestionTitle"]').clear().type(title);
      cy.get('[data-cy="QuestionContent"]').clear().type(content);
      cy.get('[data-cy="Switch1"]').click({ force: true });
      cy.get('[data-cy="Option1"]').clear().type(opt1);
      cy.get('[data-cy="Option2"]').clear().type(opt2);
      cy.get('[data-cy="Switch3"]').click({ force: true });
      cy.get('[data-cy="Option3"]').clear().type(opt3);
      cy.get('[data-cy="Option4"]').clear().type(opt4);
      cy.get('[data-cy="submitButton"]').click();
      cy.wait(500);
  }
);

Cypress.Commands.add(
  'viewQuestion',
    (title, content, op1, op2, op3, op4) => {
      cy.contains(title)
        .parent().parent().parent()
        .should('have.length', 1)
        .children()
        .should('have.length', 5)
        .find('[data-cy="viewQuestion"]')
        .click();
      cy.contains(title);
      cy.contains(content);
      cy.contains(op1);
      cy.contains(op2);
      cy.contains(op3);
      cy.contains(op4);
      cy.get('[data-cy="close"]').click();
  }
);

Cypress.Commands.add(
    'checkAvailableQuestion',
    (title, content, op1, op2, op3, op4) => {
        cy.contains(title)
            .parent().parent()
            .should('have.length', 1)
            .children()
            .should('have.length', 10)
            .find('[data-cy="viewQuestion"]')
            .click();
        cy.contains(title);
        cy.contains(content);
        cy.contains(op1);
        cy.contains(op2);
        cy.contains(op3);
        cy.contains(op4);
        cy.get('[data-cy="close"]').click();
        cy.contains(title)
            .parent().parent()
            .should('have.length', 1)
            .children()
            .should('have.length', 10)
            .contains("AVAILABLE");
    }
);

Cypress.Commands.add('submitInvalidQuestion', (title, content) => {
    cy.openSubmissions();
    cy.get('[data-cy="submitQuestion"]').click();
    cy.get('[data-cy="QuestionTitle"]').type(title);
    cy.get('[data-cy="QuestionContent"]').type(content);
    cy.get('[data-cy="Switch1"]').click({ force: true });
    cy.get('[data-cy="submitButton"]').click();
});

Cypress.Commands.add('resubmitInvalidQuestion', title => {
    cy.get('[data-cy="QuestionTitle"]').clear().type(title);
    cy.get('[data-cy="QuestionContent"]').clear();
    cy.get('[data-cy="submitButton"]').click();
});

Cypress.Commands.add('deleteSubmission', title => {
    cy.contains(title)
      .parent().parent().parent()
      .should('have.length', 1)
      .children()
      .should('have.length', 5)
      .find('[data-cy="deleteSubmission"]')
      .click();
});

Cypress.Commands.add(
    'deleteQuestion',
    title => {
        cy.contains(title)
            .parent().parent()
            .should('have.length', 1)
            .children()
            .should('have.length', 10)
            .find('[data-cy="deleteQuestion"]')
            .click();
    }
);

Cypress.Commands.add('teacherReviewsSubmission', () => {
  cy.exec(
    'PGPASSWORD= psql -d tutordb -U daniel -h localhost -c "with sub as (select s.id from submissions s join questions q on s.question_id=q.id where q.title=\'Test Question\') insert into reviews(current_date,justification,status,student_id,submission_id,user_id) values (current_timestamp,\'Excelente pergunta\', \'APPROVED\', 676, (select * from sub), 677);" '
  );
});

Cypress.Commands.add('ApproveSubmissions', (title, justification) => {
    cy.get('[data-cy="Management"]').click();
    cy.get('[data-cy="Reviews"]').click();
    cy.get('[data-cy="Search"]').click();
    cy.contains(title)
      .parent().parent().parent()
      .should('have.length', 1)
      .children()
      .should('have.length', 6)
      .find('[data-cy="createReview"]')
      .click();
    cy.get('[data-cy="Justification"]').type(justification);
    cy.get('[data-cy="Approve"]').click();
    cy.get('[data-cy="NoButton"]').click();
});

Cypress.Commands.add('ChangeSubmission', (title, justification, question_title, question_content) => {
    cy.get('[data-cy="Management"]').click();
    cy.get('[data-cy="Reviews"]').click();
    cy.get('[data-cy="Search"]').click();
    cy.wait(1000);
    cy.contains(title)
        .parent().parent().parent()
        .should('have.length', 1)
        .children()
        .should('have.length', 6)
        .find('[data-cy="createReview"]')
        .click();
    cy.get('[data-cy="Justification"]').type(justification);
    cy.get('[data-cy="Approve"]').click();
    cy.get('[data-cy="YesButton"]').click();
    cy.get('[data-cy="QuestionTitle"]').type(question_title);
    cy.get('[data-cy="QuestionContent"]').type(question_content);
});


Cypress.Commands.add('RejectSubmissions', (title, justification) => {
    cy.get('[data-cy="Management"]').click();
    cy.get('[data-cy="Reviews"]').click();
    cy.get('[data-cy="Search"]').click();
    cy.contains(title)
      .parent().parent().parent()
      .should('have.length', 1)
      .children()
      .should('have.length', 6)
      .find('[data-cy="createReview"]')
      .click();
    cy.get('[data-cy="Justification"]').type(justification);
    cy.get('[data-cy="Reject"]').click();
});

Cypress.Commands.add('getSubmissionStatus', (title, status) => {
    cy.contains('Questions').click();
    cy.contains('Reviews').click();
    cy.contains(status);
    cy.contains(title)
      .parent()
      .should('have.length', 1)
      .children()
      .should('have.length', 5)
      .find('[data-cy="view"]')
      .click();
    cy.get('[data-cy="close"]').click();
});

Cypress.Commands.add('seeRejectedQuestionAndResubmit', title => {
    cy.contains('Questions').click();
    cy.contains('Reviews').click();
    cy.contains(title)
        .parent()
        .should('have.length', 1)
        .children()
        .should('have.length', 5)
        .find('[data-cy="view"]')
        .click();
    cy.get('[data-cy="resubmit"]').click();
});

Cypress.Commands.add('openDashboard', () => {
    cy.contains('Dashboard').click();
});

Cypress.Commands.add('addSubmissionInfo', () => {
    cy.log("Add 3 submissions: 1 approved and 2 rejected");
    cy.exec(
        'PGPASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH quest AS (INSERT INTO questions (title, content, course_id, status, creation_date) VALUES (\'Title1\', \'Question1?\', 2,\'AVAILABLE\', current_timestamp) RETURNING id), subs AS (INSERT INTO submissions (question_id, user_id) VALUES ((SELECT id FROM quest), 676) RETURNING id) INSERT INTO reviews (justification, status, student_id, submission_id, user_id, creation_date) VALUES (\'Porque sim\', \'APPROVED\', 676, (SELECT id from subs), 677, current_timestamp);" '
    );
    cy.exec(
        'PGPASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH quest AS (INSERT INTO questions (title, content, course_id, status, creation_date) VALUES (\'Title2\', \'Question2?\', 2,\'DEPRECATED\', current_timestamp) RETURNING id), subs AS (INSERT INTO submissions (question_id, user_id) VALUES ((SELECT id FROM quest), 676) RETURNING id) INSERT INTO reviews (justification, status, student_id, submission_id, user_id, creation_date) VALUES (\'Porque nao\', \'REJECTED\', 676, (SELECT id from subs), 677, current_timestamp);" '
    );
    cy.exec(
        'PGPASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH quest AS (INSERT INTO questions (title, content, course_id, status, creation_date) VALUES (\'Title3\', \'Question3?\', 2,\'DEPRECATED\', current_timestamp) RETURNING id), subs AS (INSERT INTO submissions (question_id, user_id) VALUES ((SELECT id FROM quest), 676) RETURNING id) INSERT INTO reviews (justification, status, student_id, submission_id, user_id, creation_date) VALUES (\'Porque nao\', \'REJECTED\', 676, (SELECT id from subs), 677, current_timestamp);" '
    );
});

Cypress.Commands.add('removeSubmissionInfo', () => {
    cy.exec('PASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH rev AS (DELETE FROM reviews WHERE id IN (SELECT max(id) FROM reviews) RETURNING submission_id), sub AS (DELETE FROM submissions WHERE id IN (SELECT * FROM rev) RETURNING question_id) DELETE FROM questions WHERE id IN (SELECT * FROM sub);" ');
    cy.exec('PASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH rev AS (DELETE FROM reviews WHERE id IN (SELECT max(id) FROM reviews) RETURNING submission_id), sub AS (DELETE FROM submissions WHERE id IN (SELECT * FROM rev) RETURNING question_id) DELETE FROM questions WHERE id IN (SELECT * FROM sub);" ');
    cy.exec('PASSWORD= psql -d tutordb -U dserafim1999 -h localhost -c "WITH rev AS (DELETE FROM reviews WHERE id IN (SELECT max(id) FROM reviews) RETURNING submission_id), sub AS (DELETE FROM submissions WHERE id IN (SELECT * FROM rev) RETURNING question_id) DELETE FROM questions WHERE id IN (SELECT * FROM sub);" ');
});

Cypress.Commands.add('checkUserInfo', (name, username) => {
    cy.get('[data-cy="name"]').contains(name);
    cy.get('[data-cy="username"]').contains(username);
});

Cypress.Commands.add('checkSubmissionsInfo', (numSubmissions, numApprovedSubmissions, numRejectedSubmissions) => {
    cy.get('[data-cy="numSubmissions"]').children().contains(numSubmissions);
    cy.get('[data-cy="numApprovedSubmissions"]').children().contains(numApprovedSubmissions);
    cy.get('[data-cy="numRejectedSubmissions"]').children().contains(numRejectedSubmissions);
});