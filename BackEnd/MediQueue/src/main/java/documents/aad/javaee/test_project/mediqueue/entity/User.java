package documents.aad.javaee.test_project.mediqueue.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
// === අලුතින් Import කරන්න ===
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection; // === අලුතින් Import කරන්න ===
import java.util.HashSet;
import java.util.List; // === අලුතින් Import කරන්න ===
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "user")
// === UserDetails interface එක Implement කරන්න ===
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    private String firstName;


    @Column(nullable = false)
    private String lastName;


    @Column(nullable = false, unique = true)
    private String contactNumber;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<MedicalRecord> medicalRecords = new HashSet<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Token> tokens = new HashSet<>();


    // =======================================================
    // === UserDetails Interface එකට අදාළ Methods එකතු කිරීම ===
    // =======================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // පරිශීලකයාගේ role එක "ROLE_" උපසර්ගය සමඟ Security වලට ලබා දීම
        // (උදා: "ROLE_ADMIN", "ROLE_PATIENT")
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        // Password field එක return කිරීම
        return this.password;
    }

    @Override
    public String getUsername() {
        // Spring Security, "username" ලෙස සලකන්නේ කුමක්දැයි මෙතනින් ලබා දීම.
        // අපි Login වීමට username field එක භාවිතා කරන නිසා, එය return කරන්න.
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        // ගිණුම කල් ඉකුත් වී නැති බවට (Default: true)
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // ගිණුම lock කර නැති බවට (Default: true)
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Credentials කල් ඉකුත් වී නැති බවට (Default: true)
        return true;
    }

    @Override
    public boolean isEnabled() {
        // ගිණුම සක්‍රීය බවට (Default: true)
        return true;
    }
}