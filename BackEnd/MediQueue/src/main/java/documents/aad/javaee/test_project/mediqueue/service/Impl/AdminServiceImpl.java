package documents.aad.javaee.test_project.mediqueue.service.Impl;


import documents.aad.javaee.test_project.mediqueue.Exception.ResourceNotFoundException;
import documents.aad.javaee.test_project.mediqueue.dto.AdminProfileDto;
import documents.aad.javaee.test_project.mediqueue.entity.User;
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

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Path rootLocation = Paths.get("uploads/avatars");

    @Override
    public void updateProfile(String username, AdminProfileDto profileDto, MultipartFile profileImage) throws IOException, java.io.IOException {
        User adminUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with email: " + username));

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

            adminUser.setAvatarUrl("/" + rootLocation.getFileName().toString() + "/" + fileName);
        }

        adminUser.setFirstName(profileDto.getFirstName());
        adminUser.setLastName(profileDto.getLastName());

        if (profileDto.getNewPassword() != null && !profileDto.getNewPassword().trim().isEmpty()) {
            adminUser.setPassword(passwordEncoder.encode(profileDto.getNewPassword()));
        }

        userRepository.save(adminUser);
    }


}