package documents.aad.javaee.test_project.mediqueue.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "health_tips")
public class HealthTip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String content;

    private String language;
}