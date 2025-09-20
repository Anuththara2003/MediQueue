package documents.aad.javaee.test_project.mediqueue.Exception;

public class InvalidPasswordException extends RuntimeException{
    public InvalidPasswordException(String massage){
        super(massage);
    }
}
