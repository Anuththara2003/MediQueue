package documents.aad.javaee.test_project.mediqueue.dto;

import documents.aad.javaee.test_project.mediqueue.entity.Gender;
import documents.aad.javaee.test_project.mediqueue.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {
    private String username;
    private String email;
    private String password;
    private Role role;
    private String firstName;
    private String lastName;
    private String contactNumber;
    private LocalDate dateOfBirth;
    private Gender gender;
}
