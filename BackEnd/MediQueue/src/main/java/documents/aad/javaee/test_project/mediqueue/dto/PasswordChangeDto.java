package documents.aad.javaee.test_project.mediqueue.dto;

import lombok.Data;

@Data
public class PasswordChangeDto {
    private String currentPassword;
    private String newPassword;
}
