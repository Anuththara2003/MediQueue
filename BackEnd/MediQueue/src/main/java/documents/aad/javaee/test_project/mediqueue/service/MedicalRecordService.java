package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.MedicalRecordCreateDto;
import documents.aad.javaee.test_project.mediqueue.dto.MedicalRecordDto;
import documents.aad.javaee.test_project.mediqueue.entity.MedicalRecord;

import java.util.List;

public interface MedicalRecordService {
    List<MedicalRecordDto> getMedicalRecordsForPatient(Integer patientId);
    MedicalRecord createMedicalRecord(Integer tokenId, MedicalRecordCreateDto dto);

}
