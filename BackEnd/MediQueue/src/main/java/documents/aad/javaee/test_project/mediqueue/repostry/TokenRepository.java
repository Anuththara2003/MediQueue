package documents.aad.javaee.test_project.mediqueue.repostry;

import documents.aad.javaee.test_project.mediqueue.entity.Queue;
import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Integer> {

    List<Token> findByPatientIdAndStatusInOrderByCreatedAtDesc(Integer patientId, List<TokenStatus> statuses);

    long countByQueueId(Integer queueId);


    @Query("SELECT t FROM Token t " +
            "LEFT JOIN FETCH t.queue q " +
            "LEFT JOIN FETCH q.clinic c " +
            "LEFT JOIN FETCH q.doctor d " +
            "LEFT JOIN FETCH c.hospital h " +
            "WHERE t.patient.id = :patientId AND t.status IN :statuses AND q.queueDate >= :today " +
            "ORDER BY q.queueDate ASC")
    List<Token> findUpcomingAppointments(
            @Param("patientId") Integer patientId,
            @Param("statuses") List<TokenStatus> statuses,
            @Param("today") LocalDate today);

    @Query("SELECT t FROM Token t " +
            "LEFT JOIN FETCH t.queue q " +
            "LEFT JOIN FETCH q.clinic c " +
            "LEFT JOIN FETCH q.doctor d " +
            "LEFT JOIN FETCH c.hospital h " +
            "WHERE t.patient.id = :patientId AND t.status IN :statuses " +
            "ORDER BY q.queueDate DESC")
    List<Token> findPastAppointments(
            @Param("patientId") Integer patientId,
            @Param("statuses") List<TokenStatus> statuses);

    // --- Analytics Queries (මෙම කොටස් වල වෙනසක් අවශ්‍ය නැත) ---
    @Query("SELECT t.queue.clinic.name FROM Token t WHERE t.queue.queueDate BETWEEN :startDate AND :endDate GROUP BY t.queue.clinic.name ORDER BY COUNT(t) DESC LIMIT 1")
    String findBusiestClinicName(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT new map(h.name as hospitalName, COUNT(t) as tokenCount) FROM Token t JOIN t.queue q JOIN q.clinic c JOIN c.hospital h WHERE q.queueDate BETWEEN :startDate AND :endDate GROUP BY h.name")
    List<Map<String, Object>> countTokensByHospital(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<Token> findAllByQueue_QueueDateBetween(LocalDate startDate, LocalDate endDate);

    Optional<Token> findFirstByQueueAndStatusAndTokenNumberGreaterThanOrderByTokenNumberAsc(
            Queue queue, TokenStatus status, int currentTokenNumber);

    @Query("SELECT t FROM Token t JOIN t.queue q WHERE q.status = 'ACTIVE' AND t.status = 'WAITING' AND t.isApproachingNotified = false AND t.tokenNumber > q.currentToken AND t.tokenNumber <= (q.currentToken + :notificationThreshold)")
    List<Token> findApproachingTokensInActiveQueues(
            @Param("notificationThreshold") int notificationThreshold);
}