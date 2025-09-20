package documents.aad.javaee.test_project.mediqueue.repostry;

import documents.aad.javaee.test_project.mediqueue.entity.Hospital;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Integer> {
    List<Hospital> findByNameContainingIgnoreCase(String name);

//    Page<Hospital> findByNameContainingIgnoreCase(String search, Pageable pageable);

    @Query("SELECT h FROM Hospital h WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Hospital> searchByNameCustom(@Param("search") String search, Pageable pageable);

    @Query("SELECT h.name FROM Hospital h WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%')) ORDER BY h.name ASC")
    List<String> findHospitalNamesBySearchTerm(@Param("search") String search);
}