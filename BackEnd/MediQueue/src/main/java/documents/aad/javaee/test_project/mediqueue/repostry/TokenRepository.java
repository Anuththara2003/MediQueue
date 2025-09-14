package documents.aad.javaee.test_project.mediqueue.repostry;

import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface TokenRepository extends JpaRepository<Token, Integer> {

    List<Token> findByPatientIdAndStatusInOrderByCreatedAtDesc(Integer patientId, List<TokenStatus> statuses);
    long countByQueueId(Integer queueId);
    @Query("SELECT t FROM Token t WHERE t.patient.id = :patientId AND t.status IN :statuses AND t.queue.queueDate >= :today ORDER BY t.queue.queueDate ASC")
    List<Token> findUpcomingAppointments(
            @Param("patientId") Integer patientId,
            @Param("statuses") List<TokenStatus> statuses,
            @Param("today") LocalDate today);

    @Query("SELECT t FROM Token t WHERE t.patient.id = :patientId AND t.status IN :statuses ORDER BY t.queue.queueDate DESC")
    List<Token> findPastAppointments(
            @Param("patientId") Integer patientId,
            @Param("statuses") List<TokenStatus> statuses);

    @Query("SELECT t.queue.clinic.name FROM Token t WHERE t.queue.queueDate BETWEEN :startDate AND :endDate GROUP BY t.queue.clinic.name ORDER BY COUNT(t) DESC LIMIT 1")
    String findBusiestClinicName(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT new map(h.name as hospitalName, COUNT(t) as tokenCount) FROM Token t JOIN t.queue q JOIN q.clinic c JOIN c.hospital h WHERE q.queueDate BETWEEN :startDate AND :endDate GROUP BY h.name")
    List<Map<String, Object>> countTokensByHospital(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<Token> findAllByQueue_QueueDateBetween(LocalDate startDate, LocalDate endDate);
}