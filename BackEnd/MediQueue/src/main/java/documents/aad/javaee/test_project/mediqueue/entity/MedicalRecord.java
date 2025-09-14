package documents.aad.javaee.test_project.mediqueue.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "medical_records")
public class    MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnore
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private User patient;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id", unique = true)
    @JsonIgnore
    private Token token;

    @Column(nullable = false)
    private LocalDate consultationDate;

    @Column(columnDefinition = "TEXT")
    private String diagnosis;
    @Column(columnDefinition = "TEXT")
    private String notes;
    @Column(columnDefinition = "TEXT")
    private String prescription;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}