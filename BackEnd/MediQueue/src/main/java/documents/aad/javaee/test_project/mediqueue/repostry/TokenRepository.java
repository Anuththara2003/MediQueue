package documents.aad.javaee.test_project.mediqueue.repostry;

import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TokenRepository extends JpaRepository<Token, Integer> {

    List<Token> findByPatientIdAndStatusInOrderByCreatedAtDesc(Integer patientId, List<TokenStatus> statuses);
    long countByQueueId(Integer queueId);
    @Query("SELECT t FROM Token t WHERE t.patient.id = :patientId AND t.status IN :statuses AND t.queue.queueDate >= :today ORDER BY t.queue.queueDate ASC")
    List<Token> findUpcomingAppointments(
            @Param("patientId") Integer patientId,
            @Param("statuses") List<TokenStatus> statuses,
            @Param("today") LocalDate today);
}