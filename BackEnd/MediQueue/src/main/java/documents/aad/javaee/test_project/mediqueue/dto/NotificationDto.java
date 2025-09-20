package documents.aad.javaee.test_project.mediqueue.dto;

import documents.aad.javaee.test_project.mediqueue.entity.NotificationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NotificationDto {
    private String message;
    private LocalDateTime createdAt;
    private NotificationStatus status;
    private String senderName;
    private String patientContact;
}
