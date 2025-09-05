package documents.aad.javaee.test_project.mediqueue.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminProfileViewDto {
    private String firstName;
    private String lastName;
    private String email;
    private String avatarUrl;
}