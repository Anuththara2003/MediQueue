package documents.aad.javaee.test_project.mediqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ClinicSaveDto {

    private Integer id;
    private String name;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long hospitalId;
    private String hospitalName;
}
