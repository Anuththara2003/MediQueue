package documents.aad.javaee.test_project.mediqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // <-- මෙන්න අලුතින් එකතු කළ යුතු annotation එක
@AllArgsConstructor // <-- මේකත් එකතු කිරීම හොඳයි
public class ClinicDto {
    private Integer id;
    private String name;
}