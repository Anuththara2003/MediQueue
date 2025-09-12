package documents.aad.javaee.test_project.mediqueue.service.Impl;


import documents.aad.javaee.test_project.mediqueue.dto.TokenDetailsDto;
import documents.aad.javaee.test_project.mediqueue.dto.TokenRequestDto;
import documents.aad.javaee.test_project.mediqueue.entity.*;
import documents.aad.javaee.test_project.mediqueue.repostry.*;
import documents.aad.javaee.test_project.mediqueue.service.TokenService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TokenServiceImpl implements TokenService {
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private ClinicRepository clinicRepository;
    @Autowired
    private QueueRepository queueRepository;



    @Override
    public Token createToken(TokenRequestDto dto) {

        User patient = userRepository.findById(Long.valueOf(dto.getPatientId()))
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + dto.getPatientId()));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));
        Clinic clinic = clinicRepository.findById(dto.getClinicId())
                .orElseThrow(() -> new EntityNotFoundException("Clinic not found with ID: " + dto.getClinicId()));


        Queue queue = queueRepository.findByClinicIdAndQueueDate(dto.getClinicId(), dto.getAppointmentDate())
                .orElseGet(() -> {
                    Queue newQueue = new Queue();
                    newQueue.setClinic(clinic);
                    newQueue.setQueueDate(dto.getAppointmentDate());
                    return queueRepository.save(newQueue);
                });

        int nextTokenNumber = queue.getTotalTokens() + 1;

        Token newToken = new Token();
        newToken.setPatient(patient);
        newToken.setQueue(queue);
        newToken.setTokenNumber(nextTokenNumber);
        queue.setTotalTokens(nextTokenNumber);
        queueRepository.save(queue);

        return tokenRepository.save(newToken);
    }

    @Override
    public TokenDetailsDto getLatestActiveTokenForPatient(Integer patientId) {
        List<TokenStatus> activeStatuses = List.of(TokenStatus.WAITING, TokenStatus.IN_PROGRESS);


        List<Token> activeTokens = tokenRepository.findByPatientIdAndStatusInOrderByCreatedAtDesc(patientId, activeStatuses);
        if (activeTokens.isEmpty()) {
            throw new EntityNotFoundException("No active token found for the patient.");
        }

        Token latestToken = activeTokens.get(0);
        return convertToTokenDetailsDto(latestToken);
    }

    @Override
    public Token updateTokenStatus(Integer tokenId, TokenStatus newStatus) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new EntityNotFoundException("Token not found with ID: " + tokenId));

        token.setStatus(newStatus);

        if (newStatus == TokenStatus.IN_PROGRESS) {
            token.setCheckInTime(LocalDateTime.now());
        }

        return tokenRepository.save(token);
    }

    private TokenDetailsDto convertToTokenDetailsDto(Token token) {
        TokenDetailsDto dto = new TokenDetailsDto();
        dto.setTokenId(token.getId());
        dto.setTokenNumber(token.getTokenNumber());
        dto.setAppointmentDate(token.getQueue().getQueueDate());
        dto.setStatus(token.getStatus());
        dto.setClinicName(token.getQueue().getClinic().getName());
        dto.setHospitalName(token.getQueue().getClinic().getHospital().getName());
        return dto;
    }
}
