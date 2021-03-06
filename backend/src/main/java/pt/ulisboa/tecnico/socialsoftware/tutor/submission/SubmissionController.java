package pt.ulisboa.tecnico.socialsoftware.tutor.submission;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pt.ulisboa.tecnico.socialsoftware.tutor.exceptions.TutorException;
import pt.ulisboa.tecnico.socialsoftware.tutor.question.QuestionService;
import pt.ulisboa.tecnico.socialsoftware.tutor.question.dto.QuestionDto;
import pt.ulisboa.tecnico.socialsoftware.tutor.submission.dto.SubmissionDto;
import pt.ulisboa.tecnico.socialsoftware.tutor.user.User;
import pt.ulisboa.tecnico.socialsoftware.tutor.submission.dto.ReviewDto;

import javax.validation.Valid;

import static pt.ulisboa.tecnico.socialsoftware.tutor.exceptions.ErrorMessage.*;

import java.security.Principal;
import java.util.List;

@RestController
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private QuestionService questionService;

    @PostMapping(value = "/student/submissions")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public SubmissionDto createSubmission(Principal principal, @Valid @RequestBody SubmissionDto submissionDto) {
        User user = (User) ((Authentication) principal).getPrincipal();

        if (user == null) {
            throw new TutorException(AUTHENTICATION_ERROR);
        }

        QuestionDto question = questionService.createQuestion(submissionDto.getCourseId(), submissionDto.getQuestionDto());
        submissionDto.setQuestionDto(question);
        submissionDto.setStudentId(user.getId());

        return submissionService.createSubmission(question.getId(), submissionDto);
    }

    @PutMapping(value = "/management/reviews/changeSubmission")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public void changeSubmission(Principal principal, @Valid @RequestBody SubmissionDto submissionDto) {
        User user = (User) ((Authentication) principal).getPrincipal();

        if (user == null) {
            throw new TutorException(AUTHENTICATION_ERROR);
        }

        submissionService.changeSubmission(submissionDto);
    }

    @PutMapping("/student/reviews/{questionId}")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public SubmissionDto resubmitQuestion(Principal principal, @PathVariable Integer questionId, @Valid @RequestBody SubmissionDto submissionDto) {
        User user = (User) ((Authentication) principal).getPrincipal();

        if (user == null) {
            throw new TutorException(AUTHENTICATION_ERROR);
        }

        QuestionDto oldQuestion = questionService.findQuestionById(questionId);
        oldQuestion.getOptions().stream().forEach(o->o.setId(null));
        QuestionDto newQuestion = questionService.createQuestion(submissionDto.getCourseId(), oldQuestion);

        submissionDto.setStudentId(user.getId());

        return submissionService.resubmitQuestion(questionId, newQuestion.getId(), submissionDto);
    }


    @PostMapping(value = "/management/reviews")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ReviewDto createReview(Principal principal, @RequestBody ReviewDto reviewDto) {
        User user = (User) ((Authentication) principal).getPrincipal();

        if (user == null) {
            throw new TutorException(AUTHENTICATION_ERROR);
        }

        reviewDto.setTeacherId(user.getId());

        return submissionService.reviewSubmission(user.getId(), reviewDto);
    }

    @GetMapping(value = "/management/reviews")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public List<SubmissionDto> getSubsToTeacher(Principal principal, @Valid @RequestParam Integer executionId) {
        User user = (User) ((Authentication) principal).getPrincipal();

        if (user == null) {
            throw new TutorException(AUTHENTICATION_ERROR);
        } else if (executionId == null) {
            throw new TutorException(COURSE_EXECUTION_MISSING);
        }

        return submissionService.getSubsToTeacher(executionId);
    }

    @GetMapping(value = "/management/reviews/showReviews")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public List<ReviewDto> getReviewsToTeacher(Principal principal, @Valid @RequestParam Integer executionId) {
        User user = (User) ((Authentication) principal).getPrincipal();

        if (user == null) {
            throw new TutorException(AUTHENTICATION_ERROR);
        } else if (executionId == null) {
            throw new TutorException(COURSE_EXECUTION_MISSING);
        }

        return submissionService.getReviewsToTeacher(executionId);
    }

    @GetMapping(value = "/student/reviews")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public List<ReviewDto> getSubmissionReviews(Principal principal, @Valid @RequestParam Integer executionId) {
        User user = (User) ((Authentication) principal).getPrincipal();

        if (user == null) {
            throw new TutorException(AUTHENTICATION_ERROR);
        } else if (executionId == null) {
            throw new TutorException(COURSE_EXECUTION_MISSING);
        }

        return submissionService.getSubmissionReviews(user.getId(), executionId);
    }

    @GetMapping(value = "/student/submissions")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public List<SubmissionDto> getSubmissions(Principal principal, @Valid @RequestParam Integer executionId) {
        User user = (User) ((Authentication) principal).getPrincipal();

        if (user == null) {
            throw new TutorException(AUTHENTICATION_ERROR);
        } else if (executionId == null) {
            throw new TutorException(COURSE_EXECUTION_MISSING);
        }

        return submissionService.getSubmissions(user.getId(), executionId);
    }

    @GetMapping(value = "/student/submissions/all")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public List<SubmissionDto> getStudentsSubmissions(Principal principal, @Valid @RequestParam Integer executionId) {
        User user = (User) ((Authentication) principal).getPrincipal();

        if (user == null) {
            throw new TutorException(AUTHENTICATION_ERROR);
        } else if (executionId == null) {
            throw new TutorException(COURSE_EXECUTION_MISSING);
        }

        return submissionService.getStudentsSubmissions(executionId);
    }
}
