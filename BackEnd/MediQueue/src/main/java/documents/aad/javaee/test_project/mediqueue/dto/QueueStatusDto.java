package documents.aad.javaee.test_project.mediqueue.dto;

import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QueueStatusDto {
    private int currentTokenNumber; // Queue එකේ දැනට call කරන අංකය
    private int yourTokenNumber;    // ඔබගේ token අංකය
    private String clinicName;
    private TokenStatus yourTokenStatus;
    private int totalPatientsInQueue;
}