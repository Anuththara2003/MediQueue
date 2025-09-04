package documents.aad.javaee.test_project.mediqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDto {
    private Integer id;
    private String name;
    private String location;
    private String status;
    private int clinicCount; // අලුතින් එකතු කළ field එක
}