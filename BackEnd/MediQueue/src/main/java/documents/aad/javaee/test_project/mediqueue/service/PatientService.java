package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.PasswordChangeDto;
import documents.aad.javaee.test_project.mediqueue.dto.PatientInfoUpdateDto;
import documents.aad.javaee.test_project.mediqueue.dto.PatientProfileViewDto;
import io.jsonwebtoken.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface PatientService {
    PatientProfileViewDto getPatientProfile(String username);
    void updatePatientInfo(String username, PatientInfoUpdateDto infoDto, MultipartFile profileImage) throws IOException, java.io.IOException;
    void changePatientPassword(String username, PasswordChangeDto passwordDto);
}