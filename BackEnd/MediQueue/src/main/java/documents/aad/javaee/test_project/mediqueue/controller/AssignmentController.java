package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.AssignmentDto;
import documents.aad.javaee.test_project.mediqueue.entity.ClinicDoctorAssignment;
import documents.aad.javaee.test_project.mediqueue.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @Autowired
    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<?> createAssignment(@Valid @RequestBody AssignmentDto assignmentDto) {
        try {
            assignmentService.createAssignment(assignmentDto);
            return new ResponseEntity<>(Map.of("message", "Assignment created successfully!"), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ClinicDoctorAssignment>> getAllAssignments() {
        List<ClinicDoctorAssignment> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(assignments);
    }
}