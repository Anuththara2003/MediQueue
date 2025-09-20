package documents.aad.javaee.test_project.mediqueue.repostry;

import documents.aad.javaee.test_project.mediqueue.entity.Queue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueRepository extends JpaRepository<Queue, Integer> {

    List<Queue> findByClinicIdAndQueueDate(Long clinicId, LocalDate queueDate);
    Optional<Queue> findByClinicIdAndDoctorIdAndQueueDate(Integer clinicId, Integer doctorId, LocalDate date);
}