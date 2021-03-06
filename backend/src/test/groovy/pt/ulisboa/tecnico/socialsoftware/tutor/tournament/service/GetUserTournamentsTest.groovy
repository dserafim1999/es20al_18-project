package pt.ulisboa.tecnico.socialsoftware.tutor.tournament.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import pt.ulisboa.tecnico.socialsoftware.tutor.answer.AnswerService
import pt.ulisboa.tecnico.socialsoftware.tutor.config.DateHandler
import pt.ulisboa.tecnico.socialsoftware.tutor.course.Course
import pt.ulisboa.tecnico.socialsoftware.tutor.course.CourseExecution
import pt.ulisboa.tecnico.socialsoftware.tutor.course.CourseExecutionRepository
import pt.ulisboa.tecnico.socialsoftware.tutor.course.CourseRepository
import pt.ulisboa.tecnico.socialsoftware.tutor.impexp.domain.AnswersXmlImport
import pt.ulisboa.tecnico.socialsoftware.tutor.notifications.NotificationService
import pt.ulisboa.tecnico.socialsoftware.tutor.question.QuestionService
import pt.ulisboa.tecnico.socialsoftware.tutor.question.domain.Topic
import pt.ulisboa.tecnico.socialsoftware.tutor.question.dto.TopicDto
import pt.ulisboa.tecnico.socialsoftware.tutor.question.repository.TopicRepository
import pt.ulisboa.tecnico.socialsoftware.tutor.quiz.QuizService
import pt.ulisboa.tecnico.socialsoftware.tutor.statement.StatementService
import pt.ulisboa.tecnico.socialsoftware.tutor.submission.SubmissionService
import pt.ulisboa.tecnico.socialsoftware.tutor.tournament.TournamentService
import pt.ulisboa.tecnico.socialsoftware.tutor.tournament.domain.Tournament
import pt.ulisboa.tecnico.socialsoftware.tutor.tournament.dto.TournamentDto
import pt.ulisboa.tecnico.socialsoftware.tutor.tournament.repository.TournamentRepository
import pt.ulisboa.tecnico.socialsoftware.tutor.user.User
import pt.ulisboa.tecnico.socialsoftware.tutor.user.UserRepository
import pt.ulisboa.tecnico.socialsoftware.tutor.worker.CryptoService
import pt.ulisboa.tecnico.socialsoftware.tutor.worker.ServerKeys
import pt.ulisboa.tecnico.socialsoftware.tutor.worker.WorkerService
import spock.lang.Specification

@DataJpaTest
class GetUserTournamentsTest extends Specification {
    public static final String USER_NAME1 = "Tiago"
    public static final String USERNAME1 = "TiagoFonseca99"
    public static final Integer KEY1 = 1
    public static final String USER_NAME2 = "João"
    public static final String USERNAME2 = "JoãoDinis99"
    public static final Integer KEY2 = 2
    public static final String COURSE_NAME = "Software Architecture"
    public static final String ACRONYM = "AS1"
    public static final String ACADEMIC_TERM = "1 SEM"
    public static final String TOPIC_NAME1 = "Informática"
    public static final String TOPIC_NAME2 = "Engenharia de Software"
    public static final int NUMBER_OF_QUESTIONS = 5

    @Autowired
    TournamentService tournamentService

    @Autowired
    UserRepository userRepository

    @Autowired
    CourseRepository courseRepository

    @Autowired
    CourseExecutionRepository courseExecutionRepository

    @Autowired
    TournamentRepository tournamentRepository

    @Autowired
    TopicRepository topicRepository

    def user1
    def user2
    def course
    def courseExecution
    def topic1
    def topic2
    def topicDto1
    def topicDto2
    def topics = new ArrayList<Integer>()
    def startTime = DateHandler.now().plusHours(1)
    def endTime = DateHandler.now().plusHours(2)

    def setup() {
        user1 = new User(USER_NAME1, USERNAME1, KEY1, User.Role.STUDENT)
        user2 = new User(USER_NAME2, USERNAME2, KEY2, User.Role.STUDENT)

        course = new Course(COURSE_NAME, Course.Type.TECNICO)
        courseRepository.save(course)

        courseExecution = new CourseExecution(course, ACRONYM, ACADEMIC_TERM, Course.Type.TECNICO)
        courseExecution.addUser(user1)
        courseExecution.addUser(user2)
        courseExecutionRepository.save(courseExecution)

        user1.addCourse(courseExecution)
        userRepository.save(user1)

        user2.addCourse(courseExecution)
        userRepository.save(user2)

        topicDto1 = new TopicDto()
        topicDto1.setName(TOPIC_NAME1)
        topic1 = new Topic(course, topicDto1)
        topicRepository.save(topic1)

        topicDto2 = new TopicDto()
        topicDto2.setName(TOPIC_NAME2)
        topic2 = new Topic(course, topicDto2)
        topicRepository.save(topic2)

        topics.add(topic1.getId())
        topics.add(topic2.getId())
    }

    def "user creates two tournaments"() {
        given: "a tournament"
        def tournamentDto = new TournamentDto()
        tournamentDto.setStartTime(DateHandler.toISOString(startTime))
        tournamentDto.setEndTime(DateHandler.toISOString(endTime))
        tournamentDto.setNumberOfQuestions(NUMBER_OF_QUESTIONS)
        tournamentDto.setState(Tournament.Status.NOT_CANCELED)
        tournamentService.createTournament(user1.getId(), topics, tournamentDto)

        and: "another tournament"
        def tournamentDto2 = new TournamentDto()
        tournamentDto2.setStartTime(DateHandler.toISOString(startTime))
        tournamentDto2.setEndTime(DateHandler.toISOString(endTime))
        tournamentDto2.setNumberOfQuestions(NUMBER_OF_QUESTIONS)
        tournamentDto2.setState(Tournament.Status.NOT_CANCELED)
        tournamentService.createTournament(user1.getId(), topics, tournamentDto2)

        when:
        def result = tournamentService.getUserTournaments(user1)

        then:
        tournamentRepository.count() == 2L
        result.size() == 2
    }

    def "user creates two tournaments and other user creates one tournament"() {
        given: "a tournament"
        def tournamentDto = new TournamentDto()
        tournamentDto.setStartTime(DateHandler.toISOString(startTime))
        tournamentDto.setEndTime(DateHandler.toISOString(endTime))
        tournamentDto.setNumberOfQuestions(NUMBER_OF_QUESTIONS)
        tournamentDto.setState(Tournament.Status.NOT_CANCELED)
        tournamentService.createTournament(user1.getId(), topics, tournamentDto)

        and: "another tournament"
        def tournamentDto2 = new TournamentDto()
        tournamentDto2.setStartTime(DateHandler.toISOString(startTime))
        tournamentDto2.setEndTime(DateHandler.toISOString(endTime))
        tournamentDto2.setNumberOfQuestions(NUMBER_OF_QUESTIONS)
        tournamentDto2.setState(Tournament.Status.NOT_CANCELED)
        tournamentService.createTournament(user1.getId(), topics, tournamentDto2)

        and: "new user creates another tournament"
        def tournamentDto3 = new TournamentDto()
        tournamentDto3.setStartTime(DateHandler.toISOString(startTime))
        tournamentDto3.setEndTime(DateHandler.toISOString(endTime))
        tournamentDto3.setNumberOfQuestions(NUMBER_OF_QUESTIONS)
        tournamentDto3.setState(Tournament.Status.NOT_CANCELED)
        tournamentService.createTournament(user2.getId(), topics, tournamentDto3)

        when:
        def result = tournamentService.getUserTournaments(user1)

        then:
        tournamentRepository.count() == 3L
        result.size() == 2
    }

    @TestConfiguration
    static class TournamentServiceImplTestContextConfiguration {
        @Bean
        TournamentService tournamentService() {
            return new TournamentService()
        }

        @Bean
        StatementService statementService() {
            return new StatementService()
        }

        @Bean
        QuizService quizService() {
            return new QuizService()
        }

        @Bean
        AnswerService answerService() {
            return new AnswerService()
        }
        @Bean
        AnswersXmlImport answersXmlImport() {
            return new AnswersXmlImport()
        }

        @Bean
        QuestionService questionService() {
            return new QuestionService()
        }

        @Bean
        NotificationService notificationService() {
            return new NotificationService()
        }

        @Bean
        SubmissionService submissionService() {
            return new SubmissionService()
        }

        @Bean
        WorkerService workerService() {
            return new WorkerService()
        }

        @Bean
        CryptoService cryptoService() {
            return new CryptoService()
        }

        @Bean
        ServerKeys serverKeys() {
            return new ServerKeys()
        }
    }
}
