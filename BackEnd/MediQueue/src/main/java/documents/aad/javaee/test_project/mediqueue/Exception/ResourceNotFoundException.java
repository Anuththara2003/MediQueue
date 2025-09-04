package documents.aad.javaee.test_project.mediqueue.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    // Constructor එක
    public ResourceNotFoundException(String message) {
        super(message);
    }
}