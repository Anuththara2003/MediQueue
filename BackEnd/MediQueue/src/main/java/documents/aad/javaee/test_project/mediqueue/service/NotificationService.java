package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.NotificationDto;

import java.util.List;

public interface NotificationService {
    List<NotificationDto> getNotificationsForPatient(Integer patientId);
    List<NotificationDto> getAllNotifications();

}

