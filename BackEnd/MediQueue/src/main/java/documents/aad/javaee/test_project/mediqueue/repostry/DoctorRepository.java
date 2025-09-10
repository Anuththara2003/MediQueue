package documents.aad.javaee.test_project.mediqueue.repostry;


import documents.aad.javaee.test_project.mediqueue.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    boolean existsBySlmcRegistrationNoOrEmailOrContactNumber(String slmc, String email, String contact);

}