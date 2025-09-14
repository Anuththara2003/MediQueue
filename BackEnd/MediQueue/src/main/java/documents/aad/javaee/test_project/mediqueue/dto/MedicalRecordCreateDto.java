package documents.aad.javaee.test_project.mediqueue.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicalRecordCreateDto {
    @NotBlank(message = "Diagnosis cannot be empty")
    private String diagnosis;

    private String notes;

    @NotBlank(message = "Prescription cannot be empty")
    private String prescription;
}