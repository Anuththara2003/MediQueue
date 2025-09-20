package documents.aad.javaee.test_project.mediqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class SecondHospitalDto {
    private Long id;
    private String name;
    private String location;
    private String address;
    private String status;
    private Integer clinicCount;
}
