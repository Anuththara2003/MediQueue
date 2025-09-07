package documents.aad.javaee.test_project.mediqueue.repostry;


import documents.aad.javaee.test_project.mediqueue.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepository extends JpaRepository<Clinic, Integer> {
    // දැනට අලුත් methods අවශ්‍ය නැහැ. JpaRepository එකේ තියෙන save() එක ඇති.
}
