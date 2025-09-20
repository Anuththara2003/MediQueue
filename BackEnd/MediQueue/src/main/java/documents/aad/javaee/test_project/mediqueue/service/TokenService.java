package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.*;
import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;

import java.time.LocalDate;
import java.util.List;

public interface TokenService {
    Token createToken(TokenRequestDto tokenRequestDto);
    TokenDetailsDto getLatestActiveTokenForPatient(Integer patientId);
    Token updateTokenStatus(Integer tokenId, TokenStatus newStatus);
    Token cancelToken(Integer tokenId, Integer patientId);
    List<AppointmentCardDto> getUpcomingAppointmentsForPatient(Integer patientId);
    List<AppointmentCardDto> getPastAppointmentsForPatient(Integer patientId);

    QueueStatusDto getLiveQueueStatusForPatient(Integer patientId);

    List<QueueTokenDto> getTokensForQueue(Integer clinicId, LocalDate date);
}
