package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.AssignmentDto;
import documents.aad.javaee.test_project.mediqueue.entity.ClinicDoctorAssignment;

import java.util.List;

public interface AssignmentService {

    ClinicDoctorAssignment createAssignment(AssignmentDto assignmentDto);
    List<ClinicDoctorAssignment> getAllAssignments();
}