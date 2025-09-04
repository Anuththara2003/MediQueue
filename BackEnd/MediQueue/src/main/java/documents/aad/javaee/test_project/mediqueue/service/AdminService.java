package documents.aad.javaee.test_project.mediqueue.service;


import documents.aad.javaee.test_project.mediqueue.dto.AdminProfileDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AdminService {
    void updateProfile(String username, AdminProfileDto profileDto, MultipartFile profileImage) throws IOException;
}