package documents.aad.javaee.test_project.mediqueue.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "slmc_registration_no", nullable = false, unique = true)
    private String slmcRegistrationNo;

    @Column(nullable = false)
    private String fullName;

    private String specialization;

    @Column(unique = true)
    private String contactNumber;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private DoctorStatus status = DoctorStatus.ACTIVE;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Relationship to ClinicDoctorAssignment join entity
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ClinicDoctorAssignment> clinicAssignments = new HashSet<>();

    // Relationship to MedicalRecord join entity
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<MedicalRecord> medicalRecords = new HashSet<>();
}