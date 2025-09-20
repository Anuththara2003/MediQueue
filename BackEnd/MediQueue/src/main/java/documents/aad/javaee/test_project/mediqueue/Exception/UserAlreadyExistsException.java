package documents.aad.javaee.test_project.mediqueue.Exception;

public class UserAlreadyExistsException extends RuntimeException{
    public UserAlreadyExistsException(String massage){
        super(massage);
    }
}
