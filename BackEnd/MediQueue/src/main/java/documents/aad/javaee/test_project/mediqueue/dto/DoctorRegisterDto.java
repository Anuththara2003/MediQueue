package documents.aad.javaee.test_project.mediqueue.dto;


import documents.aad.javaee.test_project.mediqueue.entity.DoctorStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRegisterDto {

    private Integer id;

    @NotBlank(message = "SLMC Registration Number is required.")
    private String slmcRegistrationNo;

    @NotBlank(message = "Full Name is required.")
    private String fullName;

    private String specialization;
    private String contactNumber;

    @Email(message = "Please provide a valid email address.")
    @NotBlank(message = "Email is required.")
    private String email;

    @NotNull(message = "Doctor status cannot be null.")
    private DoctorStatus status;
}