package documents.aad.javaee.test_project.mediqueue.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TokenRequestDto {

    @NotNull(message = "Patient ID cannot be null")
    private Integer patientId;

    @NotNull(message = "Doctor ID cannot be null")
    private Integer doctorId;

    @NotNull(message = "Clinic ID cannot be null")
    private Integer clinicId;

    @NotNull(message = "Appointment Date is required")
    private LocalDate appointmentDate;
}