package documents.aad.javaee.test_project.mediqueue.service.Impl;

import documents.aad.javaee.test_project.mediqueue.dto.AssignmentDto;
import documents.aad.javaee.test_project.mediqueue.entity.Clinic;
import documents.aad.javaee.test_project.mediqueue.entity.ClinicDoctorAssignment;
import documents.aad.javaee.test_project.mediqueue.entity.Doctor;
import documents.aad.javaee.test_project.mediqueue.repostry.ClinicDoctorAssignmentRepository;
import documents.aad.javaee.test_project.mediqueue.repostry.ClinicRepository;
import documents.aad.javaee.test_project.mediqueue.repostry.DoctorRepository;
import documents.aad.javaee.test_project.mediqueue.service.AssignmentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    private final ClinicDoctorAssignmentRepository assignmentRepository;
    private final DoctorRepository doctorRepository;
    private final ClinicRepository clinicRepository;

    @Autowired
    public AssignmentServiceImpl(ClinicDoctorAssignmentRepository assignmentRepository,
                                 DoctorRepository doctorRepository,
                                 ClinicRepository clinicRepository) {
        this.assignmentRepository = assignmentRepository;
        this.doctorRepository = doctorRepository;
        this.clinicRepository = clinicRepository;
    }

    @Override
    public ClinicDoctorAssignment createAssignment(AssignmentDto dto) {
        // 1. DTO එකේ ඇති ID වලින් අදාළ Doctor සහ Clinic objects ලබාගැනීම
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + dto.getDoctorId()));

        Clinic clinic = clinicRepository.findById(dto.getClinicId())
                .orElseThrow(() -> new RuntimeException("Clinic not found with ID: " + dto.getClinicId()));

        // 2. අලුත් ClinicDoctorAssignment entity object එකක් නිර්මාණය කිරීම
        ClinicDoctorAssignment newAssignment = new ClinicDoctorAssignment();
        newAssignment.setDoctor(doctor); // සම්පූර්ණ Doctor object එක set කිරීම
        newAssignment.setClinic(clinic); // සම්පූර්ණ Clinic object එක set කිරීම
        newAssignment.setAssignedDate(dto.getAssignedDate());
        newAssignment.setStartTime(dto.getStartTime());
        newAssignment.setEndTime(dto.getEndTime());

        // 3. නිර්මාණය කළ object එක database එකේ save කිරීම
        return assignmentRepository.save(newAssignment);
    }

    @Override
    public List<ClinicDoctorAssignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }
}