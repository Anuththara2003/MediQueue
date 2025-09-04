//package documents.aad.javaee.test_project.mediqueue.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//@AllArgsConstructor
//@NoArgsConstructor
//@Getter
//@Setter
//@Entity
//@Table(name = "hospitals")
//public class Hospital {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer id;
//
//    @Column(nullable = false)
//    private String name;
//
//    @Column(columnDefinition = "TEXT")
//    private String address;
//
//    private String city;
//    private String contactNumber;
//
//    @Column(unique = true)
//    private String email;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private HospitalType type;
//
//    private boolean isActive = true;
//
//    @CreationTimestamp
//    @Column(updatable = false)
//    private LocalDateTime createdAt;
//
//    @UpdateTimestamp
//    private LocalDateTime updatedAt;
//
//    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private List<Clinic> clinics = new ArrayList<>();
//
//    public void setLocation(String location) {
//        String[] parts = location.split(",");
//        this.city = parts[0].trim();
//        this.address = parts[1].trim();
//    }
//
//    public void setStatus(String active) {
//        if (active.equalsIgnoreCase("active")) {
//            this.isActive = true;
//        }
//    }
//}


package documents.aad.javaee.test_project.mediqueue.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "hospital")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "city")
    private String location;
    private String address;

    @Column(nullable = false)
    private String status;

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

}