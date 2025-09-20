package documents.aad.javaee.test_project.mediqueue.service.Impl;


import documents.aad.javaee.test_project.mediqueue.dto.NotificationDto;
import documents.aad.javaee.test_project.mediqueue.entity.Notification;
import documents.aad.javaee.test_project.mediqueue.repostry.NotificationRepository;
import documents.aad.javaee.test_project.mediqueue.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public List<NotificationDto> getNotificationsForPatient(Integer patientId) {
        return notificationRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public List<NotificationDto> getAllNotifications() {
        return notificationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private NotificationDto convertToDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setMessage(notification.getMessage());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setStatus(notification.getStatus());

        if(notification.getToken() != null && notification.getToken().getDoctor() != null) {
            dto.setSenderName("Dr. " + notification.getToken().getDoctor().getFullName());
        } else {
            dto.setSenderName("MediQueue System");
        }
        return dto;
    }
}