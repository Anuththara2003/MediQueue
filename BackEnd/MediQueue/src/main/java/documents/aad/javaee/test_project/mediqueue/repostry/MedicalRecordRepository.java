package documents.aad.javaee.test_project.mediqueue.repostry;

import documents.aad.javaee.test_project.mediqueue.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


import java.util.List;


@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {
    List<MedicalRecord> findByPatientIdOrderByConsultationDateDesc(Integer patientId);

}