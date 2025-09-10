package documents.aad.javaee.test_project.mediqueue.service;


import documents.aad.javaee.test_project.mediqueue.dto.DoctorRegisterDto;
import documents.aad.javaee.test_project.mediqueue.entity.Doctor;

import java.util.List;


public interface DoctorService {

    Doctor registerDoctor(DoctorRegisterDto dto);
    List<Doctor> getAllDoctors();
    Doctor getDoctorById(Integer id);
    Doctor updateDoctor(Integer id, DoctorRegisterDto dto);
    void deleteDoctor(Integer id);
}