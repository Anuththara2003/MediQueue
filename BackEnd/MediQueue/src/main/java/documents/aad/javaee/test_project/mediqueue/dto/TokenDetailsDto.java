package documents.aad.javaee.test_project.mediqueue.dto;

import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

// dto/TokenDetailsDto.java
@Getter
@Setter
public class TokenDetailsDto {
    private Integer tokenId;
    private int tokenNumber;
    private String hospitalName;
    private String clinicName;
    private LocalDate appointmentDate;
    private TokenStatus status;

}