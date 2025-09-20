package documents.aad.javaee.test_project.mediqueue.service;


import documents.aad.javaee.test_project.mediqueue.dto.DoctorRegisterDto;
import documents.aad.javaee.test_project.mediqueue.entity.Doctor;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DoctorService {

    Doctor registerDoctor(DoctorRegisterDto dto);
    List<Doctor> getAllDoctors();
    Page<DoctorRegisterDto> getAllDoctors(int page, int size);
    Doctor getDoctorById(Integer id);
    Doctor updateDoctor(Integer id, DoctorRegisterDto dto);
    void deleteDoctor(Integer id);
}