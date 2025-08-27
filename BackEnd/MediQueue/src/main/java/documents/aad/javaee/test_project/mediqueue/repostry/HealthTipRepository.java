package documents.aad.javaee.test_project.mediqueue.repostry;

import documents.aad.javaee.test_project.mediqueue.entity.HealthTip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthTipRepository extends JpaRepository<HealthTip, Long> {}