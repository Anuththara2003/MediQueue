package documents.aad.javaee.test_project.mediqueue.service;


import documents.aad.javaee.test_project.mediqueue.dto.AdminProfileDto;
import documents.aad.javaee.test_project.mediqueue.dto.AdminProfileViewDto;
import documents.aad.javaee.test_project.mediqueue.dto.ClinicDto;
import documents.aad.javaee.test_project.mediqueue.dto.ClinicSaveDto;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AdminService {
    void updateProfile(String username, AdminProfileDto profileDto, MultipartFile profileImage) throws IOException;
    AdminProfileViewDto getAdminProfile(String username);
    void addClinic(ClinicSaveDto clinicSaveDto);
    List<ClinicSaveDto> getAllClinics();
    Page<ClinicSaveDto> getAllClinics(int page, int size);
    ClinicSaveDto getClinicById(Integer id);
}