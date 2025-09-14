package documents.aad.javaee.test_project.mediqueue.dto;

import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QueueTokenDto {
    private Integer tokenId;
    private int tokenNumber;
    private String patientName;
    private String patientContact;
    private TokenStatus status;
}