package documents.aad.javaee.test_project.mediqueue.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientProfileViewDto {
    private String fullName;
    private String email;
    private String avatarUrl;
}