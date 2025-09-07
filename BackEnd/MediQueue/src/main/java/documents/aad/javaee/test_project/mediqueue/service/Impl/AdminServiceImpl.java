package documents.aad.javaee.test_project.mediqueue.service.Impl;


import documents.aad.javaee.test_project.mediqueue.Exception.ResourceNotFoundException;
import documents.aad.javaee.test_project.mediqueue.dto.AdminProfileDto;
import documents.aad.javaee.test_project.mediqueue.dto.AdminProfileViewDto;
import documents.aad.javaee.test_project.mediqueue.dto.ClinicSaveDto;
import documents.aad.javaee.test_project.mediqueue.entity.Clinic;
import documents.aad.javaee.test_project.mediqueue.entity.Hospital;
import documents.aad.javaee.test_project.mediqueue.entity.User;
import documents.aad.javaee.test_project.mediqueue.repostry.ClinicRepository;
import documents.aad.javaee.test_project.mediqueue.repostry.HospitalRepository;
import documents.aad.javaee.test_project.mediqueue.repostry.UserRepository;
import documents.aad.javaee.test_project.mediqueue.service.AdminService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Path rootLocation = Paths.get("uploads/avatars");


    private final HospitalRepository hospitalRepository;
    private final ClinicRepository clinicRepository;

    @Override
    public void updateProfile(String username, AdminProfileDto profileDto, MultipartFile profileImage) throws IOException, java.io.IOException {
        User adminUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with username: " + username));
        if (profileImage != null && !profileImage.isEmpty()) {
            if (!List.of("image/jpeg", "image/png", "image/gif").contains(profileImage.getContentType())) {
                throw new IOException("Invalid image file type: " + profileImage.getContentType());
            }

            String originalFilename = StringUtils.cleanPath(profileImage.getOriginalFilename());
            String fileExtension = FilenameUtils.getExtension(originalFilename);
            String fileName = UUID.randomUUID().toString() + "." + fileExtension;

            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }

            try (InputStream inputStream = profileImage.getInputStream()) {
                Files.copy(inputStream, this.rootLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            }

            String avatarUrl = "/avatars/" + fileName;
            adminUser.setAvatarUrl(avatarUrl);
        }

        if (profileDto.getFirstName() != null && !profileDto.getFirstName().trim().isEmpty()) {
            adminUser.setFirstName(profileDto.getFirstName());
        }

        if (profileDto.getLastName() != null && !profileDto.getLastName().trim().isEmpty()) {
            adminUser.setLastName(profileDto.getLastName());
        }

        if (profileDto.getNewPassword() != null && !profileDto.getNewPassword().trim().isEmpty()) {
            adminUser.setPassword(passwordEncoder.encode(profileDto.getNewPassword()));
        }

        userRepository.save(adminUser);
    }

    @Override
    public AdminProfileViewDto getAdminProfile(String username) {
        User adminUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with username: " + username));

        return AdminProfileViewDto.builder()
                .firstName(adminUser.getFirstName())
                .lastName(adminUser.getLastName())
                .email(adminUser.getEmail())
                .avatarUrl(adminUser.getAvatarUrl())
                .build();
    }

    @Override
    public void addClinic(ClinicSaveDto clinicSaveDto) {
        Hospital hospital = hospitalRepository.findById(Math.toIntExact(clinicSaveDto.getHospitalId()))
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with ID: " + clinicSaveDto.getHospitalId()));

        // 2. අලුත් Clinic object එකක් හදනවා.
        Clinic newClinic = new Clinic();
        newClinic.setName(clinicSaveDto.getName());
        newClinic.setStartTime(clinicSaveDto.getStartTime());
        newClinic.setEndTime(clinicSaveDto.getEndTime());

        // 3. Clinic එකට අදාළ Hospital එක සම්බන්ධ කරනවා.
        newClinic.setHospital(hospital);

        // 4. Hospital එකේ තියෙන clinics list එකට, මේ අලුත් clinic එක එකතු කරනවා.
        hospital.getClinics().add(newClinic);

        // 5. Hospital එකම save කරනවා. CascadeType.ALL නිසා Clinic එකත් ඉබේම save වෙනවා.
        hospitalRepository.save(hospital);
    }

    @Override
    public List<ClinicSaveDto> getAllClinics() {
        List<Clinic> clinics = clinicRepository.findAll();

        return clinics.stream()
                .map(clinic -> new ClinicSaveDto(
                        clinic.getId(),
                        clinic.getName(),
                        clinic.getStartTime(),
                        clinic.getEndTime(),
                        clinic.getHospital().getId(),
                        clinic.getHospital().getName()
                ))
                .collect(Collectors.toList());
    }



}