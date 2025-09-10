package documents.aad.javaee.test_project.mediqueue.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class AssignmentDto {

    @NotNull(message = "Doctor ID is required.")
    private Integer doctorId;

    @NotNull(message = "Clinic ID is required.")
    private Integer clinicId;

    @NotNull(message = "Assignment date is required.")
    private LocalDate assignedDate;

    private LocalTime startTime;
    private LocalTime endTime;
}