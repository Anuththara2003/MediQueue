package documents.aad.javaee.test_project.mediqueue.dto;

import documents.aad.javaee.test_project.mediqueue.entity.Gender;
import documents.aad.javaee.test_project.mediqueue.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponseDto {
    private Integer id;
    private String email;
    private Role role;
    private String firstName;
    private String lastName;
    private String contactNumber;
    private LocalDate dateOfBirth;
    private Gender gender;
    private LocalDateTime createdAt;
    private String avatarUrl;
}