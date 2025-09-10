package documents.aad.javaee.test_project.mediqueue.controller;


import documents.aad.javaee.test_project.mediqueue.dto.UserResponseDto;
import documents.aad.javaee.test_project.mediqueue.entity.Role;
import documents.aad.javaee.test_project.mediqueue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users") // Base URL for User Management
public class UserController2 {

    @Autowired
    private UserService userService;

    @GetMapping("/patients") // <<--- URL එක වඩාත් පැහැදිලි ලෙස වෙනස් කිරීම
    public ResponseEntity<List<UserResponseDto>> getAllPatients() {

        List<UserResponseDto> patients = userService.getUsersByRole( Role.PATIENT);
        return ResponseEntity.ok(patients);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

}