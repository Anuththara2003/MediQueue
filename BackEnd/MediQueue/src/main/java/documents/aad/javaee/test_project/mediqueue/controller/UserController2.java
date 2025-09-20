package documents.aad.javaee.test_project.mediqueue.controller;


import documents.aad.javaee.test_project.mediqueue.dto.ApiResponse;
import documents.aad.javaee.test_project.mediqueue.dto.UserResponseDto;
import documents.aad.javaee.test_project.mediqueue.entity.Role;
import documents.aad.javaee.test_project.mediqueue.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users") // Base URL for User Management
public class UserController2 {

    @Autowired
    private UserService userService;

//    @GetMapping("/patients") // <<--- URL එක වඩාත් පැහැදිලි ලෙස වෙනස් කිරීම
//    public ResponseEntity<List<UserResponseDto>> getAllPatients() {
//
//        List<UserResponseDto> patients = userService.getUsersByRole( Role.PATIENT);
//        return ResponseEntity.ok(patients);
//    }

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserResponseDto> patientPage = userService.getUsersByRole(page, size, Role.PATIENT);

        return ResponseEntity.ok(
                new ApiResponse(200, "All patients retrieved successfully", patientPage)
        );
    }



    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }



}