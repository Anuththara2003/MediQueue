package documents.aad.javaee.test_project.mediqueue.Exception;

public class InvalidFileTypeException extends RuntimeException{
    public InvalidFileTypeException(String massage){
        super(massage);
    }
}
