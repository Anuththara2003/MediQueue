package documents.aad.javaee.test_project.mediqueue.service.Impl;

import documents.aad.javaee.test_project.mediqueue.dto.DoctorRegisterDto;
import documents.aad.javaee.test_project.mediqueue.entity.Doctor;
import documents.aad.javaee.test_project.mediqueue.repostry.DoctorRepository;
import documents.aad.javaee.test_project.mediqueue.service.DoctorService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctorRepository;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public Doctor registerDoctor(DoctorRegisterDto dto) {

        boolean isDuplicate = doctorRepository.existsBySlmcRegistrationNoOrEmailOrContactNumber(
                dto.getSlmcRegistrationNo(), dto.getEmail(), dto.getContactNumber());

        if (isDuplicate) {
            throw new IllegalStateException("A doctor with the same SLMC, email, or contact number already exists.");
        }


        Doctor newDoctor = new Doctor();
        newDoctor.setSlmcRegistrationNo(dto.getSlmcRegistrationNo());
        newDoctor.setFullName(dto.getFullName());
        newDoctor.setSpecialization(dto.getSpecialization());
        newDoctor.setContactNumber(dto.getContactNumber());
        newDoctor.setEmail(dto.getEmail());
        newDoctor.setStatus(dto.getStatus());
        return doctorRepository.save(newDoctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
}