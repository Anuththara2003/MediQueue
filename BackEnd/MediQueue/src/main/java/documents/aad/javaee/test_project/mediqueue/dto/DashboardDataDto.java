package documents.aad.javaee.test_project.mediqueue.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DashboardDataDto {
    private String patientName;
    private HealthTipDto healthTip;


}
