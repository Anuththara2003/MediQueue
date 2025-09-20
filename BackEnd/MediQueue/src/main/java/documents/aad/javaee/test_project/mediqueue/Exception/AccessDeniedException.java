package documents.aad.javaee.test_project.mediqueue.Exception;

public class AccessDeniedException extends RuntimeException{
    public AccessDeniedException(String massage){
        super(massage);
    }
}
