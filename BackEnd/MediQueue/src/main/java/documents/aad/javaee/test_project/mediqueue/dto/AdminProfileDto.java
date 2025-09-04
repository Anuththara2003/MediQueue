package documents.aad.javaee.test_project.mediqueue.dto;

import lombok.Data;

@Data
public class AdminProfileDto {
    private String firstName;
    private String lastName;
    private String email;
    private String newPassword;
}
