package documents.aad.javaee.test_project.mediqueue.repostry;


import documents.aad.javaee.test_project.mediqueue.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClinicRepository extends JpaRepository<Clinic, Integer> {
    List<Clinic> findByHospital_Id(Long hospitalId);

}
