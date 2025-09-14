package documents.aad.javaee.test_project.mediqueue.service.Impl;


import documents.aad.javaee.test_project.mediqueue.dto.*;
import documents.aad.javaee.test_project.mediqueue.entity.*;
import documents.aad.javaee.test_project.mediqueue.repostry.*;
import documents.aad.javaee.test_project.mediqueue.service.TokenService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
    @Transactional
    public Token createToken(TokenRequestDto dto) {

        User patient = userRepository.findById(Long.valueOf(dto.getPatientId())).orElseThrow();
        Doctor doctor = doctorRepository.findById(dto.getDoctorId()).orElseThrow();
        Clinic clinic = clinicRepository.findById(dto.getClinicId()).orElseThrow();

        Queue queue = queueRepository.findByClinicIdAndDoctorIdAndQueueDate
                        (dto.getClinicId(), dto.getDoctorId(), dto.getAppointmentDate())
                .orElseGet(() -> {
                    Queue newQueue = new Queue();
                    newQueue.setClinic(clinic);
                    newQueue.setDoctor(doctor);
                    newQueue.setQueueDate(dto.getAppointmentDate());
                    return queueRepository.save(newQueue);
                });


        long existingTokenCount = tokenRepository.countByQueueId(queue.getId());

        int nextTokenNumber = (int) existingTokenCount + 1;


        Token newToken = new Token();
        newToken.setPatient(patient);
        newToken.setQueue(queue);
        newToken.setDoctor(doctor);
        newToken.setTokenNumber(nextTokenNumber);


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

    @Override
    public Token cancelToken(Integer tokenId, Integer patientId) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new EntityNotFoundException("Token not found with ID: " + tokenId));

        if (!token.getPatient().getId().equals(patientId)) {
            throw new IllegalStateException("Access Denied: You are not the owner of this token.");
        }

        if (token.getStatus() == TokenStatus.COMPLETED || token.getStatus() == TokenStatus.CANCELLED) {
            throw new IllegalStateException("This token cannot be cancelled as it is already " + token.getStatus().toString().toLowerCase());
        }

        token.setStatus(TokenStatus.CANCELLED);

        return tokenRepository.save(token);
    }

    @Override
    public List<AppointmentCardDto> getUpcomingAppointmentsForPatient(Integer patientId) {
        // 1. සක්‍රීය තත්වයන් සහ අද දිනය ලබාගැනීම
        List<TokenStatus> activeStatuses = List.of(TokenStatus.WAITING, TokenStatus.IN_PROGRESS);
        LocalDate today = LocalDate.now();

        // 2. Repository එක call කර, upcoming appointments ලබාගැනීම
        List<Token> upcomingTokens = tokenRepository.findUpcomingAppointments(patientId, activeStatuses, today);

        // 3. ලැබුණු Token list එක, DTO list එකක් බවට පත් කර return කිරීම
        return upcomingTokens.stream()
                .map(this::convertToAppointmentCardDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentCardDto> getPastAppointmentsForPatient(Integer patientId) {
        List<TokenStatus> pastStatuses = List.of(TokenStatus.COMPLETED, TokenStatus.CANCELLED, TokenStatus.SKIPPED);

        List<Token> pastTokens = tokenRepository.findPastAppointments(patientId, pastStatuses);
        return pastTokens.stream()
                .map(this::convertToAppointmentCardDto)
                .collect(Collectors.toList());
    }

    @Override
    public QueueStatusDto getLiveQueueStatusForPatient(Integer patientId) {
        List<TokenStatus> activeStatuses = List.of(TokenStatus.WAITING, TokenStatus.IN_PROGRESS);
        List<Token> activeTokens = tokenRepository.findByPatientIdAndStatusInOrderByCreatedAtDesc(patientId, activeStatuses);

        if (activeTokens.isEmpty()) {
            throw new EntityNotFoundException("No active token found to track.");
        }
        Token myToken = activeTokens.get(0);
        Queue currentQueue = myToken.getQueue();

        // 3. DTO එකක් නිර්මාණය කර, අවශ්‍ය දත්ත පිරවීම
        QueueStatusDto dto = new QueueStatusDto();
        dto.setCurrentTokenNumber(currentQueue.getCurrentToken());
        dto.setYourTokenNumber(myToken.getTokenNumber());
        dto.setClinicName(currentQueue.getClinic().getName());
        dto.setYourTokenStatus(myToken.getStatus());

        // === මෙන්න වැදගත්ම වෙනස ===
        // Queue entity එකේ ඇති totalTokens අගය, DTO එකට set කරනවා
        dto.setTotalPatientsInQueue(currentQueue.getTotalTokens());
        // ============================

        return dto;
    }

    @Override
    public List<QueueTokenDto> getTokensForQueue(Integer clinicId, LocalDate date) {
        // 1. අදාළ clinic/date එකට අදාළ Queue එක සොයාගන්නවා
        Queue queue = queueRepository.findByClinicIdAndQueueDate(clinicId, date)
                .orElse(null); // Queue එකක් නැත්නම්, null ලෙස return කරනවා

        if (queue == null) {
            // Queue එකක් නොමැතිනම්, හිස් list එකක් return කරනවා
            return Collections.emptyList();
        }

        // 2. Queue එකේ ඇති සියලුම tokens, අංකය අනුව sort කර DTO බවට පත් කරනවා
        return queue.getTokens().stream()
                .sorted(Comparator.comparing(Token::getTokenNumber)) // Token අංකය අනුව sort කිරීම
                .map(this::convertToQueueTokenDto)
                .collect(Collectors.toList());
    }

    // Token entity එක QueueTokenDto එකක් බවට පත් කරන helper method එක
    private QueueTokenDto convertToQueueTokenDto(Token token) {
        QueueTokenDto dto = new QueueTokenDto();
        dto.setTokenId(token.getId());
        dto.setTokenNumber(token.getTokenNumber());
        dto.setStatus(token.getStatus());

        // Token එකට සම්බන්ධ Patient ගේ දත්ත ලබාගැනීම
        User patient = token.getPatient();
        dto.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        dto.setPatientContact(patient.getContactNumber());

        return dto;
    }


    private AppointmentCardDto convertToAppointmentCardDto(Token token) {
        AppointmentCardDto dto = new AppointmentCardDto();

        Queue queue = token.getQueue();
        Clinic clinic = queue.getClinic();
        Doctor doctor = token.getDoctor();
        Hospital hospital = clinic.getHospital();

        dto.setClinicName(clinic.getName());
        dto.setDoctorName(doctor.getFullName());
        dto.setHospitalName(hospital.getName());
        dto.setDoctorContact(doctor.getContactNumber());
        dto.setAppointmentDate(queue.getQueueDate());
        dto.setAppointmentTime(clinic.getStartTime());


        return dto;
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