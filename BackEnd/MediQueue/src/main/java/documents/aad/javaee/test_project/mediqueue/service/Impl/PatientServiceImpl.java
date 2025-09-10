package documents.aad.javaee.test_project.mediqueue.service.Impl;


import documents.aad.javaee.test_project.mediqueue.dto.PasswordChangeDto;
import documents.aad.javaee.test_project.mediqueue.dto.PatientInfoUpdateDto;
import documents.aad.javaee.test_project.mediqueue.dto.PatientProfileViewDto;
import documents.aad.javaee.test_project.mediqueue.entity.User;
import documents.aad.javaee.test_project.mediqueue.repostry.UserRepository;
import documents.aad.javaee.test_project.mediqueue.service.PatientService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Path rootLocation = Paths.get("uploads/patient_avatars");

    @Override
    public PatientProfileViewDto getPatientProfile(String username) {
        User patient = findUserByUsername(username);
        return PatientProfileViewDto.builder()
                .fullName(patient.getFirstName() + " " + patient.getLastName())
                .email(patient.getEmail())
                .avatarUrl(patient.getAvatarUrl())
                .build();
    }

    @Override
    public void updatePatientInfo(String username, PatientInfoUpdateDto infoDto, MultipartFile profileImage) throws IOException {
        User patient = findUserByUsername(username);


        if (infoDto.getFullName() != null && !infoDto.getFullName().trim().isEmpty()) {
            String[] names = infoDto.getFullName().split(" ", 2);
            patient.setFirstName(names.length > 0 ? names[0] : "");
            patient.setLastName(names.length > 1 ? names[1] : "");
        }


        if (infoDto.getEmail() != null && !infoDto.getEmail().trim().isEmpty()) {
            patient.setEmail(infoDto.getEmail());
        }

        if (profileImage != null && !profileImage.isEmpty()) {
            if (!List.of("image/jpeg", "image/png", "image/gif").contains(profileImage.getContentType())) {
                throw new IOException("Invalid image file type");
            }
            String fileExtension = FilenameUtils.getExtension(profileImage.getOriginalFilename());
            String fileName = UUID.randomUUID().toString() + "." + fileExtension;

            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }
            try (InputStream inputStream = profileImage.getInputStream()) {
                Files.copy(inputStream, this.rootLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            }
            patient.setAvatarUrl("/patient_avatars/" + fileName);
        }
        userRepository.save(patient);
    }

    @Override
    public void changePatientPassword(String username, PasswordChangeDto passwordDto) {
        User patient = findUserByUsername(username);


        if (!passwordEncoder.matches(passwordDto.getCurrentPassword(), patient.getPassword())) {
            throw new IllegalStateException("Incorrect current password");
        }

        if (passwordDto.getNewPassword() == null || passwordDto.getNewPassword().trim().isEmpty()) {
            throw new IllegalStateException("New password cannot be empty");
        }

        patient.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
        userRepository.save(patient);
    }

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + username));
    }
}