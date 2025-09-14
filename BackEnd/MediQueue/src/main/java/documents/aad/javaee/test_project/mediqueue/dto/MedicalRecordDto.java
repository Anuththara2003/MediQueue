package documents.aad.javaee.test_project.mediqueue.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MedicalRecordDto {
    private Integer recordId;
    private LocalDate consultationDate;
    private String doctorName;
    private String clinicName;
    private String diagnosis;
    private String prescription;
    // ඔබට අවශ්‍ය නම්, 'notes' වැනි අමතර fields ද එකතු කළ හැක
}