package documents.aad.javaee.test_project.mediqueue.Exception;

import documents.aad.javaee.test_project.mediqueue.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> ResourceNotFoundException(ResourceNotFoundException e){
        return new ResponseEntity<>(
                new ApiResponse(404, e.getMessage(), null), HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> UserAlreadyExistsException (UserAlreadyExistsException e){
        return new ResponseEntity<>(
            new ApiResponse(409, e.getMessage(), null),HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(InvalidFileTypeException.class)
    public ResponseEntity<ApiResponse> InvalidFileTypeException(InvalidFileTypeException e){
        return new ResponseEntity<>(
          new ApiResponse(415, e.getMessage(),null),HttpStatus.UNSUPPORTED_MEDIA_TYPE
        );
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ApiResponse> InvalidPasswordException(InvalidPasswordException e){
     return new ResponseEntity<>(
             new ApiResponse(400,e.getMessage(),null),HttpStatus.BAD_REQUEST
     );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> AccessDeniedException(AccessDeniedException e){
        return new ResponseEntity<>(
          new ApiResponse(403, e.getMessage(),null),HttpStatus.FORBIDDEN
        );
    }
}
