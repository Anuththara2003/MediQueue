package documents.aad.javaee.test_project.mediqueue.service.Impl;

import documents.aad.javaee.test_project.mediqueue.dto.DoctorRegisterDto;
import documents.aad.javaee.test_project.mediqueue.entity.Doctor;
import documents.aad.javaee.test_project.mediqueue.repostry.DoctorRepository;
import documents.aad.javaee.test_project.mediqueue.service.DoctorService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctorRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository, ModelMapper modelMapper) {
        this.doctorRepository = doctorRepository;
        this.modelMapper = modelMapper;
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

    @Override
    public Page<DoctorRegisterDto> getAllDoctors(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());


        Page<Doctor> doctorPage = doctorRepository.findAll(pageable);


        return doctorPage.map(doctor -> modelMapper.map(doctor, DoctorRegisterDto.class));
    }

    @Override
    public Doctor getDoctorById(Integer id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }

    @Override
    public Doctor updateDoctor(Integer id, DoctorRegisterDto dto) {
        Doctor existingDoctor = getDoctorById(id);


        existingDoctor.setFullName(dto.getFullName());
        existingDoctor.setSlmcRegistrationNo(dto.getSlmcRegistrationNo());
        existingDoctor.setSpecialization(dto.getSpecialization());
        existingDoctor.setEmail(dto.getEmail());
        existingDoctor.setContactNumber(dto.getContactNumber());
        existingDoctor.setStatus(dto.getStatus());

        return doctorRepository.save(existingDoctor);
    }

    @Override
    public void deleteDoctor(Integer id) {
        if (!doctorRepository.existsById(id)) {
            throw new RuntimeException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);

    }
}