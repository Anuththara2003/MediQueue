package documents.aad.javaee.test_project.mediqueue.service.Impl;

import documents.aad.javaee.test_project.mediqueue.dto.MedicalRecordCreateDto;
import documents.aad.javaee.test_project.mediqueue.dto.MedicalRecordDto;
import documents.aad.javaee.test_project.mediqueue.entity.MedicalRecord;
import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;
import documents.aad.javaee.test_project.mediqueue.repostry.MedicalRecordRepository;
import documents.aad.javaee.test_project.mediqueue.repostry.TokenRepository;
import documents.aad.javaee.test_project.mediqueue.service.MedicalRecordService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Override
    public List<MedicalRecordDto> getMedicalRecordsForPatient(Integer patientId) {

        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdOrderByConsultationDateDesc(patientId);

        // 2. ලැබුණු Entity list එක, DTO list එකක් බවට පත් කර return කරනවා
        return records.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public MedicalRecord createMedicalRecord(Integer tokenId, MedicalRecordCreateDto dto) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new EntityNotFoundException("Token not found with ID: " + tokenId));

        MedicalRecord newRecord = new MedicalRecord();
        newRecord.setToken(token);
        newRecord.setPatient(token.getPatient());
        newRecord.setDoctor(token.getDoctor());
        newRecord.setConsultationDate(LocalDate.now());
        newRecord.setDiagnosis(dto.getDiagnosis());
        newRecord.setNotes(dto.getNotes());
        newRecord.setPrescription(dto.getPrescription());

        token.setStatus(TokenStatus.COMPLETED);
        token.setCompletedTime(LocalDateTime.now());
        tokenRepository.save(token);

        return medicalRecordRepository.save(newRecord);
    }


    // MedicalRecord entity එක MedicalRecordDto එකක් බවට පත් කරන helper method එක
    private MedicalRecordDto convertToDto(MedicalRecord record) {
        MedicalRecordDto dto = new MedicalRecordDto();
        dto.setRecordId(record.getId());
        dto.setConsultationDate(record.getConsultationDate());
        dto.setDiagnosis(record.getDiagnosis());
        dto.setPrescription(record.getPrescription());

        // සම්බන්ධිත entities වලින් දත්ත ලබාගැනීම
        if (record.getDoctor() != null) {
            dto.setDoctorName(record.getDoctor().getFullName());
        }
        if (record.getToken() != null && record.getToken().getQueue() != null && record.getToken().getQueue().getClinic() != null) {
            dto.setClinicName(record.getToken().getQueue().getClinic().getName());
        }

        return dto;
    }
}