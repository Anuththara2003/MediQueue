package documents.aad.javaee.test_project.mediqueue.dto;

import documents.aad.javaee.test_project.mediqueue.entity.Hospital;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClinicSaveDto {

    private Integer id;
    private String name;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long hospitalId;
    private String hospitalName;
}
