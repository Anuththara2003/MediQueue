package documents.aad.javaee.test_project.mediqueue.repostry;

import documents.aad.javaee.test_project.mediqueue.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByPatientIdOrderByCreatedAtDesc(Integer patientId);
}