package pt.ulisboa.tecnico.socialsoftware.tutor.user;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import pt.ulisboa.tecnico.socialsoftware.tutor.exceptions.TutorException;
import pt.ulisboa.tecnico.socialsoftware.tutor.user.dto.DashboardDto;

import static pt.ulisboa.tecnico.socialsoftware.tutor.exceptions.ErrorMessage.AUTHENTICATION_ERROR;;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping(value = "/dashboard")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public DashboardDto getDashboardInfo(Principal principal) {
        User user = (User) ((Authentication) principal).getPrincipal();

        if (user == null) {
            throw new TutorException(AUTHENTICATION_ERROR);
        }

        return userService.getDashboardInfo(user.getId());
    }
}
